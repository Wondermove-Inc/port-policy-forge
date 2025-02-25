import { Button } from "@skuber/components";
import { useState } from "react";
import { Drawer } from "../atoms/Drawer";
import { WorkloadSummary } from "./components/detail/_WorkloadSummary";
import { WorkloadTabs } from "./components/detail/_WorkloadTabs";
import { PolicyApplication } from "./components/detail/_PolicyApplication";
import { OpenPort } from "./components/detail/_OpenPort";

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
        <PolicyApplication />
        <OpenPort />
      </Drawer>
    </>
  );
};
