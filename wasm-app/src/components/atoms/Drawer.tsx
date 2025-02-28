import { ReactNode } from "react";

import { Box, Drawer as MuiDrawer, DrawerProps } from "@mui/material";
import { Typography } from "@skuber/components";

import { CloseIcon } from "@/components/icons/CloseIcon";

export type DrawerBaseProps = DrawerProps & {
  title: string;
  subTitle: string;
  children: ReactNode;
  onClose: () => void;
};

export const Drawer = ({
  title,
  subTitle,
  children,
  onClose,
  ...props
}: DrawerBaseProps) => {
  return (
    <MuiDrawer
      anchor="right"
      sx={{
        ".MuiDrawer-paper": {
          boxShadow: "none",
          backgroundColor: "background.secondary",
          borderLeft: "1px solid",
          borderRight: 0,
          borderColor: "border.default",
          marginTop: "56px",
          height: "calc(100% - 56px)",
        },
        ".MuiBackdrop-root": {
          marginTop: "56px",
        }
      }}
      {...props}
    >
      <Box
        sx={{
          padding: "20px",
          borderBottom: "1px solid",
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
            size={16}
          />
        </Box>
        <Typography variant="caption" lineHeight={"15px"} component={"p"}>
          {subTitle}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "20px",
          borderTop: 0,
        }}
      >
        {children}
      </Box>
    </MuiDrawer>
  );
};
