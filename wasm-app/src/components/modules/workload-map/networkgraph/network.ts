import { IdType } from "vis-network";

import { NetworkEdge } from "./edge";
import { NetworkNode } from "./node";
import { CanvasImage, CustomNetwork } from "./types";

export const createNetworkOptions = () => {
  return {
    interaction: {
      dragNodes: false,
      hover: true,
      selectable: false,
    },
    nodes: {
      shape: "dot",
      color: { background: "#007bff", border: "#0056b3" },
      font: { color: "#ffffff", size: 12 },
    },
    edges: {
      color: "transparent",
      smooth: false,
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 400,
      },
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 120,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 1,
      },
    },
  };
};

export const networkDrawing = (
  ctx: CanvasRenderingContext2D,
  canvasImages: CanvasImage,
  network: CustomNetwork,
  options?: {
    hoverNodeId?: string;
    activeEdgeId?: string;
  },
) => {
  if (!canvasImages || !network) {
    return;
  }
  const connectedEdges: IdType[] = options?.hoverNodeId
    ? network.getConnectedEdges(options?.hoverNodeId as string)
    : [];
  const connectedNodes: IdType[] = (
    options?.hoverNodeId
      ? network.getConnectedNodes(options?.hoverNodeId as string)
      : []
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
      activeEdgeId: options?.activeEdgeId,
    });
    networkEdge.drawLabel();
  }

  for (const nodeId in networkNodes) {
    const node = networkNodes[nodeId];
    const networkNode = new NetworkNode(ctx, node, canvasImages, {
      hoverNodeId: options?.hoverNodeId,
      connectedEdges: connectedEdges,
      connectedNodes: connectedNodes,
    });
    networkNode.draw();
  }
};
