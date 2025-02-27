import { useState } from "react";

import { Button } from "@skuber/components";

import { Drawer } from "../atoms/Drawer";
import { OpenPortModal } from "./components/pages/detail/OpenPortModal";
import { PolicyApplication } from "./components/pages/detail/PolicyApplication";
import { WorkloadSummary } from "./components/pages/detail/WorkloadSummary";
import { WorkloadTabs } from "./components/pages/detail/WorkloadTabs";

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
        <OpenPortModal />
      </Drawer>
    </>
  );
};
