import { color } from "./color";
import {
  CanvasImage,
  CustomNode,
  DeploymentIconSize,
  DrawingOptions,
  EdgeStatus,
  NodeSize,
} from "./types";

const EXCLAMATION_SIZE = 20;
const GLOBAL_ALPHA = 1.0;
const DISABLED_GLOBAL_ALPHA = 0.2;
export const drawNetworkNode = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage,
  options?: DrawingOptions
) => {
  if (!canvasImages || !node.x || !node.y) {
    return;
  }

  if (options?.disabled) {
    ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
  }

  drawNodeBackground(ctx, node, options);
  drawExclamationIcon(ctx, node, canvasImages);
  drawDeploymentIcon(ctx, node, canvasImages);
  drawNodeLabel(ctx, node, canvasImages);
  drawNodeNumberOfPortBadge(ctx, node, [
    {
      status: EdgeStatus.ERROR,
      numberOfPorts: 10,
    },
    {
      status: EdgeStatus.IDLE,
      numberOfPorts: 20,
    },
  ]);

  if (options?.disabled) {
    ctx.globalAlpha = GLOBAL_ALPHA;
  }
};

export const drawNodeBackground = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  options?: DrawingOptions
) => {
  const isHovered = !!options?.hoverNodeId;
  ctx.lineWidth = 2;
  const nodeSize = node?.data?.nodeSize || 0;

  if (isHovered && options?.hoverNodeId === node.id) {
    ctx.fillStyle = color.fill.interaction100;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize / 2 + 20, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = color.fill.interaction200;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize / 2 + 10, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = color.stroke.active;
    ctx.fillStyle = color.fill.active;
  } else {
    ctx.fillStyle = color.fill.default;
    ctx.strokeStyle = color.stroke.default;
  }

  ctx.beginPath();
  ctx.arc(node.x, node.y, nodeSize / 2, 0, 2 * Math.PI, false);
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
    node.x + 14,
    node.y - (node?.data?.nodeSize || 0) / 2 - 1,
    EXCLAMATION_SIZE,
    EXCLAMATION_SIZE
  );
  ctx.closePath();
};

export const drawDeploymentIcon = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  canvasImages: CanvasImage
) => {
  if (!canvasImages) return;
  const nodeSize = node?.data?.nodeSize;
  let deploymentIconSize = DeploymentIconSize.MEDIUM;
  if (nodeSize === NodeSize.BIG) {
    deploymentIconSize = DeploymentIconSize.BIG;
  } else if (nodeSize === NodeSize.SMALL) {
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
  canvasImages: CanvasImage
) => {
  if (!canvasImages) return;

  const nodeSize = node?.data?.nodeSize || 0;

  ctx.font = "12px";
  ctx.fillStyle = color.white;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const label = node?.data?.customLabel;

  const textMetrics = ctx.measureText(label as string);
  const textWidth = textMetrics.width;
  const protectedAddImageWidth = canvasImages.protected.width;
  const imageToTextSpacing = 2;

  ctx.beginPath();
  ctx.fillText(
    label as string,
    node.x - textWidth / 2 + protectedAddImageWidth / 2 - imageToTextSpacing,
    node.y + nodeSize / 2 + 15,
    100
  );

  ctx.drawImage(
    canvasImages.protected,
    node.x - textWidth / 2 - protectedAddImageWidth,
    node.y + nodeSize / 2 + 6
  );
  ctx.closePath();
};

export const drawNodeNumberOfPortBadge = (
  ctx: CanvasRenderingContext2D,
  node: CustomNode,
  ports: { status: EdgeStatus; numberOfPorts: number }[]
) => {
  const ARC_RADIUS = 10;
  for (let i = 0; i < ports.length; i++) {
    let x = node.x + ARC_RADIUS + 14;
    if (ports.length !== 1) {
      x = node.x + ((ARC_RADIUS * 2) - 5) * i + 14;
    }
    const y = node.y - (node?.data?.nodeSize || 0) / 2 + 10 - 1;
    ctx.fillStyle =
      ports[i].status === EdgeStatus.ERROR ? color.error : color.idle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.arc(x, y, ARC_RADIUS, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    console.log(ctx.strokeStyle);
    ctx.fill();
    ctx.closePath();
    ctx.font = "bold 10px Arial";
    ctx.fillStyle =
      ports[i].status === EdgeStatus.ERROR ? color.white : color.black;
    ctx.fillText(ports[i].numberOfPorts.toString(), x, y);
  }
};
