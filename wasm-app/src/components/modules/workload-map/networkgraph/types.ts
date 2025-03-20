import { Edge, IdType, Network, Node } from "vis-network";
import { DataSet } from "vis-network/standalone";

import {
  FilterPorts,
  Port,
  StatsType,
  WorkloadKind,
  WorkloadPortStatus,
  WorkloadStatus,
} from "@/models";
export type Coord = {
  x: number;
  y: number;
};

export enum NodeSize {
  SMALL = 40,
  MEDIUM = 60,
  BIG = 74,
}

export enum NodeKindSize {
  SMALL = 20,
  MEDIUM = 30,
  BIG = 40,
}

export type NodeData = {
  id: string;
  nodeSize: number;
  customLabel: string;
  externalNamespace?: string;
  isExternalNamespace?: boolean;
  kind?: WorkloadKind;
  connected_workload_status?: WorkloadStatus;
  policy_setting_badge?: boolean;
  inbound?: {
    stats?: StatsType;
  };
  outbound?: {
    stats?: StatsType;
  };
  from?: { workloadId: string; status: WorkloadPortStatus }[];
  to?: { workloadId: string; status: WorkloadPortStatus }[];
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
  status: WorkloadPortStatus;
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
  edges?: CustomEdge[];
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
  defaultArrow: HTMLImageElement;
  activeArrow: HTMLImageElement;
  idleArrow: HTMLImageElement;
  errorArrow: HTMLImageElement;
  backgroundArrow: HTMLImageElement;
  protected: HTMLImageElement;
  exclamation: HTMLImageElement;
  kind: {
    deployment: HTMLImageElement;
    daemonset: HTMLImageElement;
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
  activeEdgeId?: string;
  activeNodeId?: string;
  connectedEdges?: IdType[];
  connectedNodes?: IdType[];
  filterPorts?: FilterPorts;
  portHover?: Port | null;
  network?: CustomNetwork;
  removingEdgeId?: string;
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
