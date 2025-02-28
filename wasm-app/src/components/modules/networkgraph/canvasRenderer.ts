import { IdType } from "vis-network";
import { 
  CanvasImage, 
  CustomEdge, 
  CustomNode, 
  DeploymentIconSize, 
  DrawingOptions, 
  EdgeStatus, 
  NodeSize 
} from "./types";

export const drawAllEdges = (
  ctx: CanvasRenderingContext2D,
  networkEdges: CustomEdge[],
  canvasImages: CanvasImage,
  edges: CustomEdge[],
  options?: {
    hoverNodeId?: string;
    connectedEdges?: IdType[];
    connectedNodes?: IdType[];
  }
) => {
  for (const edgeId in networkEdges) {
    const edge = networkEdges[edgeId];
    edge.status =
      edges.find((e) => e.id === edge.id)?.status || EdgeStatus.DEFAULT;
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
  workloads: any[],
  options?: {
    hoverNodeId?: string;
    connectedEdges?: IdType[];
    connectedNodes?: IdType[];
  }
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

    drawNetworkNode(ctx, node, canvasImages, workloads, {
      hoverNodeId: options?.hoverNodeId,
      connectedEdges: options?.connectedEdges,
      connectedNodes: options?.connectedNodes,
      disabled,
    });
  }
};

export const drawNetworkNode = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage,
  workloads: any[],
  options?: DrawingOptions
) => {
  if (!canvasImages || !node.x || !node.y) {
    return;
  }

  if (options?.disabled) {
    ctx.globalAlpha = 0.2;
  }

  const workloadSize = workloads.find(
    (workload) => workload.uuid === node.id
  )?.size;
  node.size = workloadSize || NodeSize.MEDIUM;
  drawNodeBackground(ctx, node, options);
  drawExclamationIcon(ctx, node, canvasImages);
  drawDeploymentIcon(ctx, node, canvasImages);
  drawNodeLabel(ctx, node, canvasImages, workloads);

  if (options?.disabled) {
    ctx.globalAlpha = 1.0;
  }
};

export const drawNodeBackground = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  options?: DrawingOptions
) => {
  const isHovered = !!options?.hoverNodeId;
  ctx.lineWidth = 2;

  if (isHovered && options?.hoverNodeId === node.id) {
    ctx.fillStyle = "rgba(83, 139, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size / 2 + 20, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(83, 139, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size / 2 + 10, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(83, 139, 255, 1)";
    ctx.fillStyle = "#2d4169";
  } else {
    ctx.fillStyle = "#2d323d";
    ctx.strokeStyle = "#4d4d4f";
  }

  ctx.beginPath();
  ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

export const drawExclamationIcon = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage
) => {
  if (!canvasImages) return;

  ctx.beginPath();
  ctx.drawImage(
    canvasImages.exclamation,
    node.x + 12,
    node.y - node.size / 2,
    20,
    20
  );
  ctx.closePath();
};

export const drawDeploymentIcon = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage
) => {
  if (!canvasImages) return;

  let deploymentIconSize = DeploymentIconSize.MEDIUM;
  if (node.size === NodeSize.BIG) {
    deploymentIconSize = DeploymentIconSize.BIG;
  } else if (node.size === NodeSize.SMALL) {
    deploymentIconSize = DeploymentIconSize.SMALL;
  }
  ctx.beginPath();
  ctx.drawImage(
    canvasImages.deployment,
    node.x - deploymentIconSize / 2,
    node.y - deploymentIconSize / 2,
    deploymentIconSize,
    deploymentIconSize
  );
  ctx.closePath();
};

export const drawNodeLabel = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage,
  workloads: any[]
) => {
  if (!canvasImages) return;

  ctx.font = "12px";
  ctx.fillStyle = "rgba(255, 255, 255, 1)";

  const label = workloads.find(
    (workload) => workload.uuid === node.id
  )?.workloadName;

  const textMetrics = ctx.measureText(label as string);
  const textWidth = textMetrics.width;
  const protectedAddImageWidth = canvasImages.protected.width;
  const imageToTextSpacing = 2;

  ctx.beginPath();
  ctx.fillText(
    label as string,
    node.x - textWidth / 2 + protectedAddImageWidth / 2 - imageToTextSpacing,
    node.y + node.size / 2 + 15,
    100
  );

  ctx.drawImage(
    canvasImages.protected,
    node.x - textWidth / 2 - protectedAddImageWidth,
    node.y + node.size / 2 + 6
  );
  ctx.closePath();
};

export const drawNetWorkEdge = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  canvasImages: CanvasImage,
  options?: {
    connectedEdges?: IdType[];
  }
) => {
  if (!canvasImages) {
    return;
  }

  const isActiveEdge = options?.connectedEdges?.includes(edge.id);
  const { from, to } = edge;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
  ctx.save();
  drawEdgeLine(ctx, edge, from, to, angle, isActiveEdge);
  ctx.restore();
  ctx.save();
  drawEdgeArrow(ctx, edge, from, to, angle, canvasImages, isActiveEdge);
  ctx.restore();
};

