export enum Stats {
  ACTIVE = "active",
  UNCONNECTED = "unconnected",
  IDLE = "idle",
  ERROR = "error",
  ATTEMPTED = "attempted",
}

export enum Direction {
  INBOUND = "Inbound",
  OUTBOUND = "Outbound",
}

export type PortRangeType = {
  start: string;
  end: string;
};

export type Port = {
  id: number;
  isRange: boolean;
  portNumber?: number | null;
  portRange?: PortRangeType | null;
  status: number;
  direction: string;
  isOpen: boolean;
  risk: number;
  type: string;
  count: number | null;
  lastConnection: string | null;
  lastSrcIp: string | null;
  lastConnectionLog: string | null;
};

export type PortDetailGroupType = {
  open: Port[];
  closed: Port[];
};

export type StatsType = {
  active: number;
  unconnected: number;
  idle: number;
  error: number;
  attempted: number;
  latencyRtt: number | null;
  throughput: number;
};

export type WorkloadDetailType = {
  uuid: string;
  workloadName: string;
  kind: string;
  stats: StatsType;
  ports: {
    inbound: PortDetailGroupType;
    outbound: PortDetailGroupType;
  };
};

export type WorkListType = {
  [key: string]: { 
    id: number; 
    name: string; 
    type: string; 
    unconnectedPort: number; 
    idlePort: number; 
    activePort: number; 
    errorPort: number; 
    closedPortAttempted: string; 
  }[];
}
