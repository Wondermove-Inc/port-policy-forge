import { Box } from "@mui/material";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  Typography,
} from "@skuber/components";
import { useForm } from "react-hook-form";
import { PortSettingModal } from "./_PortSettingModal";
import { PortAccessSettingForm } from "@/models";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SearchComplete } from "@/components/modules/SearchComplete";

const data = [
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 821,
    source: "89.0.142.87",
    lastConnection: "2022-01-01 00:00:00",
  },
];

export const OpenPortModal = () => {
  const openPortModal = useDisclosure();
  const openPortSettingModal = useDisclosure();

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
      access: 0,
    },
  });

  const columns = [
    {
      id: "portNumber",
      label: "Number",
      sortable: false,
      width: 146,
    },
    {
      id: "source",
      label: "Source",
      sortable: false,
      width: 146,
    },
    {
      id: "lastConnection",
      label: "Last connection",
      sortable: false,
      width: 128,
    },
    {
      id: "",
      label: "",
      sortable: false,
      width: 112,
      align: "center",
      render: () => (
        <Typography
          variant="b2_r"
          color="primary.dark"
          sx={{ cursor: "pointer" }}
          onClick={openPortSettingModal.open}
        >
          Open
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Modal width={646} open={openPortModal.visible} onClose={() => {}}>
        <ModalHeader title="Open Inbound Port" onClose={openPortModal.close} />
        <ModalBody>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography>Closed Port(820)</Typography>
            <SearchComplete
              options={[]}
              placeholder="Search for a port number"
            />
          </Box>
          <Box
            sx={{
              bgcolor: "background.modal",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "8px",
            }}
          >
            <Table columns={columns} data={data} />
          </Box>
        </ModalBody>
      </Modal>
      <PortSettingModal
        isOpen={openPortSettingModal.visible}
        handleClose={openPortSettingModal.close}
        form={form}
      />
    </>
  );
};