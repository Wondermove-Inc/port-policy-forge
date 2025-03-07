import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import { InfoIcon } from "@/components/icons/InfoIcon";
import { useDisclosure } from "@/hooks/useDisclosure";

type PolicyApplicationProps = {
  fetchWorkloadDetail: () => void;
};

export const PolicyApplication = ({
  fetchWorkloadDetail,
}: PolicyApplicationProps) => {
  const policyApplicationModal = useDisclosure();

  const handleApplyPolicy = () => {
    // TODO
    fetchWorkloadDetail();
    policyApplicationModal.close();
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
          mb: 3,
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
              Apply a service policies to close unused ports{" "}
            </Typography>
          </Box>
          <Typography variant="b2_r" color="text.secondary">
            Enforce service policies to close all unconnected ports for <br />{" "}
            added security. If you don't apply a policy, all ports remain open.
          </Typography>
        </Box>
        <Box
          sx={{
            p: "4px 8px",
            borderRadius: "4px",
            typography: "labelBold",
            bgcolor: "primary.main",
            cursor: "pointer",
          }}
          onClick={policyApplicationModal.open}
        >
          Apply
        </Box>
      </Box>
      <ModalConfirm
        open={policyApplicationModal.visible}
        onClose={policyApplicationModal.close}
        onConfirm={handleApplyPolicy}
        title="Apply a service policy"
        description="Close all unused ports according to service policy. Closing unconnected ports makes the following changes."
        descriptionDetails={[
          "All ports that are not currently active are closed.",
          "Closed ports will no longer be accessible externally.",
          "To reopen a port, you must manually reset it.",
        ]}
      />
    </>
  );
};
