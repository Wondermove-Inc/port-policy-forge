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
import { FilterPorts, PortDirection, WorkloadKind } from "@/models";
import { wasmListWorkloads } from "@/services/listWorkloads";
import { useCommonStore } from "@/store";

export const WorkloadMap = () => {
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [removingEdgeId, setRemovingEdgeId] = useState("");
  const [networkGraphRenderKey, setNetworkGraphRenderKey] = useState<number>(
    new Date().getTime()
  );
  const {
    workloads: storeWorkloads,
    portHover,
    selectedNamespace,
  } = useCommonStore();

  const [workloads, setWorkloads] = useState(storeWorkloads);
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
  const [portDirection, setPortDirection] = useState(PortDirection.INBOUND);

  useEffect(() => {
    setWorkloads(storeWorkloads);
  }, [storeWorkloads]);
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

    const nodes = workloads.reduce((preWorkloads, workload) => {
      const cpuUsage = workload.usage;
      let nodeSize = NodeSize.MEDIUM;
      if (cpuUsage >= 0.7) {
        nodeSize = NodeSize.BIG;
      } else if (cpuUsage <= 0.3) {
        nodeSize = NodeSize.SMALL;
      } else {
        nodeSize = NodeSize.MEDIUM;
      }
      preWorkloads.push({
        ...workload,
        id: workload.uuid,
        customLabel: workload.workloadName,
        nodeSize: nodeSize,
        kind: workload.kind,
        inbound: {
          stats: workload.inbound.stats,
        },
        outbound: {
          stats: workload.outbound.stats,
        },
      });
      for (const w of [...(workload.from || []), ...(workload.to || [])]) {
        if (
          w.workload &&
          !workloads.map((workload) => workload.uuid).includes(w.workload.uuid)
        ) {
          preWorkloads.push({
            ...w.workload,
            id: w.workload.uuid,
            customLabel: w.workload?.workloadName as string,
            nodeSize: NodeSize.MEDIUM,
            kind: w.workload?.kind || WorkloadKind.EXTERNAL,
            externalNamespace: w.workload?.namespace || "",
            isExternalNamespace: true,
          });
        }
      }
      return preWorkloads;
    }, [] as NodeData[]);

    setEdges(edges);
    setNodes(nodes);
    setNetworkGraphRenderKey(new Date().getTime());
    setSelectedWorkloadId("");
    detailDrawer.close();
  }, [workloads]);

  useEffect(() => {
    if (!detailDrawer.visible) {
      setActiveNodeId("");
      network?.fit({
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });
    }
  }, [detailDrawer.visible]);

  const handleOnNodeSelected = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setSelectedWorkloadId(nodeId);
    try {
      network?.focus(nodeId, {
        scale: 1.0,
        offset: {
          x: -512 / 2,
          y: 0,
        },
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });
    } catch {}

    detailDrawer.open();
  };

  const handleEdgeDisconnected = (edgeId: string) => {
    selectedEdgeId.current = edgeId;
    modalClosePort.open();
  };

  const handleClosePort = () => {
    modalClosePort.close();
    const edge = edges.find((edge) => edge.id === selectedEdgeId.current);
    if (edge) {
      setRemovingEdgeId(edge.id as string);
      setTimeout(() => {
        setRemovingEdgeId("");
        network?.body.data.edges.remove(selectedEdgeId.current);
        const fromConnectNodes = network?.getConnectedNodes(edge.from);
        const toConnectEdges = network?.getConnectedNodes(edge.to);
        if (fromConnectNodes?.length === 0) {
          network?.body.data.nodes.remove(edge.from);
        }
        if (toConnectEdges?.length === 0) {
          network?.body.data.nodes.remove(edge.to);
        }
      }, 3000);
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

  const handleKeywordChange = (keyword: string) => {
    // implement debounce function here ...
    wasmListWorkloads(selectedNamespace).then((val) => {
      const filteredWorkloads = val.result.filter((workload) =>
        workload.workloadName.includes(keyword)
      );
      setWorkloads(filteredWorkloads);
    });
  };

  const handleDirectionChange = (direction: string) => {
    setPortDirection(direction as PortDirection);
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
        removingEdgeId={removingEdgeId}
        portDirection={portDirection}
        setNetwork={setNetwork}
        onEdgeDisconnected={handleEdgeDisconnected}
        onNodeSelected={handleOnNodeSelected}
      />
      <ViewFilter
        filterPorts={initFilterPorts}
        onChangeFilter={handleChangeFilter}
        onKeywordChange={handleKeywordChange}
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
        onDirectionChange={handleDirectionChange}
      />
    </Box>
  );
};
