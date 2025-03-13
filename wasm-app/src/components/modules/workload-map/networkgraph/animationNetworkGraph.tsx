import { useEffect, useRef } from "react";

import { Network, Position } from "vis-network";

import { NetworkEdge } from "./edge";
import {
  EdgeData,
  CustomNetwork,
  NodeData,
  NetworkNodeData,
  CanvasImage,
} from "./types";
import { calculatePositionAlongEdge } from "./utils";

import { FilterPorts, Port } from "@/models";
import { networkOptions } from "./constants";

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
  activeNodeId: string;
  filterPorts?: FilterPorts;
  portHover: Port | null;
  onEdgeDisconnected?: (edgeId: string) => void;
  onNodeSelected?: (nodeId: string) => void;
  setNetwork: (n: CustomNetwork) => void;
  onMove: (options: { scale?: number; position?: Position }) => void;
};

const AnimationNetworkGraph = ({
  edges,
  nodes,
  filterPorts,
  portHover,
  onNodeSelected,
  onEdgeDisconnected,
  setNetwork,
  onMove,
}: NetworkGraphProps) => {
  const speed = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverNodeId = useRef<string>("");
  const networkRef = useRef<CustomNetwork>(null);
  useEffect(() => {
    if (!containerRef.current || edges.length === 0 || nodes.length === 0) {
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

    networkRef.current.on("hoverNode", function (params) {
      document.body.style.cursor = "pointer";
      hoverNodeId.current = params.node;
    });

    networkRef.current.on("blurNode", function () {
      document.body.style.cursor = "auto";
    });

    networkRef.current.on("hoverEdge", (params) => {
      document.body.style.cursor = "pointer";
    });

    networkRef.current.on("blurEdge", () => {
      document.body.style.cursor = "auto";
    });

    networkRef.current.on("zoom", () => {
      onMove({
        scale: networkRef.current?.getScale(),
        position: networkRef.current?.getViewPosition(),
      });
    });

    networkRef.current.on("dragging", () => {
      onMove({
        scale: networkRef.current?.getScale(),
        position: networkRef.current?.getViewPosition(),
      });
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

      const clickPosition: Position = {
        x: properties.pointer.canvas.x,
        y: properties.pointer.canvas.y,
      };
      if (nodeId) {
        onNodeSelected?.(nodeId as string);
        return;
      }
      if (edgeId) {
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
    const animationId = requestAnimationFrame(animation);

    return () => {
      networkRef.current?.off("hoverNode");
      networkRef.current?.off("afterDrawing");
      networkRef.current?.off("blurNode");
      networkRef.current?.off("click");
      cancelAnimationFrame(animationId);
    };
  }, [edges, nodes, setNetwork]);

  const draw = () => {
    networkRef.current?.off("afterDrawing");
    networkRef.current?.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
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
        const networkEdge = new NetworkEdge(ctx, edge, {} as CanvasImage, {
          filterPorts,
          hoverNodeId: hoverNodeId.current,
          network: networkRef.current as CustomNetwork,
          portHover,
        });
        networkEdge.drawEdgeAnimation(speed.current);
      }
    });
    networkRef.current?.redraw();
  };

  const animation = () => {
    speed.current += 1;
    if (speed.current >= 110) {
      speed.current = 0;
    }
    draw();
    requestAnimationFrame(animation);
    // setTimeout(() => requestAnimationFrame(animation), 10);
  };

  return (
    <div
      className="vis-network-animation"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default AnimationNetworkGraph;
