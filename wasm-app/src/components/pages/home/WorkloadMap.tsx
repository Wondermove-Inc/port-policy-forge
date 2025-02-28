import { Box } from "@mui/material";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import { ViewFilter } from "@/components/modules/ViewFilter";

export const WorkloadMap = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <NetworkGraph />
      <ViewFilter />
    </Box>
  );
};