export const drawEdgeLine = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  from: CustomNode,
  to: CustomNode,
  angle: number,
  isActiveEdge: boolean = false
) => {
  ctx.strokeStyle = "#4a4f58";

  ctx.lineWidth = 1;
  ctx.lineJoin = "round";

  const fromOffset =
    from.size === NodeSize.BIG ? 38 : from.size === NodeSize.SMALL ? 21 : 31;

  const toOffset =
    to.size === NodeSize.BIG ? 38 : to.size === NodeSize.SMALL ? 21 : 31;

  const newToX = to.x - toOffset * Math.cos(angle);
  const newToY = to.y - toOffset * Math.sin(angle);
  const newFromX = from.x + fromOffset * Math.cos(angle);
  const newFromY = from.y + fromOffset * Math.sin(angle);

  ctx.beginPath();
  if (isActiveEdge) {
    if (edge.status === EdgeStatus.IDLE) {
      ctx.strokeStyle = "#FFA800";
    } else if (edge.status === EdgeStatus.ERROR) {
      ctx.strokeStyle = "#EB4136";
    } else if (edge.status === EdgeStatus.ACCESS_ATTEMPTS) {
      ctx.strokeStyle = "#EB4136";
      ctx.setLineDash([2, 2]);
    } else {
      ctx.strokeStyle = "#125AED";
    }
  }

  ctx.moveTo(newFromX, newFromY);
  ctx.lineTo(newToX, newToY);
  ctx.stroke();
  ctx.closePath();
  ctx.setLineDash([0, 0]);
  
  // Vẽ nhãn cho đường kẻ khi cần
  if (isActiveEdge) {
    drawLineLabel(ctx, edge, newFromX, newToY, newFromY, newToX, angle);
  }
};

export const drawLineLabel = (
  ctx: CanvasRenderingContext2D, 
  edge: CustomEdge,
  newFromX: number,
  newToY: number,
  newFromY: number,
  newToX: number,
  angle: number
) => {
  let label = "";
  let options = {
    backgroundColor: "",
    borderColor: "",
    textColor: ""
  };

  if (edge.status === EdgeStatus.IDLE) {
    label = "Idle";
    options = {
      backgroundColor: "#302d27",
      borderColor: "#FFA800",
      textColor: "#FFA800",
    };
  } else if (
    edge.status === EdgeStatus.ERROR ||
    edge.status === EdgeStatus.ACCESS_ATTEMPTS
  ) {
    label = edge.status === EdgeStatus.ERROR ? "Error" : "Attempt";
    options = {
      backgroundColor: "#2e222c",
      borderColor: "#EB4136",
      textColor: "#EB4136",
    };
  } else {
    return; // Không vẽ nhãn cho trạng thái khác
  }

  const centerX = (newFromX + newToX) / 2;
  const centerY = (newFromY + newToY) / 2;
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(centerX, centerY);
  let textAngle = angle;
  if (textAngle > Math.PI / 2 || textAngle < -Math.PI / 2) {
    textAngle += Math.PI;
  }
  ctx.rotate(textAngle);

  const rectWidth = 48;
  const rectHeight = 24;
  const borderRadius = 8;
  ctx.fillStyle = options.backgroundColor;
  ctx.beginPath();
  ctx.moveTo(-rectWidth / 2 + borderRadius, -rectHeight / 2);
  ctx.lineTo(rectWidth / 2 - borderRadius, -rectHeight / 2);
  ctx.arcTo(
    rectWidth / 2,
    -rectHeight / 2,
    rectWidth / 2,
    -rectHeight / 2 + borderRadius,
    borderRadius
  );
  ctx.lineTo(rectWidth / 2, rectHeight / 2 - borderRadius);
  ctx.arcTo(
    rectWidth / 2,
    rectHeight / 2,
    rectWidth / 2 - borderRadius,
    rectHeight / 2,
    borderRadius
  );
  ctx.lineTo(-rectWidth / 2 + borderRadius, rectHeight / 2);
  ctx.arcTo(
    -rectWidth / 2,
    rectHeight / 2,
    -rectWidth / 2,
    rectHeight / 2 - borderRadius,
    borderRadius
  );
  ctx.lineTo(-rectWidth / 2, -rectHeight / 2 + borderRadius);
  ctx.arcTo(
    -rectWidth / 2,
    -rectHeight / 2,
    -rectWidth / 2 + borderRadius,
    -rectHeight / 2,
    borderRadius
  );
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = options.borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = options.textColor;
  ctx.fillText(label, 0, 0);
};

export const drawEdgeArrow = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  from: CustomNode,
  to: CustomNode,
  angle: number,
  canvasImages: CanvasImage,
  isActiveEdge: boolean = false
) => {
  if (!canvasImages) return;

  let arrowImage = canvasImages.arrow;

  if (isActiveEdge) {
    if (edge.status === EdgeStatus.IDLE) {
      arrowImage = canvasImages.idleArrow;
    } else if (
      edge.status === EdgeStatus.ERROR ||
      edge.status === EdgeStatus.ACCESS_ATTEMPTS
    ) {
      arrowImage = canvasImages.errorArrow;
    } else {
      arrowImage = canvasImages.activeArrow;
    }
  }

  const arrowOffset =
    to.size === NodeSize.BIG
      ? 40.5
      : to.size === NodeSize.SMALL
      ? 23.5
      : 33.5;
  const arrowNewToX = to.x - arrowOffset * Math.cos(angle);
  const arrowNewToY = to.y - arrowOffset * Math.sin(angle);
  const arrowSize = 16;

  ctx.translate(arrowNewToX, arrowNewToY);
  ctx.rotate(angle + Math.PI / 2);
  ctx.drawImage(
    arrowImage,
    -arrowSize / 2,
    -arrowSize / 2,
    arrowSize,
    arrowSize
  );
};