import { useEffect } from "react";

import { Box } from "@mui/material";

import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { TabsViewMode } from "@/components/modules/TabsViewMode";
import { WorkloadList } from "@/components/pages/home/WorkloadList";
import { WorkloadMap } from "@/components/pages/home/WorkloadMap";
import { wasmListWorkloads } from "@/services/listWorkloads";
import { useCommonStore } from "@/store";

export const Home = () => {
  const {
    isViewList,
    selectedNamespace,
    setWorkloadsLoading,
    setWorkloads,
    isDetailFromViewMap,
  } = useCommonStore();

  useEffect(() => {
    if (selectedNamespace) {
      getWorkloads();
    }
  }, [selectedNamespace]);

  const getWorkloads = () => {
    setWorkloadsLoading(true);
    wasmListWorkloads(selectedNamespace)
      .then((data) => {
        setWorkloads(
          data.result.map((item) => ({
            ...item,
            id: item.uuid,
          })),
        );
        setWorkloadsLoading(false);
      })
      .catch(() => {
        // TODO: show error
        // setError(String(err));
        setWorkloadsLoading(false);
      });
  };

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 88,
          width: isDetailFromViewMap ? "calc(100% - 512px)" : "calc(100%)",
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
