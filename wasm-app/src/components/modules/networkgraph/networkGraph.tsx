import { useEffect, useRef, useState } from "react";
import { IdType, Network } from "vis-network";
import { loadAllImages } from "./imageLoader";
import {
  CanvasImage,
  EdgeData,
  CustomNetwork,
  NodeData,
  NodeSize,
  Workload,
} from "./types";
import { drawAllEdges, drawAllNodes } from "./canvasRenderer";

let network: CustomNetwork;

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
    },
  };
};

export type NetworkGraphProps = {
  workloads: Workload[];
};

const NetworkGraph = ({ workloads }: NetworkGraphProps) => {
  const containerRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);

  useEffect(() => {
    if (
      !canvasImages ||
      !containerRef.current ||
      edges.length === 0 ||
      nodes.length === 0
    ) {
      return;
    }

    const data = { nodes, edges };
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
    if (workloads) {
      const initializeData = async () => {
        const images = await loadAllImages();
        setCanvasImages(images);
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
          workload.size = workload.size || NodeSize.MEDIUM;
          return {
            id: workload.uuid,
            customLabel: workload.workloadName,
            size: workload.size ? workload.size / 2 : NodeSize.MEDIUM / 2,
            customSize: workload.size ? workload.size : NodeSize.MEDIUM,
            color: "transparent",
            x: 100,
            y: 100,
          };
        });

        setEdges(edges);
        setNodes(nodes);
      };

      initializeData();
    }
  }, [workloads]);

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
