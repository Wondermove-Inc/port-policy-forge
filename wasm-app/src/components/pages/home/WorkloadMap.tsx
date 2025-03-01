import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import {
  EdgeData,
  EdgeStatus,
  NodeData,
  NodeSize,
} from "@/components/modules/networkgraph/types";
import { ViewFilter } from "@/components/pages/home/workload-map/ViewFilter";
import { useWasmContext } from "@/wasm.provider";

export const WorkloadMap = () => {
  const wasmCtx = useWasmContext();
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  useEffect(() => {
    const workloads = wasmCtx.getWorkloads("");
    const edges = workloads.reduce((pre, current) => {
      const fromEdges: EdgeData[] = current.from.map((f) => ({
        from: f.workloadId,
        to: current.uuid,
        status: EdgeStatus.DEFAULT,
      }));

      const toEdges: EdgeData[] = current.to.map((t) => ({
        from: current.uuid,
        to: t.workloadId,
        status: EdgeStatus.DEFAULT,
      }));

      return [...pre, ...fromEdges, ...toEdges] as EdgeData[];
    }, [] as EdgeData[]);

    const nodes = workloads.map<NodeData>((workload) => {
      return {
        id: workload.uuid,
        customLabel: workload.workloadName,
        nodeSize: NodeSize.MEDIUM,
      };
    });
    setEdges(edges);
    setNodes(nodes);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <NetworkGraph edges={edges} nodes={nodes} />
      <ViewFilter />
    </Box>
  );
};
