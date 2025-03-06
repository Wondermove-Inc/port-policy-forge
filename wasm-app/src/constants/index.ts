import { Stats, WorkloadDetailType } from "@/models";

export const PORT_STATUS_MAP: Record<
  Stats,
  { label: string; color: string; backgroundColor: string }
> = {
  active: {
    label: "Active",
    color: "primary.dark",
    backgroundColor: "#4783FF1A",
  },
  unconnected: {
    label: "Unconnected",
    color: "status.warning",
    backgroundColor: "#FFA8001A",
  },
  idle: {
    label: "Idle",
    color: "status.warning",
    backgroundColor: "#FFA8001A",
  },
  error: {
    label: "Error",
    color: "status.danger",
    backgroundColor: "#EB413633",
  },
  attempted: {
    label: "Attempted",
    color: "status.danger",
    backgroundColor: "#EB413633",
  },
};

export const BOUND_TYPES = [
  { label: "Inbound", value: "1" },
  { label: "Outbound", value: "2" },
];

export const INITIAL_WORKLOAD_DETAIL: WorkloadDetailType = {
  uuid: "",
  workloadName: "",
  kind: "",
  inbound: {
    stats: {
      active: null,
      unconnected: null,
      idle: null,
      error: null,
      attempted: null,
      latencyRtt: null,
      throughput: null,
    },
    ports: {
      open: [],
      closed: [],
    },
  },
  outbound: {
    stats: {
      active: null,
      unconnected: null,
      idle: null,
      error: null,
      attempted: null,
      latencyRtt: null,
      throughput: null,
    },
    ports: {
      open: [],
      closed: [],
    },
  },
};
