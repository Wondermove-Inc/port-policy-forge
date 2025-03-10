import { useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";
import { useForm } from "react-hook-form";

import { PortSettingModal } from "./_PortSettingModal";
import { PortDetail } from "./PortDetail";

import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import { AddIcon } from "@/components/icons/AddIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { BadgePortStatus } from "@/components/modules/common/BadgePortStatus";
import { CollapsibleTable } from "@/components/modules/common/CollapsibleTable";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  AccessPolicy,
  Port,
  PortAccessSettingForm,
  PortDirection,
  PortRangeType,
} from "@/models";
import { wasmCloseOpenedPort } from "@/services/closeOpenedPort";
import { getPortNumberValue } from "@/utils";
import { formatNumber } from "@/utils/format";
import { openPortSchema } from "@/validations";

type OpenPortProps = {
  data: Port[];
  portDirection: PortDirection;
  fetchWorkloadDetail: () => void;
  workloadUuid: string;
};

export const OpenPort = ({
  data,
  portDirection,
  fetchWorkloadDetail,
  workloadUuid,
}: OpenPortProps) => {
  const openPortModal = useDisclosure();
  const closePortModal = useDisclosure();

  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [loading, setLoading] = useState(false);

  const isInbound = portDirection === PortDirection.INBOUND;

  const form = useForm<PortAccessSettingForm>({
    defaultValues: {
      workloadUuid: "",
      flag: portDirection,
      portSpec: "",
      accessSources: [
        {
          ip: "",
          protocol: "",
          comment: "",
        },
      ],
      accessPolicy: AccessPolicy.ALLOW_ONLY,
      allowFullAccess: false,
    },
    mode: "onChange",
    resolver: yupResolver(openPortSchema),
  });

  const columns = useMemo(
    () => [
      {
        id: "portNumberLabel",
        label: "Number",
        sortable: false,
        width: isInbound ? 80 : 70,
        render: (record: Port) => (
          <Typography variant="b2_m">{record.portNumberLabel}</Typography>
        ),
      },
      {
        id: "status",
        label: "Status",
        sortable: false,
        width: 107,
        render: (record: Port) => <BadgePortStatus status={record.status} />,
      },
      {
        id: "sourceNumber",
        label: isInbound ? "Source" : "Destination",
        sortable: false,
        width: isInbound ? 80 : 90,
      },
      {
        id: "accessSources",
        label: "Access",
        sortable: false,
        width: 142,
        render: (record: Port) => (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="b2_r" color="text.primary">
              {record.accessPolicy}
            </Typography>
            <EditIcon
              size={16}
              sx={{ cursor: "pointer" }}
              onClick={() => openEditPortModal(record)}
            />
          </Box>
        ),
      },
      {
        id: "close",
        label: "",
        sortable: false,
        width: 63,
        sx: {
          textAlign: "center",
        },
        render: (record: Port) => (
          <Typography
            variant="b2_r"
            color="primary.dark"
            sx={{ cursor: "pointer" }}
            onClick={() => openClosePortModal(record)}
          >
            Close
          </Typography>
        ),
      },
    ],
    [portDirection],
  );

  const openClosePortModal = (record: Port) => {
    setSelectedPort(record);
    closePortModal.open();
  };

  const openEditPortModal = (record: Port) => {
    setSelectedPort(record);
    openPortModal.open();
  };

  const handleEditPortClose = () => {
    setSelectedPort(null);
    form.reset();
    openPortModal.close();
  };

  const handlePortEdit = () => {
    // TODO
    fetchWorkloadDetail();
    handleEditPortClose();
  };

  const handlePortClose = () => {
    if (!selectedPort) {
      return;
    }
    setLoading(true);
    console.log({
      workloadUuid: workloadUuid,
      flag: selectedPort?.direction === PortDirection.INBOUND ? 0 : 1,
      portSpec: getPortNumberValue({
        isRange: selectedPort.isRange,
        portRange: selectedPort.portRange as PortRangeType,
        portNumber: selectedPort.portNumber,
      }),
    });
    wasmCloseOpenedPort({
      workloadUuid: workloadUuid,
      flag: selectedPort?.direction === PortDirection.INBOUND ? 0 : 1,
      portSpec: getPortNumberValue({
        isRange: selectedPort.isRange,
        portRange: selectedPort.portRange as PortRangeType,
        portNumber: selectedPort.portNumber,
      }),
    })
      .then(() => {
        fetchWorkloadDetail();
        closePortModal.close();
      })
      .catch((error) => {
        // TODO: handle error
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "4px",
          marginBottom: "12px",
        }}
      >
        <Typography variant="subtitle1" component={"p"}>
          {`Open (${formatNumber(data.length)})`}
        </Typography>
        <Button
          variant="outlined"
          size="extraSmall"
          sx={{
            width: "94px",
            height: "24px",
          }}
          onClick={openPortModal.open}
        >
          <AddIcon size={16} />
          Open Port
        </Button>
      </Box>
      <CollapsibleTable
        columns={columns}
        data={data}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) =>
          !!record.accessSources?.length ? (
            <PortDetail record={record} />
          ) : undefined
        }
      />
      <PortSettingModal
        isOpen={openPortModal.visible}
        handleClose={handleEditPortClose}
        handleSubmit={handlePortEdit}
        port={selectedPort}
        isInbound={isInbound}
        form={form}
      />
      <ModalConfirm
        open={closePortModal.visible}
        onClose={closePortModal.close}
        onConfirm={handlePortClose}
        title="Close ports "
        description="Closing an port makes the following changes"
        descriptionDetails={[
          "Closed ports will no longer be accessible externally.",
          "To reopen a port, you must manually reset it.",
        ]}
        loading={loading}
      />
    </Box>
  );
};
