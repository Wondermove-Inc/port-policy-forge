import { List, ListItem } from "@mui/material";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Typography,
} from "@skuber/components";
import { defaultTheme } from "@skuber/theme";

type ModalConfirmProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  detailList: string[];
};

export const ModalConfirm = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  detailList,
}: ModalConfirmProps) => {
  return (
    <Modal width={434} open={open} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <Typography>{description}</Typography>
        {detailList && detailList.length > 0 && (
          <List
            sx={{
              paddingLeft: "24px",
              listStyleType: "disc",
              ...defaultTheme.typography.body2,
            }}
          >
            {detailList.map((item, index) => (
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
