import { Snackbar } from "@mui/material";

import { CloseIcon } from "@/components/icons/CloseIcon";
import { useCommonStore } from "@/store";

export const Toast = () => {
  const { toast, setToast } = useCommonStore();

  const handleClose = () => {
    setToast("");
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!toast}
      onClose={handleClose}
      message={`Error: ${toast}`}
      autoHideDuration={3000}
      action={<CloseIcon onClick={handleClose} />}
    />
  );
};
