import { useForm, Controller } from "react-hook-form";
import { Box, List, ListItem, TextField } from "@mui/material";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Select,
  Table,
  Textarea,
  Toggle,
  Typography,
} from "@skuber/components";
import { defaultTheme } from "@skuber/theme";
import { useState } from "react";
import { AddIcon } from "../../../../icons/AddIcon";
import { DeleteIcon } from "../../../../icons/DeleteIcon";

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
  const form = useForm({
    defaultValues: {
      source: "",
      type: "",
      comment: "",
    },
  });
  
  const { control} = form;

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
      <Modal width={646} open={isPortSettingOpened} onClose={() => {}}>
        <ModalHeader title="Port Access settings" onClose={handleClosePortSettingModal} />
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "18px 20px",
                borderBottom: "1px solid",
                borderColor: "border.default",
              }}
            >
              <Typography variant="body1">Allow full access</Typography>
              <Toggle onChange={() => {}} />
            </Box>
            <Box
              sx={{
                paddingX: "20px",
              }}
            >
              <Typography>Opening the port will result in the following changes</Typography>
              <List sx={{ padding: "12px 0 0 24px", listStyleType: "disc", ...defaultTheme.typography.body2 }}>
                <ListItem sx={{ display: "list-item", padding: 0 }}>
                  The closed port becomes externally accessible again.
                </ListItem>
                <ListItem sx={{ display: "list-item", padding: 0 }}>
                  Service traffic through that port is allowed.
                </ListItem>
              </List>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                paddingX: "20px",
              }}
            >
              <Radio label="Open only some ports"></Radio>
              <Radio label="Open excluding some ports"></Radio>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingX: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TextField
                  id="source"
                  label="Source"
                  sx={{
                    flex: 1,
                    ".MuiFormLabel-root": {
                      bgcolor: "unset !important",
                    },
                  }}
                />
                <Select
                  sx={{
                    flex: 1,
                  }}
                  options={[
                    {
                      label: "TCP",
                      value: "tcp",
                    },
                  ]}
                />
              </Box>
              <Textarea
                label="Comment"
                sx={{
                  ".MuiFormLabel-root": {
                    bgcolor: "unset !important",
                  },
                }}
              />
            </Box>
            <DeleteIcon size={20} />
            <Button
              variant="text"
              size="extraSmall"
              sx={{
                width: "94px",
                height: "24px",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AddIcon size={16} color="white" />
              <Typography variant="labelBold">Add Source</Typography>
            </Button>
          </Box>
        </Box>
        <ModalFooter
          cancelButtonTitle="Cancel"
          confirmButtonTitle="Apply"
          onClickCancelButton={handleClosePortSettingModal}
          onClickConfirmButton={() => {}}
        />
      </Modal>
    </>
  );
};
