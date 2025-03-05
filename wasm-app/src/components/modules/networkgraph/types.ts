import { Edge, IdType, Network, Node } from "vis-network";

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

export type NodeStat = {
  active?: number;
  attempted?: number;
  error?: number;
  idle?: number;
  latencyRtt?: number;
  throughput?: number;
  unconnected?: number;
}

export type NodeData = {
  id: string;
  nodeSize: number;
  customLabel: string;
  kind?: string;
  stats?: NodeStat;
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
    edges: CustomEdge[];
    nodes: CustomNode[];
  };
};

export type CanvasImage = {
  arrow: HTMLImageElement;
  activeArrow: HTMLImageElement;
  idleArrow: HTMLImageElement;
  errorArrow: HTMLImageElement;
  protected: HTMLImageElement;
  exclamation: HTMLImageElement;
  deployment: HTMLImageElement;
};

export type DrawingOptions = {
  hoverNodeId?: string;
  connectedEdges?: IdType[];
  connectedNodes?: IdType[];
  displayPorts?: EdgeStatusText[];
  disabled?: boolean;
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
