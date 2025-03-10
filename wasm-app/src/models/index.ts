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
  portNumber: number | null;
  portNumberLabel: string;
  portRange: PortRangeType | null;
  status: number;
  direction: string;
  accessPolicy?: AccessPolicy;
  accessSources: SourceType[] | null;
  isOpen: boolean;
  risk: number;
  count: number | null;
  lastConnectionDate: string | null;
  lastConnectionEndpoint: string | null;
  lastConnectionLog: string | null;
  lastConnectionWorkloadUUID: string | null;
  sourceNumber?: number | null;
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
  NORMAL = 0,
  HIGH = 1,
  VERY_HIGH = 2,
}

export const STATUS_MAP: Record<number, Stats> = {
  0: Stats.UNCONNECTED,
  1: Stats.ACTIVE,
  2: Stats.IDLE,
  3: Stats.ERROR,
  4: Stats.ATTEMPTED,
};

export enum WorkloadKind {
  DEPLOYMENT = "deployment",
  DEMONSET = "demonset",
  REPLICASET = "replicaset",
  CRONJOB = "cronjob",
  JOB = "job",
  STATEFULSET = "statefulset",
  ETC = "etc",
  EXTERNAL = "external",
}

export enum WorkloadStatus {
  BEFORE_INITIAL_SETUP = "before-init-setup",
  COMPLETE_INITIAL_SETUP = "complete-setup",
}

export enum WorkloadPortStatus {
  SYSTEM,
  IDLE,
  ACTIVE,
  ERROR,
  ATTEMPT,
}

export enum WorkloadPortStatusText {
  SYSTEM = "system",
  IDLE = "idle",
  ACTIVE = "active",
  ERROR = "error",
  ATTEMPT = "attempt",
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

export type FilterPorts = {
  system: boolean;
  error: boolean;
  attempted: boolean;
  idle: boolean;
};
