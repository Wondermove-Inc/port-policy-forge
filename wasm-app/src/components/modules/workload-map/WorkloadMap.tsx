import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";

import { WorkloadDetail } from "../workload-detail/WorkloadDetail";

import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import NetworkGraph from "@/components/modules/workload-map/networkgraph/networkGraph";
import {
  CustomNetwork,
  EdgeData,
  NodeData,
  NodeSize,
} from "@/components/modules/workload-map/networkgraph/types";
import { ViewFilter } from "@/components/modules/workload-map/ViewFilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { FilterPorts } from "@/models";
import { useCommonStore } from "@/store";

export const WorkloadMap = () => {
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [networkGraphRenderKey, setNetworkGraphRenderKey] = useState<number>(
    new Date().getTime(),
  );
  const { workloads, portHover } = useCommonStore();
  const initFilterPorts: FilterPorts = {
    attempted: true,
    error: true,
    idle: true,
    system: false,
  };
  const [filterPorts, setFilterPorts] = useState<FilterPorts>(initFilterPorts);
  const [activeNodeId, setActiveNodeId] = useState("");
  const [selectedWorkloadId, setSelectedWorkloadId] = useState("");
  const [network, setNetwork] = useState<CustomNetwork>();
  const selectedEdgeId = useRef("");
  const detailDrawer = useDisclosure();
  const modalClosePort = useDisclosure();
  useEffect(() => {
    const edges = workloads.reduce((pre, current) => {
      const fromEdges: EdgeData[] =
        current.from?.map((f) => ({
          from: f.workloadId,
          to: current.uuid,
          status: f.status,
        })) || [];

      const toEdges: EdgeData[] =
        current.to?.map((t) => ({
          from: current.uuid,
          to: t.workloadId,
          status: t.status,
        })) || [];

      return [...pre, ...fromEdges, ...toEdges] as EdgeData[];
    }, [] as EdgeData[]);

    const nodes = workloads.map<NodeData>((workload) => {
      return {
        // ...workload,
        id: workload.uuid,
        customLabel: workload.workloadName,
        nodeSize: NodeSize.MEDIUM,
        kind: workload.kind,
        inbound: {
          stats: workload.inbound.stats,
        },
        outbound: {
          stats: workload.outbound.stats,
        },
        stats: {
          active: 10,
          unconnected: 10,
        },
      };
    });
    setEdges(edges);
    setNodes(nodes);
    setNetworkGraphRenderKey(new Date().getTime());
    setSelectedWorkloadId("");
    detailDrawer.close();
  }, [workloads]);

  useEffect(() => {
    if (!detailDrawer.visible) {
      setActiveNodeId("");
    }
  }, [detailDrawer.visible]);

  const handleOnNodeSelected = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setSelectedWorkloadId(nodeId);
    network?.focus(nodeId, {
      scale: 1.0,
      animation: {
        duration: 1000,
        easingFunction: "easeInOutQuad",
      },
    });
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

  const handleChangeFilter = (filterPorts: FilterPorts) => {
    setFilterPorts(filterPorts);
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
        key={networkGraphRenderKey}
        edges={edges}
        nodes={nodes}
        filterPorts={filterPorts}
        activeNodeId={activeNodeId}
        portHover={portHover}
        setNetwork={setNetwork}
        onEdgeDisconnected={handleEdgeDisconnected}
        onNodeSelected={handleOnNodeSelected}
      />
      <ViewFilter
        filterPorts={initFilterPorts}
        onChangeFilter={handleChangeFilter}
      />
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
      />
    </Box>
  );
};
