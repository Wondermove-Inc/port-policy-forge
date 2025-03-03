import { Stats } from "@/models";

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
