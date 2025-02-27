export enum WorkloadStatus {
  ACTIVE = "active",
  UNCONNECTED = "unconnected",
  IDLE = "idle",
  ERROR = "error",
  ATTEMPTED = "attempted",
}

export const WORKLOAD_STATUS: Record<
  WorkloadStatus,
  { label: string; color: string }
> = {
  active: { label: "Active", color: "primary.dark" },
  unconnected: { label: "Unconnected", color: "status.warning" },
  idle: { label: "Idle", color: "status.warning" },
  error: { label: "Error", color: "status.danger" },
  attempted: { label: "Attempted", color: "status.danger" },
};

export enum WorkloadDivided {
  INBOUND = "Inbound",
  OUTBOUND = "Outbound",
}
