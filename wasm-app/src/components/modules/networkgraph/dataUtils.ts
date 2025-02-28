import { workloads } from "./data";
import { CustomEdge, CustomNode, NodeSize } from "./types";

export const createNodes = (): CustomNode[] => {
  return workloads.map<CustomNode>((workload) => ({
    id: workload.uuid,
    data: {
      label: workload.workloadName,
    },
    size: workload.size ? workload.size / 2 : NodeSize.MEDIUM / 2,
    color: "transparent",
    x: 100,
    y: 100,
  }));
};

export const createEdges = (): CustomEdge[] => {
  return workloads.reduce<any>((pre, current) => {
    const fromEdges = current.from.map((f) => ({
      from: f.workloadId,
      to: current.uuid,
      status: f.status,
    }));

    const toEdges = current.to.map((t) => ({
      from: current.uuid,
      to: t.workloadId,
      status: t.status,
    }));

    return [...pre, ...fromEdges, ...toEdges];
  }, [] as CustomEdge[]);
};