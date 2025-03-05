import {
  color,
  DISABLED_GLOBAL_ALPHA,
  EXCLAMATION_SIZE,
  GLOBAL_ALPHA,
} from "./constants";
import {
  CanvasImage,
  CustomNode,
  DeploymentIconSize,
  DrawingOptions,
  EdgeStatus,
  EdgeStatusText,
  NodeSize,
} from "./types";

export class NetworkNode {
  ctx: CanvasRenderingContext2D;
  node: CustomNode;
  canvasImages: CanvasImage;
  options: DrawingOptions;
  constructor(
    ctx: CanvasRenderingContext2D,
    node: CustomNode,
    canvasImages: CanvasImage,
    options: DrawingOptions
  ) {
    this.ctx = ctx;
    this.node = node;
    this.canvasImages = canvasImages;
    this.options = options;
  }

  public draw() {
    if (this.options?.disabled) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }
    this.drawNodeBackground();
    const errorPorts = this.getErrorPorts();
    if (errorPorts.length === 0) {
      this.drawExclamationIcon();
    } else {
      this.drawNodePort();
    }
    this.drawDeploymentIcon();
    this.drawNodeLabel();

    if (this.options?.disabled) {
      this.ctx.globalAlpha = GLOBAL_ALPHA;
    }
  }

  private drawNodeBackground() {
    const isHovered = !!this.options?.hoverNodeId;
    this.ctx.lineWidth = 2;
    const nodeSize = this.node?.data?.nodeSize || 0;

    if (isHovered && this.options?.hoverNodeId === this.node.id) {
      this.ctx.fillStyle = color.fill.interaction100;
      this.ctx.beginPath();
      this.ctx.arc(
        this.node.x,
        this.node.y,
        nodeSize / 2 + 20,
        0,
        2 * Math.PI,
        false
      );
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = color.fill.interaction200;
      this.ctx.beginPath();
      this.ctx.arc(
        this.node.x,
        this.node.y,
        nodeSize / 2 + 10,
        0,
        2 * Math.PI,
        false
      );
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = color.stroke.active;
      this.ctx.fillStyle = color.fill.active;
    } else {
      this.ctx.fillStyle = color.fill.default;
      this.ctx.strokeStyle = color.stroke.default;
    }

    this.ctx.beginPath();
    this.ctx.arc(this.node.x, this.node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawExclamationIcon() {
    if (!this.canvasImages) return;

    this.ctx.beginPath();
    this.ctx.drawImage(
      this.canvasImages.exclamation,
      this.node.x + 14,
      this.node.y - (this.node?.data?.nodeSize || 0) / 2 - 1,
      EXCLAMATION_SIZE,
      EXCLAMATION_SIZE
    );
    this.ctx.closePath();
  }

  private drawDeploymentIcon() {
    if (!this.canvasImages) return;
    const nodeSize = this.node?.data?.nodeSize;
    let deploymentIconSize = DeploymentIconSize.MEDIUM;
    if (nodeSize === NodeSize.BIG) {
      deploymentIconSize = DeploymentIconSize.BIG;
    } else if (nodeSize === NodeSize.SMALL) {
      deploymentIconSize = DeploymentIconSize.SMALL;
    }
    this.ctx.beginPath();
    this.ctx.drawImage(
      this.canvasImages.deployment,
      this.node.x - deploymentIconSize / 2,
      this.node.y - deploymentIconSize / 2,
      deploymentIconSize,
      deploymentIconSize
    );
    this.ctx.closePath();
  }

  private drawNodeLabel() {
    const nodeSize = this.node?.data?.nodeSize || 0;
    this.ctx.font = "normal 12px Arial";
    this.ctx.fillStyle = color.white;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "alphabetic";
    const label = this.node?.data?.customLabel;

    const textMetrics = this.ctx.measureText(label as string);
    const textWidth = textMetrics.width;
    const protectedAddImageWidth = this.canvasImages.protected.width;
    const imageToTextSpacing = 2;

    this.ctx.beginPath();
    this.ctx.fillText(
      label as string,
      this.node.x -
        textWidth / 2 +
        protectedAddImageWidth / 2 -
        imageToTextSpacing,
      this.node.y + nodeSize / 2 + 15,
      100
    );

    this.ctx.drawImage(
      this.canvasImages.protected,
      this.node.x - textWidth / 2 - protectedAddImageWidth,
      this.node.y + nodeSize / 2 + 6
    );
    this.ctx.closePath();
  }

  private drawNodePort() {
    const ports = this.getErrorPorts();
    const ARC_RADIUS = 10;
    for (let i = 0; i < ports.length; i++) {
      let x = this.node.x + ARC_RADIUS + 14;
      if (ports.length !== 1) {
        x = this.node.x + (ARC_RADIUS * 2 - 5) * i + 14;
      }
      const y = this.node.y - (this.node?.data?.nodeSize || 0) / 2 + 10 - 1;
      this.ctx.fillStyle =
        ports[i].status === EdgeStatus.ERROR ? color.error : color.idle;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.beginPath();
      this.ctx.arc(x, y, ARC_RADIUS, 0, Math.PI * 2);
      this.ctx.lineWidth = 1;
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.font = "bold 10px Arial";
      const portStr = ports[i].total <= 99 ? ports[i].total.toString() : "99+";
      this.ctx.fillStyle =
        ports[i].status === EdgeStatus.ERROR ? color.white : color.black;
      this.ctx.fillText(portStr, x, y);
    }
  }

  private getErrorPorts() {
    const ports: { status: EdgeStatus; total: number }[] = [
      {
        status: EdgeStatus.ERROR,
        total:
          (this.node.data?.stats?.error || 0) +
          (this.node.data?.stats?.attempted || 0),
      },
      {
        status: EdgeStatus.IDLE,
        total: this.node.data?.stats?.idle || 0,
      },
    ].filter((port) => port.total > 0);

    return ports;
  }
}
