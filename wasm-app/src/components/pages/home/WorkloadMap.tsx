import { useEffect, useRef, useState } from "react";

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
import { ModalConfirm } from "@/components/atoms/ModalConfirm";

export const WorkloadMap = () => {
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [activeNodeId, setActiveNodeId] = useState("");
  const [selectedWorkloadId, setSelectedWorkloadId] = useState("");
  const [network, setNetwork] = useState<CustomNetwork>();
  const selectedEdgeId = useRef("");
  const detailDrawer = useDisclosure();
  const modalClosePort = useDisclosure();

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

  useEffect(() => {
    if (!detailDrawer.visible) {
      setActiveNodeId("");
    }
  }, [detailDrawer.visible]);

  const handleOnNodeSelected = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setSelectedWorkloadId("7431bb4f-cae8-4dbe-a542-d6f52c893271");
    detailDrawer.open();
  };

  const handleEdgeDisconnected = (edgeId: string) => {
    selectedEdgeId.current = edgeId;
    modalClosePort.open();
  };

  const handleClosePort = () => {
    modalClosePort.close();
    network?.body.data.edges.remove(selectedEdgeId.current);
    const edge = edges.find((edge) => edge.id === selectedEdgeId.current);
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
  };

  const handleCancelClosePort = () => {
    selectedEdgeId.current = "";
    modalClosePort.close();
  };

  const handleCloseDetail = () => {
    detailDrawer.close();
    setSelectedWorkloadId("");
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
        activeNodeId={activeNodeId}
        setNetwork={setNetwork}
        onEdgeDisconnected={handleEdgeDisconnected}
        onNodeSelected={handleOnNodeSelected}
      />
      <ViewFilter />
      <ModalConfirm
        title="Close Port Access"
        description="When you block that source or destination access to a specific port, it changes to the following"
        descriptionDetails={[
          "The source or destination will no longer be able to access the server on the specified port.",
          "The access restriction settings for the port are updated.",
        ]}
        open={modalClosePort.visible}
        onClose={handleCancelClosePort}
        onConfirm={handleClosePort}
      />
      <WorkloadDetail
        id={selectedWorkloadId}
        open={detailDrawer.visible}
        handleClose={handleCloseDetail}
        fromViewMap
      />
    </Box>
  );
};
