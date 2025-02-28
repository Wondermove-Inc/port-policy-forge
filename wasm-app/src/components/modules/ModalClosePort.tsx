import { List, ListItem } from "@mui/material";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Typography,
} from "@skuber/components";

type ModalClosePortProps = {
  open: boolean;
  handleCloseModal: () => void;
  handleConfirmButton: () => void;
};
export const ModalClosePort = ({
  open,
  handleCloseModal,
  handleConfirmButton,
}: ModalClosePortProps) => {
  return (
    <Modal width={434} open={open} onClose={handleCloseModal}>
      <ModalHeader title="Close selected ports" onClose={handleCloseModal} />
      <ModalBody>
        <Typography>
          Closing selected ports makes the following changes
        </Typography>
        <List
          sx={{
            paddingLeft: "24px",
            listStyleType: "disc",
            typography: "body2",
            fontWeight: 400,
            color: "text.secondary",
          }}
        >
          <ListItem sx={{ display: "list-item", padding: 0 }}>
            Closed ports will no longer be accessible externally.
          </ListItem>
          <ListItem sx={{ display: "list-item", padding: 0 }}>
            To reopen a port, you must manually reset it.
          </ListItem>
        </List>
      </ModalBody>
      <ModalFooter
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Confirm"
        onClickCancelButton={handleCloseModal}
        onClickConfirmButton={handleConfirmButton}
      />
    </Modal>
  );
};
