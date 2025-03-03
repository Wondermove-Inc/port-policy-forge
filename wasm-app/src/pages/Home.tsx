import { Box } from "@mui/material";

import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { TabsViewMode } from "@/components/modules/TabsViewMode";
import { WorkloadList } from "@/components/pages/home/WorkloadList";
import { WorkloadMap } from "@/components/pages/home/WorkloadMap";
import { useCommonStore } from "@/store";

export const Home = () => {
  const { isViewList } = useCommonStore();
  return (
    <Box
      sx={{
        height: "100%",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 88,
          width: "100%",
          padding: "20px",
          alignItems: "center",
        }}
      >
        <SelectClusterAndNameSpace />
        <TabsViewMode />
      </Box>
      {isViewList ? <WorkloadList /> : <WorkloadMap />}
    </Box>
  );
};
