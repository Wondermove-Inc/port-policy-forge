import { ModalConfirm } from "../atoms/ModalConfirm";

type ModalClosePortProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
};
export const ModalClosePort = ({
  open,
  title = "Close port",
  onClose,
  onConfirm,
}: ModalClosePortProps) => {
  return (
    <ModalConfirm
      title={title}
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
