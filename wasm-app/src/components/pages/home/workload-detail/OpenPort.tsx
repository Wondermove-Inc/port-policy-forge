import { useMemo, useState } from "react";

import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";
import { useForm } from "react-hook-form";

import { PortSettingModal } from "./_PortSettingModal";
import { PortDetail } from "./PortDetail";

import { AddIcon } from "@/components/icons/AddIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { BadgePortStatus } from "@/components/modules/BadgePortStatus";
import { CollapsibleTable } from "@/components/modules/CollapsibleTable";
import { ModalClosePort } from "@/components/modules/ModalClosePort";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Port, PortAccessSettingForm, PortDirection } from "@/models";

type OpenPortProps = {
  data: Port[];
  portDirection: PortDirection;
  fetchWorkloadDetail: () => void;
};

export const OpenPort = ({
  data,
  portDirection,
  fetchWorkloadDetail,
}: OpenPortProps) => {
  const openPortModal = useDisclosure();
  const closePortModal = useDisclosure();

  const [recordSelected, setRecordSelected] = useState<Port | null>(null);

  const isInbound = portDirection === PortDirection.INBOUND;

  const form = useForm<PortAccessSettingForm>({
    defaultValues: {
      sources: [
        {
          source: "",
          type: "",
          comment: "",
        },
      ],
      allowFullAccess: false,
      access: 3,
      port: null,
    },
    mode: "onChange",
  });

  const columns = useMemo(
    () => [
      {
        id: "portNumber",
        label: "Number",
        sortable: false,
        width: 80,
        render: (record: Port) => (
          <Typography variant="b2_m">{record.portNumber}</Typography>
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
        id: "access",
        label: "Access ",
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
              {record.access}
            </Typography>
            <EditIcon
              size={16}
              sx={{ cursor: "pointer" }}
              onClick={() => handleEdit(record)}
            />
          </Box>
        ),
      },
      {
        id: "close",
        label: "",
        sortable: false,
        width: 63,
        render: () => (
          <Typography
            variant="b2_r"
            color="primary.dark"
            sx={{ cursor: "pointer" }}
            onClick={closePortModal.open}
          >
            Close
          </Typography>
        ),
      },
    ],
    [portDirection],
  );

  const handleEdit = (record: Port) => {
    setRecordSelected(record);
    openPortModal.open();
  };

  const handleClose = () => {
    setRecordSelected(null);
    form.reset();
    openPortModal.close();
  };

  const handleSubmit = () => {
    // TODO
    fetchWorkloadDetail();
    handleClose();
  };

  const handlePortClose = () => {
    // TODO
    fetchWorkloadDetail();
    closePortModal.close();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          {`Open (${data?.length || 0})`}
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
          record.source ? <PortDetail record={record} /> : undefined
        }
      />
      <PortSettingModal
        isOpen={openPortModal.visible}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        port={recordSelected}
        isInbound={isInbound}
        form={form}
      />
      <ModalClosePort
        open={closePortModal.visible}
        onClose={closePortModal.close}
        onConfirm={handlePortClose}
      />
    </Box>
  );
};
