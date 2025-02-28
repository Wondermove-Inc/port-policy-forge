import { IdType } from "vis-network";
import { CanvasImage, CustomEdge, CustomNode, NetworkWithBody } from "./types";
import { workloads } from "./data";
import { drawAllEdges, drawAllNodes } from "./canvasRenderer";

export const setupNetworkEvents = (
  network: NetworkWithBody,
  canvasImages: CanvasImage,
  edges: CustomEdge[]
) => {
  if (!network) return;

  network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
    handleAfterDrawing(ctx, network, canvasImages, edges);
  });

  network.on("hoverNode", function (params) {
    const connectedEdges = network.getConnectedEdges(params.node);
    const connectedNodes = network.getConnectedNodes(params.node);
    network.redraw();
    network.off("afterDrawing");
    network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
      handleAfterDrawing(ctx, network, canvasImages, edges, {
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
      handleAfterDrawing(ctx, network, canvasImages, edges);
    });
  });
};

export const handleAfterDrawing = (
  ctx: CanvasRenderingContext2D,
  network: NetworkWithBody,
  canvasImages: CanvasImage,
  edges: CustomEdge[],
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

  drawAllEdges(ctx, networkEdges, canvasImages, edges, options);
  drawAllNodes(ctx, networkNodes, canvasImages, workloads, options);
};