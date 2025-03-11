import { useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";
import { useForm } from "react-hook-form";

import { ModalPortSetting } from "./ModalPortSetting";
import { PortDetail } from "./PortDetail";

import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import { AddIcon } from "@/components/icons/AddIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { BadgePortStatus } from "@/components/modules/common/BadgePortStatus";
import { CollapsibleTable } from "@/components/modules/common/CollapsibleTable";
import { INITIAL_ACCESS_SOURCE } from "@/constants";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  AccessPolicy,
  Port,
  PortAccessSettingForm,
  PortDirection,
  PortStatus,
} from "@/models";
import { wasmCloseOpenedPort } from "@/services/closeOpenedPort";
import { wasmEditPort } from "@/services/editPort";
import { wasmOpenPort } from "@/services/openPort";
import { useCommonStore } from "@/store";
import { getAccessPolicyLabel, getPortFlag, getPortNumberValue } from "@/utils";
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

  const { setToast } = useCommonStore();

  const isInbound = portDirection === PortDirection.INBOUND;

  const defaultValues = useMemo(() => {
    return {
      workloadUuid,
      flag: getPortFlag(portDirection),
      portSpec: "",
      accessSources: [INITIAL_ACCESS_SOURCE],
      accessPolicy: AccessPolicy.ALLOW_ONLY,
      allowFullAccess: false,
    };
  }, [portDirection, workloadUuid]);

  const form = useForm<PortAccessSettingForm>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(openPortSchema(portDirection)),
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
        id: "accessPolicy",
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
              {getAccessPolicyLabel(
                record.accessPolicy || "",
                record.direction,
              )}
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

  const sortedPorts = useMemo(() => {
    const statusOrder = {
      [PortStatus.UNCONNECTED]: 1,
      [PortStatus.IDLE]: 2,
      [PortStatus.ACTIVE]: 3,
      [PortStatus.ERROR]: 4,
    };
    return data.sort((item1, item2) => {
      if (
        statusOrder[item1.status as PortStatus] !==
        statusOrder[item2.status as PortStatus]
      ) {
        return (
          statusOrder[item1.status as PortStatus] -
          statusOrder[item2.status as PortStatus]
        );
      }
      return item1.portNumberLabel.localeCompare(item2.portNumberLabel);
    });
  }, [data]);

  const openClosePortModal = (record: Port) => {
    setSelectedPort(record);
    closePortModal.open();
  };

  const openEditPortModal = (record: Port) => {
    setSelectedPort(record);
    form.reset({
      workloadUuid,
      flag: getPortFlag(record?.direction),
      portSpec: getPortNumberValue({
        isRange: record.isRange,
        portRange: record.portRange,
        portNumber: record.portNumber,
      }),
      accessSources: record.accessSources || [INITIAL_ACCESS_SOURCE],
      accessPolicy: record.accessPolicy,
      allowFullAccess: record.accessPolicy === AccessPolicy.ALLOW_ALL,
    });
    openPortModal.open();
  };

  const openOpenPortModal = () => {
    setSelectedPort(null);
    form.reset(defaultValues);
    openPortModal.open();
  };

  const closeOpenPortModal = () => {
    setSelectedPort(null);
    form.reset(defaultValues);
    form.clearErrors();
    openPortModal.close();
  };

  const handlePortEdit = (data: PortAccessSettingForm) => {
    setLoading(true);
    const params = {
      workloadUuid,
      flag: getPortFlag(portDirection),
      portSpec: data.portSpec.trim(),
      sources: data.accessSources || [],
      accessPolicy: (data.allowFullAccess
        ? AccessPolicy.ALLOW_ALL
        : data.accessPolicy) as AccessPolicy,
    };
    console.log("wasmEditPort and wasmOpenPort", params);
    const updatePort = selectedPort
      ? wasmEditPort(params)
      : wasmOpenPort(params);
    updatePort
      .then(() => {
        fetchWorkloadDetail();
        closeOpenPortModal();
      })
      .catch((error) => {
        setToast(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePortClose = () => {
    if (!selectedPort) {
      return;
    }
    setLoading(true);
    const params = {
      workloadUuid: workloadUuid,
      flag: getPortFlag(selectedPort?.direction),
      portSpec: getPortNumberValue({
        isRange: selectedPort.isRange,
        portRange: selectedPort.portRange,
        portNumber: selectedPort.portNumber,
      }),
    };
    console.log("wasmCloseOpenedPort", params);
    wasmCloseOpenedPort(params)
      .then(() => {
        fetchWorkloadDetail();
        closePortModal.close();
      })
      .catch((error) => {
        setToast(error);
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
          {`Open (${formatNumber(data.length) || 0})`}
        </Typography>
        <Button
          variant="outlined"
          size="extraSmall"
          sx={{
            width: "94px",
            height: "24px",
          }}
          onClick={openOpenPortModal}
        >
          <AddIcon size={16} />
          Open Port
        </Button>
      </Box>
      <CollapsibleTable
        columns={columns}
        data={sortedPorts}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) =>
          record.status !== PortStatus.UNCONNECTED ? (
            <PortDetail record={record} open={true} />
          ) : undefined
        }
      />
      <ModalPortSetting
        isOpen={openPortModal.visible}
        handleClose={closeOpenPortModal}
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
