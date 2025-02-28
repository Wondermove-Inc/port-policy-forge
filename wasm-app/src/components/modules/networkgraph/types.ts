import { Edge, IdType, Network, Node } from "vis-network";

export type Coord = {
  x: number;
  y: number;
};

export enum EdgeStatus {
  DEFAULT,
  ACTIVE,
  IDLE,
  ERROR,
  ACCESS_ATTEMPTS,
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

export type NodeData = {
  id: string;
  size: number; // default of node
  customSize: number;
  customLabel: string;
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
  disabled?: boolean;
};

export type WorkloadConnector = {
  workloadId: string;
  status: number;
};

export type Workload = {
  uuid: string;
  workloadName: string;
  kind: string;
  size?: NodeSize;
  from: WorkloadConnector[];
  to: WorkloadConnector[];
};
