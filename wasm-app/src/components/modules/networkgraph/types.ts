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

export type CustomEdge = Partial<Edge> & {
  id: IdType;
  from: CustomNode;
  to: CustomNode;
  status: EdgeStatus;
};

export type CustomNode = Partial<Node> & {
  id: IdType;
  x: number;
  y: number;
  data: {
    label: string;
  };
  size: NodeSize;
};

export type NetworkWithBody = Network & {
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
