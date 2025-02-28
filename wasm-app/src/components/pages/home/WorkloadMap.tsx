import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { ViewFilter } from "@/components/modules/ViewFilter";
import { Box } from "@mui/material";

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
          bottom: 32,
          left: 32,
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

      <ViewFilter />
    </Box>
  );
};
