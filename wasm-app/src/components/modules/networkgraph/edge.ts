import { IdType } from "vis-network";
import { color } from "./color";
import {
  CanvasImage,
  CustomEdge,
  CustomNode,
  EdgeStatus,
  NodeSize,
} from "./types";

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
  ctx.strokeStyle = color.stroke.default;

  ctx.lineWidth = 1;
  ctx.lineJoin = "round";
  const fromSize = from?.data?.customSize;
  const toSize = to?.data?.customSize;
  const fromOffset =
    fromSize === NodeSize.BIG ? 38 : fromSize === NodeSize.SMALL ? 21 : 31;

  const toOffset =
    toSize === NodeSize.BIG ? 38 : toSize === NodeSize.SMALL ? 21 : 31;

  const newToX = to.x - toOffset * Math.cos(angle);
  const newToY = to.y - toOffset * Math.sin(angle);
  const newFromX = from.x + fromOffset * Math.cos(angle);
  const newFromY = from.y + fromOffset * Math.sin(angle);

  ctx.beginPath();
  if (isActiveEdge) {
    if (edge.data?.status === EdgeStatus.IDLE) {
      ctx.strokeStyle = color.idle;
    } else if (edge.data?.status === EdgeStatus.ERROR) {
      ctx.strokeStyle = color.error;
    } else if (edge.data?.status === EdgeStatus.ACCESS_ATTEMPTS) {
      ctx.strokeStyle = color.error;
      ctx.setLineDash([2, 2]);
    } else {
      ctx.strokeStyle = color.active;
    }
  }

  ctx.moveTo(newFromX, newFromY);
  ctx.lineTo(newToX, newToY);
  ctx.stroke();
  ctx.closePath();
  ctx.setLineDash([0, 0]);

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
    textColor: "",
  };

  if (edge.data?.status === EdgeStatus.IDLE) {
    label = "Idle";
    options = {
      backgroundColor: color.idleBackground,
      borderColor: color.idle,
      textColor: color.idle,
    };
  } else if (
    edge.data?.status === EdgeStatus.ERROR ||
    edge.data?.status === EdgeStatus.ACCESS_ATTEMPTS
  ) {
    label = edge.data?.status === EdgeStatus.ERROR ? "Error" : "Attempt";
    options = {
      backgroundColor: color.errorBackground,
      borderColor: color.error,
      textColor: color.error,
    };
  } else {
    return;
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
    if (edge.data?.status === EdgeStatus.IDLE) {
      arrowImage = canvasImages.idleArrow;
    } else if (
      edge.data?.status === EdgeStatus.ERROR ||
      edge.data?.status === EdgeStatus.ACCESS_ATTEMPTS
    ) {
      arrowImage = canvasImages.errorArrow;
    } else {
      arrowImage = canvasImages.activeArrow;
    }
  }

  const toSize = to?.data?.customSize
  const arrowOffset =
    toSize === NodeSize.BIG ? 40.5 : toSize === NodeSize.SMALL ? 23.5 : 33.5;
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
