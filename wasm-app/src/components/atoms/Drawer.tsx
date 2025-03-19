import { ReactNode } from "react";

import {
  Box,
  Drawer as MuiDrawer,
  DrawerProps,
  CircularProgress,
} from "@mui/material";
import { Typography } from "@skuber/components";

import { CloseIcon } from "@/components/icons/CloseIcon";

export type DrawerBaseProps = DrawerProps & {
  title: string;
  subTitle: string;
  children: ReactNode;
  onClose: () => void;
  loading?: boolean;
};

export const Drawer = ({
  title,
  subTitle,
  children,
  onClose,
  loading = false,
  ...props
}: DrawerBaseProps) => {
  return (
    <MuiDrawer
      anchor="right"
      keepMounted
      sx={{
        "& .MuiDrawer-paper": {
          boxShadow: "none",
          backgroundColor: "background.secondary",
          borderLeft: "1px solid",
          borderRight: 0,
          borderColor: "border.default",
          display: "flex",
          flexDirection: "column",
          maxWidth: "513px",
          right: 0,
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1)",
          ...(props.open
            ? {
                width: 513,
              }
            : {
                width: 0,
              }),
          ...(props.variant === "temporary"
            ? {
                marginTop: "56px",
                height: "calc(100% - 56px)",
                position: "fixed",
              }
            : {
                position: "absolute",
                transform: "none !important",
              }),
        },
        "& .MuiBackdrop-root": {
          marginTop: "56px",
        },
      }}
      {...props}
    >
      <Box
        sx={{
          padding: "20px",
          borderBottom: "1px solid",
          borderColor: "border.default",
          display: "flex",
          gap: "8px",
          flexDirection: "column",
          opacity: loading ? 0.3 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingY: "2px",
          }}
        >
          <Typography variant="subtitle1" lineHeight={"19px"}>
            {title}
          </Typography>
          <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} size={16} />
        </Box>
        <Typography
          variant="caption"
          lineHeight={"15px"}
          component={"p"}
          color="text.secondary"
        >
          {subTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "scroll",
          padding: "24px 11px 24px 20px",
          position: "relative",
          opacity: loading ? 0.1 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </Box>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </MuiDrawer>
  );
};
