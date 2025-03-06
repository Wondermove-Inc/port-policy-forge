import { Edge, IdType, Network, Node } from "vis-network";
import { DataSet } from "vis-network/standalone";
export type Coord = {
  x: number;
  y: number;
};

export enum EdgeStatus {
  SYSTEM,
  IDLE,
  ACTIVE,
  ERROR,
  ATTEMPT,
}

export enum NodeKind {
  DEPLOYMENT = "deployment",
  DEMONSET = "demonset",
  REPLICASET = "replicaset",
  CRONJOB = "cronjob",
  JOB = "job",
  STATEFULSET = "statefulset",
  ETC = "etc",
  EXTERNAL = "external",
}

export enum NodeStatus {
  BEFORE_INITIAL_SETUP,
  COMPLETE_INITIAL_SETUP,
}

export enum EdgeStatusText {
  SYSTEM = "system",
  IDLE = "edle",
  ACTIVE = "active",
  ERROR = "error",
  ATTEMPT = "attempt",
}

export enum NodeSize {
  SMALL = 40,
  MEDIUM = 60,
  BIG = 74,
}

export enum DeploymentIconSize {
  SMALL = 20,
  MEDIUM = 30,
  BIG = 40,
}

export type NodeStats = {
  active?: number;
  attempted?: number;
  error?: number;
  idle?: number;
  latencyRtt?: number;
  throughput?: number;
  unconnected?: number;
};

export type NodeData = {
  id: string;
  nodeSize: number;
  customLabel: string;
  kind?: NodeKind;
  status?: NodeStatus;
  inbound?: {
    stats?: NodeStats;
  };
  outbound?: {
    stats?: NodeStats;
  };
  from?: { workloadId: string; status: EdgeStatus }[];
  to?: { workloadId: string; status: EdgeStatus }[];
};

export type NetworkNodeData = {
  size: number;
  color: string;
  x: number;
  y: number;
};

export type EdgeData = {
  id?: string;
  from: string;
  to: string;
  status: EdgeStatus;
};

export type CustomEdge = Partial<Edge> & {
  id: IdType;
  from: CustomNode;
  to: CustomNode;
  data?: EdgeData;
};

export type CustomNode = Partial<Node> & {
  id: IdType;
  x: number;
  y: number;
  data?: NodeData;
  size: NodeSize;
};

export type CustomNetwork = Network & {
  body: {
    edges: { [key: string]: CustomEdge };
    nodes: { [key: string]: CustomNode };
    data: {
      edges: DataSet<EdgeData>;
      nodes: DataSet<NodeData>;
    };
  };
};

export type CanvasImage = {
  arrow: HTMLImageElement;
  activeArrow: HTMLImageElement;
  idleArrow: HTMLImageElement;
  errorArrow: HTMLImageElement;
  protected: HTMLImageElement;
  exclamation: HTMLImageElement;
  kind: {
    deployment: HTMLImageElement;
    demonset: HTMLImageElement;
    replicaset: HTMLImageElement;
    cronjob: HTMLImageElement;
    job: HTMLImageElement;
    statefulset: HTMLImageElement;
    etc: HTMLImageElement;
    external: HTMLImageElement;
  };
  lineConnected: HTMLImageElement;
};

export type DrawingOptions = {
  hoverNodeId?: string;
  connectedEdges?: IdType[];
  connectedNodes?: IdType[];
};

export type WorkloadConnector = {
  workloadId: string;
  status: number;
};

export interface EdgeStyle {
  strokeStyle: string;
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  arrowKey: keyof CanvasImage;
  lineDash: number[];
}
