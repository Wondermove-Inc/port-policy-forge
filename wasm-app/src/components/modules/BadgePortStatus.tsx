import { Box } from "@mui/material";

import { PORT_STATUS_MAP } from "@/constants";
import { STATUS_MAP } from "@/models";

export const BadgePortStatus = ({ status }: { status: number }) => {
  const key = STATUS_MAP[status];
  const { label, color, backgroundColor } = PORT_STATUS_MAP[key];

  return (
    <Box
      sx={{
        color,
        border: "1px solid",
        borderColor: color,
        backgroundColor,
        borderRadius: "8px",
        padding: "4px 8px",
        typography: "caption",
        width: "fit-content",
        minWidth: "48px",
        textAlign: "center",
      }}
    >
      {label}
    </Box>
  );
};
