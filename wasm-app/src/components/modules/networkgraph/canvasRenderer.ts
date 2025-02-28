import { IdType } from "vis-network";
import { CanvasImage, CustomEdge, CustomNode } from "./types";
import { drawNetWorkEdge } from "./edge";
import { drawNetworkNode } from "./node";

export const drawAllEdges = (
  ctx: CanvasRenderingContext2D,
  networkEdges: CustomEdge[],
  canvasImages: CanvasImage,
  options?: {
    hoverNodeId?: string;
    connectedEdges?: IdType[];
    connectedNodes?: IdType[];
  },
) => {
  for (const edgeId in networkEdges) {
    const edge = networkEdges[edgeId];
    if (edge) {
      drawNetWorkEdge(ctx, edge, canvasImages, {
        connectedEdges: options?.connectedEdges,
      });
    }
  }
};

export const drawAllNodes = (
  ctx: CanvasRenderingContext2D,
  networkNodes: CustomNode[],
  canvasImages: CanvasImage,
  options?: {
    hoverNodeId?: string;
    connectedEdges?: IdType[];
    connectedNodes?: IdType[];
  },
) => {
  for (const nodeId in networkNodes) {
    const node = networkNodes[nodeId];
    let disabled = false;

    if (
      options?.hoverNodeId &&
      !options?.connectedNodes?.includes(nodeId) &&
      options.hoverNodeId !== nodeId
    ) {
      disabled = true;
    }

    drawNetworkNode(ctx, node, canvasImages, {
      hoverNodeId: options?.hoverNodeId,
      connectedEdges: options?.connectedEdges,
      connectedNodes: options?.connectedNodes,
      disabled,
    });
  }
};

// export const setupNetworkAnimation = (
//   canvas: HTMLCanvasElement,
//   networkNodes: CustomNode[],
//   networkEdges: CustomEdge[],
//   canvasImages: CanvasImage,
//   options?: {
//     hoverNodeId?: string;
//     connectedEdges?: IdType[];
//     connectedNodes?: IdType[];
//   }
// ) => {
//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   let animationFrameId: number;

//   const animate = () => {
//     // ctx.clearRect(0, 0, canvas.width, canvas.height);
//     const timestamp = Date.now();
//     drawAllEdges(ctx, networkEdges, canvasImages, [], {
//       ...options,
//     });
//     drawAllNodes(ctx, networkNodes, canvasImages, {
//       ...options,
//       timestamp,
//     });
//     animationFrameId = requestAnimationFrame(animate);
//   };
//   animate();
//   return () => {
//     cancelAnimationFrame(animationFrameId);
//   };
// };
