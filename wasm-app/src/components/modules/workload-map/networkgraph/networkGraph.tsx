import { useEffect, useRef, useState } from "react";

import { IdType, Network } from "vis-network";

import { NetworkEdge } from "./edge";
import { ImageLoader } from "./imageLoader";
import { createNetworkOptions } from "./network";
import { NetworkNode } from "./node";
import {
  CanvasImage,
  EdgeData,
  CustomNetwork,
  NodeData,
  NetworkNodeData,
  DrawingOptions,
} from "./types";
import { calculatePositionAlongEdge } from "./utils";

import { FilterPorts } from "@/models";

let network: CustomNetwork | null = null;

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
  activeNodeId: string;
  filterPorts?: FilterPorts;
  onEdgeDisconnected?: (edgeId: string) => void;
  onNodeSelected?: (nodeId: string) => void;
  setNetwork: (n: CustomNetwork) => void;
};

const NetworkGraph = ({
  edges,
  nodes,
  activeNodeId,
  filterPorts,
  onNodeSelected,
  onEdgeDisconnected,
  setNetwork,
}: NetworkGraphProps) => {
  const containerRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();
  const [activeEdgeId, setActiveEdgeId] = useState("");
  const hoverNodeId = useRef<string>("");
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
      (node as NodeData & NetworkNodeData).x = 100;
      (node as NodeData & NetworkNodeData).y = 100;
    });

    const data = { nodes: nodes, edges };
    const options = createNetworkOptions();
    if (!network) {
      network = new Network(
        containerRef.current,
        data,
        options,
      ) as CustomNetwork;
    }
    if (activeNodeId) {
      network.off("hoverNode");
      network.off("afterDrawing");
      network.off("blurNode");
      network.off("click");
      hoverNodeId.current = "";
    }

    network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
      if (hoverNodeId.current || activeNodeId) {
        handleAfterDrawing(ctx, canvasImages, {
          hoverNodeId: hoverNodeId.current,
          activeNodeId: activeNodeId,
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
        });
      } else {
        handleAfterDrawing(ctx, canvasImages, {
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
        });
      }
    });
    network.on("hoverNode", function (params) {
      setActiveEdgeId("");
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = params.node;
      document.body.style.cursor = "pointer";
      network?.off("afterDrawing");
      network?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, {
          hoverNodeId: params.node,
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
        });
      });
    });

    network.on("blurNode", function () {
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = "";
      document.body.style.cursor = "auto";
      network?.off("afterDrawing");
      network?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, {
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
        });
      });
    });

    network.on("hoverEdge", (params) => {
      setActiveEdgeId(params.edge);
      document.body.style.cursor = "pointer";
    });

    network.on("blurEdge", () => {
      setActiveEdgeId("");
      document.body.style.cursor = "auto";
    });

    network.on("click", function (properties) {
      const nodeId = network?.getNodeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });
      if (nodeId) {
        onNodeSelected?.(nodeId as string);
      }

      const clickPosition = {
        x: properties.pointer.canvas.x,
        y: properties.pointer.canvas.y,
      };

      const edgeId = network?.getEdgeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });
      if (edgeId && !nodeId) {
        const edge = network?.body.edges[edgeId as any];
        if (edge) {
          const fromNodePos = network?.getPositions([edge.from.id])[
            edge.from.id
          ];
          const toNodePos = network?.getPositions([edge.to.id])[edge.to.id];
          if (fromNodePos && toNodePos) {
            const clickRatio = calculatePositionAlongEdge(
              clickPosition,
              fromNodePos,
              toNodePos,
            );
            if (clickRatio > 0.42 && clickRatio < 0.58) {
              onEdgeDisconnected?.(edge.id as string);
            }
          }
        }
      }
    });

    network.redraw();
    setNetwork(network);
    return () => {
      network?.off("hoverNode");
      network?.off("afterDrawing");
      network?.off("blurNode");
      network?.off("click");
    };
  }, [canvasImages, edges, nodes, activeNodeId, activeEdgeId, filterPorts]);

  useEffect(() => {
    return () => {
      network?.destroy();
      network = null;
    };
  }, []);

  useEffect(() => {
    const imageLoader = new ImageLoader();
    imageLoader.load().then((images) => {
      setCanvasImages(images);
    });
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

const handleAfterDrawing = (
  ctx: CanvasRenderingContext2D,
  canvasImages: CanvasImage,
  options?: DrawingOptions,
) => {
  if (!canvasImages || !network) {
    return;
  }
  const activeNodeId = (options?.hoverNodeId ||
    options?.activeNodeId) as string;
  const connectedEdges: IdType[] = activeNodeId
    ? network?.getConnectedEdges(activeNodeId)
    : [];
  const connectedNodes: IdType[] = (
    activeNodeId ? network?.getConnectedNodes(activeNodeId) : []
  ) as IdType[];
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const networkEdges = network.body.edges;
  const networkNodes = network.body.nodes;
  for (const nodeId in networkNodes) {
    const node = network.body.data.nodes.get(nodeId);
    if (node) {
      networkNodes[nodeId].data = node;
    }
  }
  for (const edgeId in networkEdges) {
    const edge = network.body.data.edges.get(edgeId);
    if (edge) {
      networkEdges[edgeId].data = edge;
    }
  }
  for (const edgeId in networkEdges) {
    const edge = networkEdges[edgeId];
    const networkEdge = new NetworkEdge(ctx, edge, canvasImages, {
      connectedEdges: connectedEdges,
      hoverNodeId: options?.hoverNodeId,
      activeNodeId: options?.activeNodeId,
      activeEdgeId: options?.activeEdgeId,
    });
    networkEdge.draw();
  }
  // Draw label after draw line completed
  for (const edgeId in networkEdges) {
    const edge = networkEdges[edgeId];
    const networkEdge = new NetworkEdge(ctx, edge, canvasImages, {
      connectedEdges: connectedEdges,
      hoverNodeId: options?.hoverNodeId,
      activeNodeId: options?.activeNodeId,
      activeEdgeId: options?.activeEdgeId,
    });
    networkEdge.drawLabel();
  }

  for (const nodeId in networkNodes) {
    const node = networkNodes[nodeId];
    const networkNode = new NetworkNode(ctx, node, canvasImages, {
      hoverNodeId: options?.hoverNodeId,
      activeNodeId: options?.activeNodeId,
      filterPorts: options?.filterPorts,
      connectedEdges: connectedEdges,
      connectedNodes: connectedNodes,
    });
    networkNode.draw();
  }
};

export default NetworkGraph;
