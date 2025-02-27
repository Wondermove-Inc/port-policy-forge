import { Box } from "@mui/material";
import { Modal, ModalBody, ModalHeader, Typography } from "@skuber/components";

export const ModalConfirm = () => {
  return (
    <Modal width={646} open={false} onClose={() => {}}>
      <ModalHeader title="Open Inbound Port" onClose={() => {}} />
      <ModalBody>
        <Typography>Closed Port(820)</Typography>
        <Box
          sx={{
            bgcolor: "background.modal",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "8px",
          }}
        ></Box>
      </ModalBody>
    </Modal>
  );
};
