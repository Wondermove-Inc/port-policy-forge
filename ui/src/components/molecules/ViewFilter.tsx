import { Box, IconButton } from "@mui/material";
import { EyeIcon } from "../icons/EyeIcon";
import { Autocomplete, Toggle, Typography } from "@skuber/components";
import { CloseIcon } from "../icons/CloseIcon";
import { useState } from "react";

export const ViewFilter = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 32,
        left: 32,
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(55.5555534362793px)",
            boxShadow: "5.56px 5.56px 66.67px 0px #141923E5",
            width: 40,
            height: 40,
            backgroundColor: "#FFFFFF1A",
            border: "1px solid",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            ...(open && { borderColor: "border.elevated" }),
            "&:hover": {
              borderColor: "border.elevated",
            },
          }}
          onClick={handleOpen}
        >
          <EyeIcon size={18} />
        </Box>
        {open && (
          <Box
            sx={{
              backdropFilter: "blur(50px)",
              boxShadow: "5px 5px 60px 0px #14192399",
              border: "1px solid",
              borderColor: "border.elevated",
              padding: "16px",
              borderRadius: "8px",
              position: "absolute",
              top: "-274px",
              left: 0,
              backgroundColor: "action.hover",
              width: 264,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="white" fontWeight={700}>
                View Filters
              </Typography>
              <CloseIcon
                size={16}
                onClick={handleClose}
                sx={{ cursor: "pointer" }}
              />
            </Box>
            <Box>
              <Autocomplete options={[]} size="small" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                "& > div": {
                  padding: "3px 4px 3px 0",
                },
              }}
            >
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  System Ports
                </Typography>
                <Toggle />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Error Ports
                </Typography>
                <Toggle />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Connection Attempt Ports
                </Typography>
                <Toggle />
              </Box>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.primary">
                  Idle Ports
                </Typography>
                <Toggle />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
