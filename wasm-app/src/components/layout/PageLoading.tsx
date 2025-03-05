import { Box, CircularProgress } from "@mui/material";

export const PageLoading = () => (
  <Box
    sx={{
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
