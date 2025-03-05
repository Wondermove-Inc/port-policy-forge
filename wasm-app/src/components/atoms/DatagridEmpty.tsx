import { Box, Typography } from "@mui/material";

type DatagridEmptyProps = {
  title?: string;
  description?: string;
};

export const DatagridListEmpty = ({
  title = "No enrolled data yet",
  description = "",
}: DatagridEmptyProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
      }}
    >
      {/* <DataIcon sx={{ marginBottom: "18px" }} size={78} /> */}
      <Typography color="grey.500">{title}</Typography>
      {description && (
        <Typography color="grey.400" whiteSpace="pre-line">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export const DatagridEmpty = ({
  text,
  error,
  height = 54,
}: {
  text: string;
  error?: boolean;
  height?: number;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height,
        backgroundColor: "white",
        borderBottom: "1px solid",
        borderColor: "black.5",
      }}
    >
      <Typography color={error ? "red.base" : "grey.400"}>{text}</Typography>
    </Box>
  );
};
