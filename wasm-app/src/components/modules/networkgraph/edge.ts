import { IdType } from "vis-network";
import { color } from "./color";
import {
  CanvasImage,
  CustomEdge,
  CustomNode,
  EdgeStatus,
  NodeSize,
} from "./types";

const ARROW_SIZE = 16;
const LINE_WIDTH = 1;
const LABEL_RECT_WIDTH = 48;
const LABEL_RECT_HEIGHT = 24;
const LABEL_BORDER_RADIUS = 8;
const FONT = "12px Arial";

const getLineOffset = (nodeSize: NodeSize | undefined): number => {
  if (nodeSize === undefined) return 31;

  switch (nodeSize) {
    case NodeSize.BIG:
      return 38;
    case NodeSize.SMALL:
      return 21;
    default:
      return 31;
  }
};

const getArrowOffset = (nodeSize: NodeSize | undefined): number => {
  if (nodeSize === undefined) return 33.5;

  switch (nodeSize) {
    case NodeSize.BIG:
      return 41;
    case NodeSize.SMALL:
      return 24;
    default:
      return 34;
  }
};

interface EdgeStyle {
  strokeStyle: string;
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  arrowKey: keyof CanvasImage;
  lineDash: number[];
}

const EDGE_STYLES: Record<string, EdgeStyle> = {
  [EdgeStatus.IDLE]: {
    strokeStyle: color.idle,
    label: "Idle",
    backgroundColor: color.idleBackground,
    borderColor: color.idle,
    textColor: color.idle,
    arrowKey: "idleArrow",
    lineDash: [0, 0],
  },
  [EdgeStatus.ERROR]: {
    strokeStyle: color.error,
    label: "Error",
    backgroundColor: color.errorBackground,
    borderColor: color.error,
    textColor: color.error,
    arrowKey: "errorArrow",
    lineDash: [0, 0],
  },
  [EdgeStatus.ACCESS_ATTEMPTS]: {
    strokeStyle: color.error,
    label: "Attempt",
    backgroundColor: color.errorBackground,
    borderColor: color.error,
    textColor: color.error,
    arrowKey: "errorArrow",
    lineDash: [2, 2],
  },
  DEFAULT: {
    strokeStyle: color.active,
    arrowKey: "activeArrow",
    lineDash: [0, 0],
  },
};

export const drawNetWorkEdge = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  canvasImages: CanvasImage,
  options?: {
    connectedEdges?: IdType[];
  }
) => {
  if (!canvasImages) return;

  const isActiveEdge = options?.connectedEdges?.includes(edge.id);
  const { from, to } = edge;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  ctx.save();

  const fromSize = from?.data?.nodeSize;
  const toSize = to?.data?.nodeSize;
  const fromOffset = getLineOffset(fromSize);
  const toOffset = getLineOffset(toSize);

  const newFromX = from.x + fromOffset * Math.cos(angle);
  const newFromY = from.y + fromOffset * Math.sin(angle);
  const newToX = to.x - toOffset * Math.cos(angle);
  const newToY = to.y - toOffset * Math.sin(angle);

  drawEdgeLine(
    ctx,
    edge,
    newFromX,
    newFromY,
    newToX,
    newToY,
    angle,
    isActiveEdge
  );

  if (isActiveEdge) {
    drawLineLabel(ctx, edge, newFromX, newFromY, newToX, newToY, angle);
  }

  drawEdgeArrow(ctx, edge, to, angle, canvasImages, isActiveEdge);

  ctx.restore();
};

const drawEdgeLine = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  angle: number,
  isActiveEdge: boolean = false
) => {
  ctx.beginPath();
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineJoin = "round";

  if (isActiveEdge) {
    const edgeStatus = edge.data?.status;
    const styleKey = edgeStatus ? String(edgeStatus) : "DEFAULT";
    const style = EDGE_STYLES[styleKey] || EDGE_STYLES.DEFAULT;

    ctx.strokeStyle = style.strokeStyle;
    ctx.setLineDash(style.lineDash);
  } else {
    ctx.strokeStyle = color.stroke.default;
    ctx.setLineDash([0, 0]);
  }

  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.closePath();
  ctx.setLineDash([0, 0]);
};

const drawLineLabel = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  angle: number
) => {
  const edgeStatus = edge.data?.status;
  if (!edgeStatus) return;

  const styleKey = String(edgeStatus);
  const style = EDGE_STYLES[styleKey];

  // Chỉ vẽ nhãn cho các trạng thái cụ thể
  if (
    !style ||
    !style.label ||
    !style.backgroundColor ||
    !style.borderColor ||
    !style.textColor
  ) {
    return;
  }

  const centerX = (fromX + toX) / 2;
  const centerY = (fromY + toY) / 2;

  ctx.save();

  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(centerX, centerY);

  let textAngle = angle;
  if (textAngle > Math.PI / 2 || textAngle < -Math.PI / 2) {
    textAngle += Math.PI;
  }
  ctx.rotate(textAngle);

  ctx.fillStyle = style.backgroundColor;
  drawRoundedRect(
    ctx,
    -LABEL_RECT_WIDTH / 2,
    -LABEL_RECT_HEIGHT / 2,
    LABEL_RECT_WIDTH,
    LABEL_RECT_HEIGHT,
    LABEL_BORDER_RADIUS
  );

  ctx.strokeStyle = style.borderColor;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();

  ctx.fillStyle = style.textColor;
  ctx.fillText(style.label, 0, 0);

  ctx.restore();
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
};

const drawEdgeArrow = (
  ctx: CanvasRenderingContext2D,
  edge: CustomEdge,
  to: CustomNode,
  angle: number,
  canvasImages: CanvasImage,
  isActiveEdge: boolean = false
) => {
  if (!canvasImages) return;

  let arrowKey: keyof CanvasImage = "arrow";

  if (isActiveEdge) {
    const edgeStatus = edge.data?.status;
    const styleKey = edgeStatus ? String(edgeStatus) : "DEFAULT";
    const style = EDGE_STYLES[styleKey] || EDGE_STYLES.DEFAULT;
    arrowKey = style.arrowKey;
  }

  const arrowImage = canvasImages[arrowKey];
  if (!arrowImage) return;

  const toSize = to?.data?.nodeSize;
  const arrowOffset = getArrowOffset(toSize);
  const arrowX = to.x - arrowOffset * Math.cos(angle);
  const arrowY = to.y - arrowOffset * Math.sin(angle);

  ctx.save();

  ctx.translate(arrowX, arrowY);
  ctx.rotate(angle + Math.PI / 2);
  ctx.drawImage(
    arrowImage,
    -ARROW_SIZE / 2,
    -ARROW_SIZE / 2,
    ARROW_SIZE,
    ARROW_SIZE
  );

  ctx.restore();
};
