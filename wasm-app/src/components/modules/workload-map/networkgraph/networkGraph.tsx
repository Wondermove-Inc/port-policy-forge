import { useEffect, useRef, useState } from "react";

import { IdType, Network, Position } from "vis-network";

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

import { FilterPorts, Port } from "@/models";

let network: CustomNetwork | null = null;

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
  activeNodeId: string;
  filterPorts?: FilterPorts;
  portHover: Port | null;
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
  onNodeSelected,
  onEdgeDisconnected,
  setNetwork,
}: NetworkGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
        options
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
          portHover,
        });
      } else {
        handleAfterDrawing(ctx, canvasImages, {
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
          portHover,
        });
      }
    });
    network.on("hoverNode", function (params) {
      document.body.style.cursor = "pointer";
      setActiveEdgeId("");
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = params.node;
      network?.off("afterDrawing");
      network?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, {
          hoverNodeId: params.node,
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
          portHover,
        });
      });
    });

    network.on("blurNode", function () {
      document.body.style.cursor = "auto";
      if (activeNodeId) {
        return;
      }
      hoverNodeId.current = "";
      network?.off("afterDrawing");
      network?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, {
          activeEdgeId: activeEdgeId,
          filterPorts: filterPorts,
          portHover,
        });
      });
    });

    network.on("hoverEdge", () => {
      // moved to canvas mousemove event
    });

    network.on("blurEdge", () => {
      document.body.style.cursor = "auto";
      // moved to canvas mousemove event
    });

    const canvas = containerRef.current?.querySelector("canvas");
    const onMouseMove = (event: MouseEvent) => {
      const pointer = network?.DOMtoCanvas({
        x: event.offsetX,
        y: event.offsetY,
      });

      const edgeId = network?.getEdgeAt({
        x: event.offsetX,
        y: event.offsetY,
      });
      if (edgeId && pointer) {
        const edge = network?.body.edges[edgeId as string];
        if (edge) {
          const fromNodePos = network?.getPositions([edge.from.id])[
            edge.from.id
          ];
          const toNodePos = network?.getPositions([edge.to.id])[edge.to.id];
          if (fromNodePos && toNodePos) {
            const mousemoveRatio = calculatePositionAlongEdge(
              pointer,
              fromNodePos,
              toNodePos
            );
            if (mousemoveRatio >= 0.2 && mousemoveRatio <= 0.8) {
              setActiveEdgeId(edgeId as string);
              document.body.style.cursor = "pointer";
            }
          }
        }
      } else {
        setActiveEdgeId("");
        if (!hoverNodeId.current && !activeNodeId) {
          document.body.style.cursor = "auto";
        }
      }
    };

    if (canvas) {
      canvas.addEventListener("mousemove", onMouseMove);
    }
    network.on("click", function (properties) {
      const nodeId = network?.getNodeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });
      if (nodeId && !activeNodeId) {
        onNodeSelected?.(nodeId as string);
      }

      const clickPosition: Position = {
        x: properties.pointer.canvas.x,
        y: properties.pointer.canvas.y,
      };

      const edgeId = network?.getEdgeAt({
        x: properties.event.srcEvent.offsetX,
        y: properties.event.srcEvent.offsetY,
      });
      if (edgeId) {
        const edge = network?.body.edges[edgeId as string];
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
      canvas?.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    canvasImages,
    edges,
    nodes,
    activeNodeId,
    activeEdgeId,
    filterPorts,
    portHover,
  ]);

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
  options?: DrawingOptions
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
      ...options,
    });
    networkEdge.draw();
  }
  // Draw label after draw line completed
  for (const edgeId in networkEdges) {
    const edge = networkEdges[edgeId];
    const networkEdge = new NetworkEdge(ctx, edge, canvasImages, {
      connectedEdges: connectedEdges,
      ...options,
    });
    networkEdge.drawLabel();
  }

  for (const nodeId in networkNodes) {
    const node = networkNodes[nodeId];
    const networkNode = new NetworkNode(ctx, node, canvasImages, {
      connectedEdges: connectedEdges,
      connectedNodes: connectedNodes,
      ...options,
    });
    networkNode.draw();
  }
};

export default NetworkGraph;
