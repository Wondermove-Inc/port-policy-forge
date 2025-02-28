import { List, ListItem } from "@mui/material";
import { Modal, ModalBody, ModalHeader, Typography } from "@skuber/components";
import { defaultTheme } from "@skuber/theme";

import { ModalFooter } from "./ModalFooter";

type ModalConfirmProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  descriptionDetails: string[];
};

export const ModalConfirm = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  descriptionDetails,
}: ModalConfirmProps) => {
  return (
    <Modal width={434} open={open} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <Typography>{description}</Typography>
        {descriptionDetails && descriptionDetails.length > 0 && (
          <List
            sx={{
              paddingLeft: "24px",
              listStyleType: "disc",
              typography: "body2",
            }}
          >
            {descriptionDetails.map((item, index) => (
              <ListItem key={index} sx={{ display: "list-item", padding: 0 }}>
                {item}
              </ListItem>
            ))}
          </List>
        )}
      </ModalBody>
      <ModalFooter
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Confirm"
        onClickCancelButton={onClose}
        onClickConfirmButton={onConfirm}
      />
    </Modal>
  );
};
