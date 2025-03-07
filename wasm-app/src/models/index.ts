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

export enum ClusterType {
  AKS = "aks",
  PRM = "premise",
  GKE = "gke",
  EKS = "eks",
  OKE = "oke",
}

export enum PortKind {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export type PortRangeType = {
  start: string;
  end: string;
};

export type SourceType = {
  ip: string;
  port: number;
  comment?: string;
  createdAt?: string;
};

export type Port = {
  id: number;
  isRange: boolean;
  portNumber: number | string | null;
  portRange: PortRangeType | null;
  status: number;
  isOpen: boolean;
  risk: number;
  type: string;
  count: number | null;
  lastConnectionDate: string | null;
  lastConnectionEndpoint: string | null;
  lastConnectionLog: string | null;
  accessSources: SourceType[] | null;
  sourceNumber?: number | null;
  accessPolicy?: AccessPolicy;
};

export type PortAccessSettingForm = {
  workloadUuid: string;
  flag: PortDirection;
  portSpec: string;
  accessPolicy?: AccessPolicy;
  allowFullAccess: boolean;
  accessSources?: {
    ip: string;
    protocol: string;
    comment: string;
  }[];
};

export enum AccessPolicy {
  ALLOW_ALL = "allow-all",
  ALLOW_EXCLUDE = "exclude-specific",
  ALLOW_ONLY = "only-specific",
}

export enum PortRisk {
  NULL = 0,
  NORMAL = 1,
  HIGH = 2,
}

export const STATUS_MAP: Record<number, Stats> = {
  0: Stats.UNCONNECTED,
  1: Stats.IDLE,
  2: Stats.ACTIVE,
  3: Stats.ERROR,
  4: Stats.ATTEMPTED,
};

export enum WorkloadKind {
  Deployment = "deployment",
  Demonset = "demonset",
  Replicaset = "replicaset",
  Cronjob = "cronjob",
  Job = "job",
  Statefulset = "statefulset",
}

export type StatsType = {
  active: number | null;
  unconnected: number | null;
  idle: number | null;
  error: number | null;
  attempted: number | null;
  latencyRtt: number | null;
  throughput: number | null;
};
