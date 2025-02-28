import { Box } from "@mui/material";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { TabsViewMode } from "@/components/modules/TabsViewMode";
import { ViewFilter } from "@/components/pages/home/workload-map/ViewFilter";

export const WorkloadMap = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
        }}
      >
        <SelectClusterAndNameSpace
          clusterOptions={[
            { value: "cluster1", label: "cluster1", avatar: "-" },
          ]}
          nameSpaceOptions={[{ value: "namespace1", label: "namespace1" }]}
          onClusterChange={() => {}}
          onNameSpaceChange={() => {}}
          selectedCluster={"cluster1"}
          selectedNameSpace={"namespace1"}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1,
        }}
      >
        <TabsViewMode />
      </Box>
      <NetworkGraph />
      <ViewFilter />
    </Box>
  );
};
