import { useState } from "react";

import { Box, List, ListItem } from "@mui/material";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Typography,
} from "@skuber/components";
import { defaultTheme } from "@skuber/theme";

import { InfoIcon } from "../../../../icons/InfoIcon";

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
      <Modal
        width={434}
        open={isPolicyApplicationOpened}
        onClose={handleClosePolicyApplicationModal}
      >
        <ModalHeader
          title="Applying a service policy"
          onClose={handleClosePolicyApplicationModal}
        />
        <ModalBody>
          <Typography>
            Close all unused ports according to service policy. Closing
            unconnected ports makes the following changes.
          </Typography>
          <List
            sx={{
              paddingLeft: "24px",
              listStyleType: "disc",
              ...defaultTheme.typography.body2,
            }}
          >
            <ListItem sx={{ display: "list-item", padding: 0 }}>
              All ports that are not currently active are closed.
            </ListItem>
            <ListItem sx={{ display: "list-item", padding: 0 }}>
              Closed ports will no longer be accessible externally.
            </ListItem>
            <ListItem sx={{ display: "list-item", padding: 0 }}>
              To reopen a port, you must manually reset it.
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter
          cancelButtonTitle="Cancel"
          confirmButtonTitle="Confirm"
          onClickCancelButton={handleClosePolicyApplicationModal}
          onClickConfirmButton={() => {}}
        />
      </Modal>
    </>
  );
};
