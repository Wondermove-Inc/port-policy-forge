import { List, ListItem, Typography } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@skuber/components";

type ModelCloseSelectPortProps = {
  isSelectPortOpened: boolean;
  handleCloseModal: () => void;
  handleConfirmButton: () => void;
};
export const ModelCloseSelectPort = ({
  isSelectPortOpened,
  handleCloseModal,
  handleConfirmButton,
}: ModelCloseSelectPortProps) => {
  return (
    <Modal width={434} open={isSelectPortOpened} onClose={handleCloseModal}>
      <ModalHeader title="Close selected ports" onClose={handleCloseModal} />
      <ModalBody>
        <Typography>
          Closing selected ports makes the following changes
        </Typography>
        <List
          sx={{
            paddingLeft: "24px",
            listStyleType: "disc",
            fontSize: "13px",
            fontWeight: 400,
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
