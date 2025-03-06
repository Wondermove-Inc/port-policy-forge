import { useEffect, useRef, useState } from "react";
import { IdType, Network } from "vis-network";
import { loadAllImages } from "./imageLoader";
import {
  CanvasImage,
  EdgeData,
  CustomNetwork,
  NodeData,
  NetworkNodeData,
} from "./types";
import { NetworkEdge } from "./edge";
import { NetworkNode } from "./node";
import { calculatePositionAlongEdge } from "./utils";
import { createNetworkOptions } from "./network";

let network: CustomNetwork | null = null;

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
  onEdgeDisconnected?: (edgeId: string) => void;
  setNetwork: (n: CustomNetwork) => void;
};

const NetworkGraph = ({
  edges,
  nodes,
  onEdgeDisconnected,
  setNetwork,
}: NetworkGraphProps) => {
  const containerRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();
  const [activeNodeId, setActiveNodeId] = useState("");
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
        options
      ) as CustomNetwork;
    }
    if (activeNodeId) {
      network.off("hoverNode");
      network.off("afterDrawing");
      network.off("blurNode");
      network.off("click");
    }

    network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
      const currentNodeId = activeNodeId || hoverNodeId.current;
      if (currentNodeId) {
        handleAfterDrawing(ctx, canvasImages, {
          hoverNodeId: currentNodeId,
          activeEdgeId: activeEdgeId,
        });
      } else {
        handleAfterDrawing(ctx, canvasImages, {
          activeEdgeId: activeEdgeId,
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
        setActiveNodeId(nodeId as string);
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
              toNodePos
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
  }, [canvasImages, edges, nodes, activeNodeId, activeEdgeId]);

  useEffect(() => {
    return () => {
      network?.destroy();
      network = null;
    };
  }, []);

  useEffect(() => {
    loadAllImages().then((images) => {
      setCanvasImages(images);
    });
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

const handleAfterDrawing = (
  ctx: CanvasRenderingContext2D,
  canvasImages: CanvasImage,
  options?: {
    hoverNodeId?: string;
    activeEdgeId?: string;
  }
) => {
  if (!canvasImages || !network) {
    return;
  }
  const connectedEdges: IdType[] = options?.hoverNodeId
    ? network?.getConnectedEdges(options?.hoverNodeId as string)
    : [];
  const connectedNodes: IdType[] = (
    options?.hoverNodeId
      ? network?.getConnectedNodes(options?.hoverNodeId as string)
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

export default NetworkGraph;
