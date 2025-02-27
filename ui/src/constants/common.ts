import { Stats } from "../models/WorkLoadDetail";

export const STATS_STATUS_MAP: Record<Stats, { label: string; color: string }> = {
  active: { label: "Active", color: "primary.dark" },
  unconnected: { label: "Unconnected", color: "status.warning" },
  idle: { label: "Idle", color: "status.warning" },
  error: { label: "Error", color: "status.danger" },
  attempted: { label: "Attempted", color: "status.danger" },
};
