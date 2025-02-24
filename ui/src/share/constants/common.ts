export enum WorkloadStatus {
  ACTIVE = "active",
  UNCONNECTED = "unconnected",
  IDLE = "idle",
  ERROR = "error",
  ATTEMPTED = "attempted",
}

export const WORKLOAD_STATUS = {
  [WorkloadStatus.ACTIVE]: { label: "Active", color: "primary.dark" },
  [WorkloadStatus.UNCONNECTED]: { label: "Unconneted", color: "status.warning" },
  [WorkloadStatus.IDLE]: { label: "Idle", color: "status.warning" },
  [WorkloadStatus.ERROR]: { label: "Error", color: "status.danger" },
  [WorkloadStatus.ATTEMPTED]: { label: "Attempted", color: "status.danger" },
};

export enum WorkloadDivided {
  INBOUND = "Inbound",
  OUTBOUND = "Outbound",
}
