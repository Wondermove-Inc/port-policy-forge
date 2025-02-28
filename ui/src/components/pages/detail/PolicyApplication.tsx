import { useState } from "react";

import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";

import { ModalConfirm } from "./_ModalConfirm";

import { InfoIcon } from "@/components/icons/InfoIcon";

export const PolicyApplication = () => {
  const [isPolicyApplicationOpened, setIsPolicyApplicationOpened] =
    useState(false);

  const handleClosePolicyApplicationModal = () => {
    setIsPolicyApplicationOpened(false);
  };

  return (
    <>
      <Box
        sx={{
          padding: "12px 12px 12px 24px",
          borderRadius: "8px",
          bgcolor: "#538BFF1A",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <InfoIcon size={16} />
            <Typography variant="b1_m">
              Apply a service policy to close unused ports{" "}
            </Typography>
          </Box>
          <Typography variant="b2_r" color="text.secondary">
            Enforce service policies to close all unconnected ports for <br />{" "}
            added security. If you don't apply a policy, all ports remain open.
          </Typography>
        </Box>
        <Button
          size="extraSmall"
          onClick={() => setIsPolicyApplicationOpened(true)}
        >
          Apply
        </Button>
      </Box>
      <ModalConfirm
        open={isPolicyApplicationOpened}
        onClose={handleClosePolicyApplicationModal}
        onConfirm={() => {}}
        title="Apply a service policy"
        description="Close all unused ports according to service policy."
        detailList={[
          " All ports that are not currently active are closed.",
          " Closed ports will no longer be accessible externally.",
          " To reopen a port, you must manually reset it.",
        ]}
      />
    </>
  );
};
