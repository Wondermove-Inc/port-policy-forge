import { useState } from "react";

import { Button } from "@skuber/components";

import { ClosePort } from "./detail/ClosePort";
import { OpenPort } from "./detail/OpenPort";
import { PolicyApplication } from "./detail/PolicyApplication";
import { WorkloadSummary } from "./detail/WorkloadSummary";
import { WorkloadTabs } from "./detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";

export const WorkloadDetail = () => {
  const [isWorkloadDetailOpened, setIsWorkloadDetailOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setIsWorkloadDetailOpened(true)}>
        Workload Name
      </Button>
      <Drawer
        open={isWorkloadDetailOpened}
        title="email-service"
        subTitle="Deployment"
        onClose={() => {
          setIsWorkloadDetailOpened(false);
        }}
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
    </>
  );
};
