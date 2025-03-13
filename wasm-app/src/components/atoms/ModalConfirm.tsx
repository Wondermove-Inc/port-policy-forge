import { Modal, ModalBody, ModalHeader } from "@skuber/components";

import { DescriptionWithDetails } from "./DescriptionWithDetails";
import { ModalFooter } from "./ModalFooter";

type ModalConfirmProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  descriptionDetails: string[];
  loading?: boolean;
};

export const ModalConfirm = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  descriptionDetails,
  loading,
}: ModalConfirmProps) => {
  return (
    <Modal width={434} open={open} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <DescriptionWithDetails
          description={description}
          details={descriptionDetails}
        />
      </ModalBody>
      <ModalFooter
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Confirm"
        onClickCancelButton={onClose}
        onClickConfirmButton={onConfirm}
        loading={loading}
      />
    </Modal>
  );
};
