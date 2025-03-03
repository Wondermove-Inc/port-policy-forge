export enum Stats {
  ACTIVE = "active",
  UNCONNECTED = "unconnected",
  IDLE = "idle",
  ERROR = "error",
  ATTEMPTED = "attempted",
}

export enum PortDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export enum TypeCluster {
  AKS = "aks",
  PRM = "premise",
  GKE = "gke",
  EKS = "eks",
  OKE = "oke",
}

export type PortRangeType = {
  start: string;
  end: string;
};

export type SourceType = {
  ip: string;
  port: number;
};

export type Port = {
  id: number;
  isRange: boolean;
  portNumber: number | string | null;
  portRange: PortRangeType | null;
  status: number;
  direction: string;
  isOpen: boolean;
  risk: number;
  type: string;
  count: number | null;
  lastConnection: string | null;
  lastSrcIp: string | null;
  lastConnectionLog: string | null;
  source: SourceType[] | null;
  access?: number;
};

export type PortDetailGroupType = {
  open: Port[];
  closed: Port[];
};

export type StatsType = {
  active: number | null;
  unconnected: number | null;
  idle: number | null;
  error: number | null;
  attempted: number | null;
  latencyRtt: number | null;
  throughput: number | null;
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

export type PortAccessSettingForm = {
  sources: {
    source: string;
    type: string;
    comment: string;
  }[];
  allowFullAccess: boolean;
  access: number;
};

export enum AccessSource {
  ALLOW_ALL = 0,
  ALLOW_EXPECT = 1,
  ALLOW_ONLY = 3,
}

export const STATUS_MAP: Record<number, Stats> = {
  0: Stats.UNCONNECTED,
  1: Stats.IDLE,
  2: Stats.ACTIVE,
  3: Stats.ERROR,
  4: Stats.ATTEMPTED,
};
