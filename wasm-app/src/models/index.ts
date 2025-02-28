export enum Stats {
  ACTIVE = "active",
  UNCONNECTED = "unconnected",
  IDLE = "idle",
  ERROR = "error",
  ATTEMPTED = "attempted",
}

export enum PortDirection {
  INBOUND = "Inbound",
  OUTBOUND = "Outbound",
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

export type PortAccessSettingForm = {
  sources: {
    source: string;
    type: string;
    comment: string;
  }[];
  allowFullAccess: boolean;
  access: number;
};
