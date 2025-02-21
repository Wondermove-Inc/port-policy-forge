import { ReactNode } from "react";
import { Box, Drawer as MuiDrawer, DrawerProps } from "@mui/material";
import { Typography } from "@skuber/components";
import { CloseIcon } from "../../icons/CloseIcon";

export type DrawerBaseProps = DrawerProps & {
  title: string;
  subTitle: string;
  children: ReactNode;
  onClose: () => void;
};

export const Drawer = ({ title, subTitle, children, onClose, ...props }: DrawerBaseProps) => {
  return (
    <MuiDrawer
      anchor="right"
      sx={{
        ".MuiPaper-root": {
          marginTop: "56px",
          boxShadow: "none",
          backgroundColor: "background.secondary",
        },
        ".MuiBackdrop-root": {
          marginTop: "56px",
        },
      }}
      {...props}
    >
      <Box
        sx={{
          padding: "20px",
          border: "1px solid",
          borderColor: "border.default",
          borderTop: 0,
          display: "flex",
          gap: "8px",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle1" lineHeight={"24px"}>
            {title}
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{
              cursor: "pointer",
            }}
          />
        </Box>
        <Typography variant="caption" lineHeight={"15px"} component={"p"}>
          {subTitle}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "20px",
          border: "1px solid",
          borderColor: "border.default",
          borderTop: 0,
          height: "100%",
        }}
      >
        {children}
      </Box>
    </MuiDrawer>
  );
};
