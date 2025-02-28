import { ClosePort } from "./workload-detail/ClosePort";
import { OpenPort } from "./workload-detail/OpenPort";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";

type WorkloadDetailProps = {
  open: boolean;
  handleClose: () => void;
};

export const WorkloadDetail = ({ open, handleClose }: WorkloadDetailProps) => {
  return (
    <Drawer
      open={open}
      title="email-service"
      subTitle="Deployment"
      onClose={handleClose}
    >
      <WorkloadTabs onChangeTab={() => {}} />
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
    </Drawer>
  );
};
