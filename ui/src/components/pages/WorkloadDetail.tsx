import { Button } from "@skuber/components";
import { useState } from "react";
import { Drawer } from "../atoms/Drawer";
import { WorkloadSummary } from "./components/detail/WorkloadSummary";
import { WorkloadTabs } from "./components/detail/WorkloadTabs";

export const WorkloadDetail = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Workload Name</Button>
      <Drawer
        open={open}
        title="email-service"
        subTitle="Deployment"
        onClose={() => {
          setOpen(false);
        }}
      >
        <WorkloadTabs onChangeTab={() => {}} />
        <WorkloadSummary />
      </Drawer>
    </>
  );
};
