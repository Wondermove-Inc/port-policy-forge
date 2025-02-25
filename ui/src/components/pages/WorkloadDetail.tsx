import { Button } from "@skuber/components";
import { useState } from "react";
import { Drawer } from "../atoms/Drawer";
import { WorkloadSummary } from "./components/detail/WorkloadSummary";
import { WorkloadTabs } from "./components/detail/WorkloadTabs";

export const WorkloadDetail = () => {
  const [isWorkloadDetailOpenned, setIsWorkloadDetailOpenned] = useState(false);

  return (
    <>
      <Button onClick={() => setIsWorkloadDetailOpenned(true)}>Workload Name</Button>
      <Drawer
        open={isWorkloadDetailOpenned}
        title="email-service"
        subTitle="Deployment"
        onClose={() => {
          setIsWorkloadDetailOpenned(false);
        }}
      >
        <WorkloadTabs onChangeTab={() => {}} />
        <WorkloadSummary />
      </Drawer>
    </>
  );
};
