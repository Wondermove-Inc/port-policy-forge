import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: "background.secondary",
        padding: "14px 20px",
        borderBottom: "1px solid",
        borderColor: "border.default",
        minWidth: 1280
      }}
    >
      <Typography
        color="text.primary"
        variant="h2"
        lineHeight="27px"
        fontFamily="Montserrat"
      >
        Port Policy Forge
      </Typography>
    </Box>
  );
};
