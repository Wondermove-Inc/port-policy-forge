import { useCallback, useEffect, useRef, useState } from "react";

import { IdType, Network, Position } from "vis-network";

import { NetworkEdge } from "./edge";
import { ImageLoader } from "./imageLoader";
import { NetworkNode } from "./node";
import {
  CanvasImage,
  EdgeData,
  CustomNetwork,
  NodeData,
  NetworkNodeData,
} from "./types";
import { calculatePositionAlongEdge } from "./utils";

import { FilterPorts, Port, PortDirection } from "@/models";
import { networkOptions } from "./constants";

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
  activeNodeId: string;
  filterPorts?: FilterPorts;
  portHover: Port | null;
  removingEdgeId: string;
  portDirection: PortDirection;
  onEdgeDisconnected?: (edgeId: string) => void;
  onNodeSelected?: (nodeId: string) => void;
  setNetwork: (n: CustomNetwork) => void;
};

const NetworkGraph = ({
  edges,
  nodes,
  activeNodeId,
  filterPorts,
  portHover,
  removingEdgeId,
  portDirection,
  onNodeSelected,
  onEdgeDisconnected,
  setNetwork,
}: NetworkGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();
  const [activeEdgeId, setActiveEdgeId] = useState("");
  const hoverNodeId = useRef<string>("");
  const networkRef = useRef<CustomNetwork>(null);
  useEffect(() => {
    if (
      !canvasImages ||
      !containerRef.current ||
      edges.length === 0 ||
      nodes.length === 0
    ) {
      return;
    }

    nodes.forEach((node) => {
      (node as NodeData & NetworkNodeData).size = node.nodeSize / 2;
      (node as NodeData & NetworkNodeData).color = "transparent";
    });

    const data = { nodes: nodes, edges };
    if (!networkRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        data,
        networkOptions
      ) as CustomNetwork;
    }
    if (activeNodeId) {
      networkRef.current.off("hoverNode");
      networkRef.current.off("afterDrawing");
      networkRef.current.off("blurNode");
      networkRef.current.off("click");
      hoverNodeId.current = "";
    }

    draw();
    networkRef.current.on("hoverNode", function (params) {
      document.body.style.cursor = "pointer";
      setActiveEdgeId("");
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = params.node;
    });

    networkRef.current.on("blurNode", function () {
      document.body.style.cursor = "auto";
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = "";
    });

    networkRef.current.on("hoverEdge", (params) => {
      setActiveEdgeId(params.edge as string);
      document.body.style.cursor = "pointer";
    });

    networkRef.current.on("blurEdge", () => {
      setActiveEdgeId("");
      document.body.style.cursor = "auto";
    });

    networkRef.current.on("click", function (properties) {
      const edgeId = networkRef.current?.getEdgeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });
      const nodeId = networkRef.current?.getNodeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });

      const connectedEdges = activeNodeId
        ? networkRef.current?.getConnectedEdges(activeNodeId)
        : [];
      const clickPosition: Position = {
        x: properties.pointer.canvas.x,
        y: properties.pointer.canvas.y,
      };
      if (nodeId) {
        onNodeSelected?.(nodeId as string);
        return;
      }
      if (edgeId && activeNodeId && connectedEdges?.includes(edgeId)) {
        const edge = networkRef.current?.body.edges[edgeId as string];
        if (edge) {
          const fromNodePos = networkRef.current?.getPositions([edge.from.id])[
            edge.from.id
          ];
          const toNodePos = networkRef.current?.getPositions([edge.to.id])[
            edge.to.id
          ];
          if (fromNodePos && toNodePos) {
            const clickRatio = calculatePositionAlongEdge(
              clickPosition,
              fromNodePos,
              toNodePos
            );
            if (clickRatio > 0.42 && clickRatio < 0.58) {
              onEdgeDisconnected?.(edge.id as string);
            }
          }
        }
      }
    });

    setNetwork(networkRef.current);
    return () => {
      networkRef.current?.off("hoverNode");
      networkRef.current?.off("afterDrawing");
      networkRef.current?.off("blurNode");
      networkRef.current?.off("click");
    };
  }, [
    canvasImages,
    edges,
    nodes,
    activeNodeId,
    activeEdgeId,
    filterPorts,
    portHover,
    removingEdgeId,
    portDirection,
  ]);

  const draw = useCallback(() => {
    if (!canvasImages) {
      return;
    }
    networkRef.current?.off("afterDrawing");
    networkRef.current?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
      const selectedNodeId = (hoverNodeId.current || activeNodeId) as string;
      let connectedEdges = selectedNodeId
        ? networkRef.current?.getConnectedEdges(selectedNodeId)
        : [];
      let connectedNodes = (
        selectedNodeId
          ? networkRef.current?.getConnectedNodes(selectedNodeId)
          : []
      ) as IdType[];

      if (activeNodeId) {
        const inboundEdges = edges.filter((edge) => edge.to === activeNodeId);
        const outboundEdges = edges.filter(
          (edge) => edge.from === activeNodeId
        );
        if (portDirection === PortDirection.OUTBOUND) {
          const outboundNodeIds = outboundEdges.map((edge) => edge.to);
          const outboundEdgeIds = outboundEdges.map((edge) => edge.id);
          connectedEdges = connectedEdges?.filter((connectedEdge) =>
            outboundEdgeIds.includes(connectedEdge as string)
          );
          connectedNodes = connectedNodes.filter((connectedNode) =>
            outboundNodeIds.includes(connectedNode as string)
          );
        } else {
          const inboundNodeIds = inboundEdges.map((edge) => edge.from);
          const inboundEdgeIds = inboundEdges.map((edge) => edge.id);
          connectedEdges = connectedEdges?.filter((connectedEdge) =>
            inboundEdgeIds.includes(connectedEdge as string)
          );
          connectedNodes = connectedNodes.filter((connectedNode) =>
            inboundNodeIds.includes(connectedNode as string)
          );
        }
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const networkEdges = networkRef.current?.body.edges;
      const networkNodes = networkRef.current?.body.nodes;
      for (const nodeId in networkNodes) {
        const node = networkRef.current?.body.data.nodes.get(nodeId);
        if (node) {
          networkNodes[nodeId].data = node;
        }
      }
      for (const edgeId in networkEdges) {
        const edge = networkRef.current?.body.data.edges.get(edgeId);
        if (edge) {
          networkEdges[edgeId].data = edge;
        }
      }
      for (const edgeId in networkEdges) {
        const edge = networkEdges[edgeId];
        const networkEdge = new NetworkEdge(ctx, edge, canvasImages, {
          connectedEdges: connectedEdges,
          activeEdgeId,
          activeNodeId,
          connectedNodes,
          filterPorts,
          hoverNodeId: hoverNodeId.current,
          network: networkRef.current as CustomNetwork,
          portHover,
          removingEdgeId,
        });
        networkEdge.draw();
      }

      for (const nodeId in networkNodes) {
        const node = networkNodes[nodeId];
        const networkNode = new NetworkNode(ctx, node, canvasImages, {
          connectedEdges: connectedEdges,
          activeEdgeId,
          activeNodeId,
          connectedNodes,
          filterPorts,
          hoverNodeId: hoverNodeId.current,
          network: networkRef.current as CustomNetwork,
          portHover,
        });
        networkNode.draw();
      }
    });
    networkRef.current?.redraw();
  }, [
    canvasImages,
    edges,
    nodes,
    activeNodeId,
    activeEdgeId,
    filterPorts,
    portHover,
    removingEdgeId,
    portDirection,
  ]);

  useEffect(() => {
    const imageLoader = new ImageLoader();
    imageLoader.load().then((images) => {
      setCanvasImages(images);
    });
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default NetworkGraph;
