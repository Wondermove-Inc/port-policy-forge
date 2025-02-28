import { WorkloadList } from "@/components/pages/home/WorkloadList";
import { WorkloadMap } from "@/components/pages/home/WorkloadMap";
import { useCommonStore } from "@/store";

export const Home = () => {
  const { isViewList } = useCommonStore();
  return isViewList ? <WorkloadList /> : <WorkloadMap />;
};
