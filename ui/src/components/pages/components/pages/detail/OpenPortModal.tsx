import { useState } from "react";

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
import { PortAccessSettingForm } from "../../../../../models/WorkLoadDetail";

const data = [
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
  {
    portNumber: 820,
    source: "89.0.142.86",
    lastConnection: "2022-01-01 00:00:00",
  },
];

export const OpenPortModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPortSettingOpened, setIsPortSettingOpened] = useState(true);
  const form = useForm<PortAccessSettingForm>({
    defaultValues: {
      sources: [
        {
          source: "",
          type: "",
          comment: "",
        },
      ],
    },
  });

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleClosePortSettingModal = () => {
    setIsPortSettingOpened(false);
  };

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
      render: (record: any) => (
        <Typography
          variant="b2_r"
          color="primary.dark"
          sx={{ cursor: "pointer" }}
          onClick={() => setIsPortSettingOpened(true)}
        >
          Open
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Modal width={646} open={isOpen} onClose={() => {}}>
        <ModalHeader title="Open Inbound Port" onClose={handleCloseModal} />
        <ModalBody>
          <Typography>Closed Port(820)</Typography>
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
        isOpen={isPortSettingOpened}
        handleClose={handleClosePortSettingModal}
        form={form}
      />
    </>
  );
};
