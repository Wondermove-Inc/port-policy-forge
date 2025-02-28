import { ViewFilter } from "@/components/modules/ViewFilter";
import { WorkloadList } from "@/components/pages/home/WorkloadList";
import { useCommonStore } from "@/store";

export const Home = () => {
  const { isViewList } = useCommonStore();
  return isViewList ? <WorkloadList /> : <ViewFilter />;
};
