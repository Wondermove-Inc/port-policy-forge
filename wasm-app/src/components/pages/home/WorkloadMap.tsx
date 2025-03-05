import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { WorkloadDetail } from "./WorkloadDetail";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import {
  EdgeData,
  EdgeStatus,
  EdgeStatusText,
  NodeData,
  NodeSize,
} from "@/components/modules/networkgraph/types";
import { ViewFilter } from "@/components/pages/home/workload-map/ViewFilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useWasmContext } from "@/wasm.provider";
import { workloadMap } from "@/data";

export const WorkloadMap = () => {
  const wasmCtx = useWasmContext();
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string>();
  const [displayPorts, setDisplayPorts] = useState<EdgeStatusText[]>([
    EdgeStatusText.ERROR,
  ]);
  const detailDrawer = useDisclosure();
  useEffect(() => {
    if (!detailDrawer.visible) {
      setActiveNodeId(undefined);
    }
  }, [detailDrawer.visible]);
  useEffect(() => {
    const workloads = workloadMap
    const edges = workloads.reduce((pre, current) => {
      const fromEdges: EdgeData[] = current.from.map((f) => ({
        from: f.workloadId,
        to: current.uuid,
        status: EdgeStatus.SYSTEM,
      }));

      const toEdges: EdgeData[] = current.to.map((t) => ({
        from: current.uuid,
        to: t.workloadId,
        status: EdgeStatus.SYSTEM,
      }));

      return [...pre, ...fromEdges, ...toEdges] as EdgeData[];
    }, [] as EdgeData[]);

    const nodes = workloads.map<NodeData>((workload) => {
      return {
        id: workload.uuid,
        customLabel: workload.workloadName,
        nodeSize: NodeSize.MEDIUM,
        stats: {
          active: 10,
          unconnected: 10,
        },
      };
    });
    setEdges(edges);
    setNodes(nodes);
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setActiveNodeId(nodeId);
    detailDrawer.open();
  };

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
      <NetworkGraph
        displayPorts={displayPorts}
        edges={edges}
        nodes={nodes}
        activeNodeId={activeNodeId}
        onNodeClick={handleNodeClick}
      />
      <ViewFilter />
      <WorkloadDetail
        open={detailDrawer.visible}
        handleClose={detailDrawer.close}
      />
    </Box>
  );
};
