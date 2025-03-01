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
import { drawAllEdges, drawAllNodes } from "./canvasRenderer";

let network: CustomNetwork;

const NODE_SPACING = 200;

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
        iterations: 200,
      },
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: NODE_SPACING,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 1,
      },
    },
  };
};

export type NetworkGraphProps = {
  nodes: NodeData[];
  edges: EdgeData[];
};

const NetworkGraph = ({ edges, nodes }: NetworkGraphProps) => {
  const containerRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();

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

    network = new Network(containerRef.current, data, options) as CustomNetwork;
    network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
      handleAfterDrawing(ctx, canvasImages, edges, nodes);
    });

    network.on("hoverNode", function (params) {
      const connectedEdges = network.getConnectedEdges(params.node);
      const connectedNodes = network.getConnectedNodes(params.node);
      network.redraw();
      network.off("afterDrawing");
      network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, edges, nodes, {
          hoverNodeId: params.node,
          connectedEdges: connectedEdges,
          connectedNodes: connectedNodes as IdType[],
        });
      });
    });

    network.on("blurNode", function () {
      network.redraw();
      network.off("afterDrawing");
      network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
        handleAfterDrawing(ctx, canvasImages, edges, nodes);
      });
    });
  }, [canvasImages, edges, nodes]);

  useEffect(() => {
    const initializeData = async () => {
      const images = await loadAllImages();
      setCanvasImages(images);
    };

    initializeData();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

const handleAfterDrawing = (
  ctx: CanvasRenderingContext2D,
  canvasImages: CanvasImage,
  edges: EdgeData[],
  nodes: NodeData[],
  options?: {
    hoverNodeId: string;
    connectedEdges: IdType[];
    connectedNodes: IdType[];
  }
) => {
  if (!canvasImages || !network) {
    return;
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const networkEdges = network.body.edges;
  const networkNodes = network.body.nodes;
  for (const nodeId in networkNodes) {
    const node = nodes.find((n) => n.id === nodeId);
    networkNodes[nodeId].data = node;
  }
  for (const edgeId in networkEdges) {
    const edge = edges.find((e) => e.id === edgeId);
    networkEdges[edgeId].data = edge;
  }

  drawAllEdges(ctx, networkEdges, canvasImages, options);
  drawAllNodes(ctx, networkNodes, canvasImages, options);
};

export default NetworkGraph;
