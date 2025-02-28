import { ModalConfirm } from "../atoms/ModalConfirm";

type ModalClosePortProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
export const ModalClosePort = ({
  open,
  onClose,
  onConfirm,
}: ModalClosePortProps) => {
  return (
    <ModalConfirm
      title="Close ports"
      description="Closing an port makes the following changes"
      descriptionDetails={[
        "Closed ports will no longer be accessible externally.",
        "To reopen a port, you must manually reset it.",
      ]}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
