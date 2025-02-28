import { useState } from "react";

import { Box } from "@mui/material";

import { ClosePort } from "./workload-detail/ClosePort";
import { OpenPort } from "./workload-detail/OpenPort";
import { OpenPortModal } from "./workload-detail/OpenPortModal";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { PortDirection } from "@/models";

type WorkloadDetailProps = {
  open: boolean;
  handleClose: () => void;
};

export const WorkloadDetail = ({ open, handleClose }: WorkloadDetailProps) => {
  const [portDirection, setPortDirection] = useState<PortDirection>(
    PortDirection.INBOUND,
  );

  const handleChangeTab = (direction: string) => {
    setPortDirection(direction as PortDirection);
  };

  return (
    <Drawer
      open={open}
      title="email-service"
      subTitle="Deployment"
      onClose={handleClose}
    >
      <WorkloadTabs onChangeTab={handleChangeTab} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <WorkloadSummary
          stats={{
            active: 10,
            unconnected: 5,
            idle: 0,
            error: 2,
            attempted: 3,
            latencyRtt: 1.39,
            throughput: 469.89,
          }}
          workloadName="Default"
        />
        <PolicyApplication />
        <OpenPort />
        <ClosePort />
      </Box>
      <OpenPortModal />
    </Drawer>
  );
};
