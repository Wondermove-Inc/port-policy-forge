import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { TabsViewMode } from "@/components/modules/TabsViewMode";
import { WorkloadList } from "@/components/pages/home/WorkloadList";
import { WorkloadMap } from "@/components/pages/home/WorkloadMap";
import { useCommonStore } from "@/store";

export const Home = () => {
  const { isViewList } = useCommonStore();
  const clusterOptions = [
    { value: "cluster1", label: "Cluster1", avatar: "-" },
    { value: "cluster2", label: "Cluster2", avatar: "-" },
  ];
  const nameSpaceOptions: Record<string, { value: string; label: string }[]> = {
    cluster1: [
      { value: "namespace1", label: "Namespace1" },
      { value: "namespace2", label: "Namespace2" },
    ],
    cluster2: [
      { value: "test1", label: "Test1" },
      { value: "test2", label: "Test2" },
    ],
  };

  const [clusterValue, setClusterValue] = useState(clusterOptions[0].value);
  const [nameSpaceValue, setNameSpaceValue] = useState(
    nameSpaceOptions[clusterValue][0].value,
  );

  useEffect(() => {
    setNameSpaceValue(nameSpaceOptions[clusterValue][0].value);
  }, [clusterValue]);
  return (
    <Box
      sx={{
        padding: "20px",
        height: "100%",
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
        <SelectClusterAndNameSpace
          clusterOptions={clusterOptions}
          nameSpaceOptions={nameSpaceOptions[clusterValue]}
          onClusterChange={setClusterValue}
          onNameSpaceChange={setNameSpaceValue}
          selectedCluster={clusterValue}
          selectedNameSpace={nameSpaceValue}
        />
        <TabsViewMode />
      </Box>
      {isViewList ? <WorkloadList /> : <WorkloadMap />}
    </Box>
  );
};
