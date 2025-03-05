import { Box, Button, CircularProgress } from "@mui/material";

type ModalFooterProps = {
  cancelButtonTitle?: string;
  onClickCancelButton?: () => void;
  confirmButtonTitle?: string;
  onClickConfirmButton?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const ModalFooter = ({
  cancelButtonTitle,
  confirmButtonTitle,
  disabled = false,
  loading = false,
  onClickCancelButton,
  onClickConfirmButton,
}: ModalFooterProps) => {
  return (
    <Box
      sx={{
        p: "12px 20px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid",
        borderColor: "border.default",
        bgcolor: "background.secondary",
        position: "sticky",
        bottom: 0,
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          marginLeft: "auto",
        }}
      >
        {cancelButtonTitle && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              padding: "8px 9px",
            }}
            onClick={onClickCancelButton}
          >
            {cancelButtonTitle}
          </Button>
        )}
        {confirmButtonTitle && (
          <Button
            variant="contained"
            size="small"
            disabled={disabled}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
            onClick={onClickConfirmButton}
            sx={{
              color: "text.primary",
            }}
          >
            {confirmButtonTitle}
          </Button>
        )}
      </Box>
    </Box>
  );
};
