import { Box } from "@mui/material";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import { Workload } from "@/components/modules/networkgraph/types";
import { SelectClusterAndNameSpace } from "@/components/modules/SelectClusterAndNameSpace";
import { TabsViewMode } from "@/components/modules/TabsViewMode";
import { ViewFilter } from "@/components/pages/home/workload-map/ViewFilter";

const workloads: Workload[] = [
  {
    uuid: "7431bb4f-cae8-4dbe-a542-d6f52c893271",
    workloadName: "default-workload-1",
    kind: "deployment",
    size: 60,
    from: [
      {
        workloadId: "7f2552b4-ab40-4120-a6d9-16507024922b",
        status: 1,
      },
      {
        workloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db99",
        status: 4,
      },
    ],
    to: [],
  },
  {
    uuid: "7f2552b4-ab40-4120-a6d9-16507024922b",
    workloadName: "default-ad-service",
    kind: "deployment",
    size: 40,
    from: [],
    to: [
      {
        workloadId: "7431bb4f-cae8-4dbe-a542-d6f52c893271",
        status: 2,
      },
    ],
  },
  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db99",
    workloadName: "default-ad-service",
    kind: "deployment",
    size: 74,
    from: [
      {
        workloadId: "7f2552b4-ab40-4120-a6d9-16507024922b",
        status: 3,
      },
    ],
    to: [],
  },
  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db99xx",
    workloadName: "default-ad-service",
    kind: "deployment",
    from: [
      {
        workloadId: "7f2552b4-ab40-4120-a6d9-16507024922b",
        status: 4,
      },
    ],
    to: [],
  },
  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db94",
    workloadName: "axxxx",
    kind: "deployment",
    from: [
      {
        workloadId: "7f2552b4-ab40-4120-a6d9-16507024922b",
        status: 4,
      },
    ],
    to: [],
  },

  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db93",
    workloadName: "workload name 1",
    kind: "deployment",
    from: [],
    to: [],
  },
  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db92",
    workloadName: "workload name 2",
    kind: "deployment",
    size: 40,
    from: [
      {
        workloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db93",
        status: 4,
      },
    ],
    to: [],
  },

  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db93aa",
    workloadName: "holly ***",
    kind: "deployment",
    from: [],
    to: [],
  },
  {
    uuid: "1b8892b1-58bc-464f-9401-b31eb2a9db92bb",
    workloadName: "holly ***",
    kind: "deployment",
    size: 40,
    from: [
      {
        workloadId: "1b8892b1-58bc-464f-9401-b31eb2a9db93aa",
        status: 4,
      },
    ],
    to: [],
  },
];

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
      {/* <NetworkGraph workloads={workloads} /> */}
      <ViewFilter />
    </Box>
  );
};
