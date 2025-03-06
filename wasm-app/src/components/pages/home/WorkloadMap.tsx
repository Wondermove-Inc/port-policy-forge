import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { WorkloadDetail } from "./WorkloadDetail";

import NetworkGraph from "@/components/modules/networkgraph/networkGraph";
import {
  CustomNetwork,
  EdgeData,
  NodeData,
  NodeSize,
} from "@/components/modules/networkgraph/types";
import { ViewFilter } from "@/components/pages/home/workload-map/ViewFilter";
import { workloadMap } from "@/data";
import { useDisclosure } from "@/hooks/useDisclosure";

export const WorkloadMap = () => {
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [network, setNetwork] = useState<CustomNetwork>();
  const detailDrawer = useDisclosure();

  useEffect(() => {
    const workloads = workloadMap;
    const edges = workloads.reduce((pre, current) => {
      const fromEdges: EdgeData[] = current.from.map((f) => ({
        from: f.workloadId,
        to: current.uuid,
        status: f.status,
      }));

      const toEdges: EdgeData[] = current.to.map((t) => ({
        from: current.uuid,
        to: t.workloadId,
        status: t.status,
      }));

      return [...pre, ...fromEdges, ...toEdges] as EdgeData[];
    }, [] as EdgeData[]);

    const nodes = workloads.map<NodeData>((workload) => {
      return {
        ...workload,
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

  const handleEdgeDisconnected = (edgeId: string) => {
    const isConfirmed = confirm("Confirm remove edgeId " + edgeId);
    if (isConfirmed) {
      network?.body.data.edges.remove(edgeId);
      const edge = edges.find((edge) => edge.id === edgeId);
      if (edge) {
        const fromConnectNodes = network?.getConnectedNodes(edge.from);
        const toConnectEdges = network?.getConnectedNodes(edge.to);
        if (fromConnectNodes?.length === 0) {
          network?.body.data.nodes.remove(edge.from);
        }
        if (toConnectEdges?.length === 0) {
          network?.body.data.nodes.remove(edge.to);
        }
      }
    }
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
        edges={edges}
        nodes={nodes}
        setNetwork={setNetwork}
        onEdgeDisconnected={handleEdgeDisconnected}
      />
      <ViewFilter />
      <WorkloadDetail
        id=""
        open={detailDrawer.visible}
        handleClose={detailDrawer.close}
      />
    </Box>
  );
};
