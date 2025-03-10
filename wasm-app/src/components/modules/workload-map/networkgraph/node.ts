import {
  color,
  DISABLED_GLOBAL_ALPHA,
  EXCLAMATION_SIZE,
  GLOBAL_ALPHA,
} from "./constants";
import {
  CanvasImage,
  CustomNode,
  NodeKindSize,
  DrawingOptions,
  NodeSize,
} from "./types";

import { WorkloadPortStatus, WorkloadStatus } from "@/models";

export class NetworkNode {
  ctx: CanvasRenderingContext2D;
  node: CustomNode;
  canvasImages: CanvasImage;
  options: DrawingOptions;
  constructor(
    ctx: CanvasRenderingContext2D,
    node: CustomNode,
    canvasImages: CanvasImage,
    options: DrawingOptions,
  ) {
    this.ctx = ctx;
    this.node = node;
    this.canvasImages = canvasImages;
    this.options = options;
  }

  public draw() {
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }
    this.drawNodeBackground();
    if (this.node.data?.status === WorkloadStatus.BEFORE_INITIAL_SETUP) {
      this.drawExclamationIcon();
    } else {
      this.drawNodePort();
    }
    this.drawNodeKind();
    this.drawNodeLabel();

    if (this.isDisabled()) {
      this.ctx.globalAlpha = GLOBAL_ALPHA;
    }
  }

  private drawNodeBackground() {
    const activeNodeId = this.options?.hoverNodeId || this.options.activeNodeId;
    const isActive = !!activeNodeId;
    this.ctx.lineWidth = 2;
    const nodeSize = this.node?.data?.nodeSize || 0;

    if (isActive && activeNodeId === this.node.id) {
      if (!!this.options?.hoverNodeId) {
        this.ctx.fillStyle = color.fill.interaction100;
        this.ctx.beginPath();
        this.ctx.arc(
          this.node.x,
          this.node.y,
          nodeSize / 2 + 24,
          0,
          2 * Math.PI,
          false,
        );
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color.fill.interaction200;
        this.ctx.beginPath();
        this.ctx.arc(
          this.node.x,
          this.node.y,
          nodeSize / 2 + 12,
          0,
          2 * Math.PI,
          false,
        );
        this.ctx.closePath();
        this.ctx.fill();
      }

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
    this.ctx.beginPath();
    this.ctx.drawImage(
      this.canvasImages.exclamation,
      this.node.x + 14,
      this.node.y - (this.node?.data?.nodeSize || 0) / 2 - 1,
      EXCLAMATION_SIZE,
      EXCLAMATION_SIZE,
    );
    this.ctx.closePath();
  }

  private drawNodeKind() {
    const nodeSize = this.node?.data?.nodeSize;
    let deploymentIconSize = NodeKindSize.MEDIUM;
    if (nodeSize === NodeSize.BIG) {
      deploymentIconSize = NodeKindSize.BIG;
    } else if (nodeSize === NodeSize.SMALL) {
      deploymentIconSize = NodeKindSize.SMALL;
    }
    this.ctx.beginPath();
    if (this.node.data?.kind) {
      this.ctx.drawImage(
        this.canvasImages.kind[this.node.data?.kind],
        this.node.x - deploymentIconSize / 2,
        this.node.y - deploymentIconSize / 2,
        deploymentIconSize,
        deploymentIconSize,
      );
    }

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

    let labelX = this.node.x - textWidth / 2 - imageToTextSpacing;

    if (this.node.data?.status === WorkloadStatus.COMPLETE_INITIAL_SETUP) {
      labelX += protectedAddImageWidth / 2;
    }
    this.ctx.beginPath();
    this.ctx.fillText(
      label as string,
      labelX,
      this.node.y + nodeSize / 2 + 15,
      textWidth,
    );

    if (this.node.data?.status === WorkloadStatus.COMPLETE_INITIAL_SETUP) {
      this.ctx.drawImage(
        this.canvasImages.protected,
        this.node.x - textWidth / 2 - protectedAddImageWidth,
        this.node.y + nodeSize / 2 + 6,
      );
    }

    this.ctx.closePath();
  }

  private drawNodePort() {
    const filterPorts = this.options.filterPorts;
    const { idle, attempted, error } = this.getStats();
    let ports = [];
    if (filterPorts?.idle) {
      ports.push({
        status: WorkloadPortStatus.IDLE,
        total: idle,
      });
    }
    if (filterPorts?.error || filterPorts?.attempted) {
      let total = 0;
      if (filterPorts?.error && filterPorts?.attempted) {
        total = attempted + error;
      } else if (filterPorts.error) {
        total = error;
      } else {
        total = attempted;
      }
      ports.push({
        status: WorkloadPortStatus.ERROR,
        total: total,
      });
    }
    ports = ports.filter((p) => p.total);
    const ARC_RADIUS = 10;
    for (let i = 0; i < ports.length; i++) {
      let x = this.node.x + ARC_RADIUS + 14;
      if (ports.length !== 1) {
        x = this.node.x + (ARC_RADIUS * 2 - 5) * i + 14;
      }
      const y = this.node.y - (this.node?.data?.nodeSize || 0) / 2 + 10 - 1;
      this.ctx.fillStyle =
        ports[i].status === WorkloadPortStatus.ERROR ? color.error : color.idle;
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
        ports[i].status === WorkloadPortStatus.ERROR
          ? color.white
          : color.black;
      this.ctx.fillText(portStr, x, y);
    }
  }

  private getStats() {
    const inboundStats = this.node.data?.inbound?.stats;
    const outboundStats = this.node.data?.outbound?.stats;
    const active = (inboundStats?.active || 0) + (outboundStats?.active || 0);
    const attempted =
      (inboundStats?.attempted || 0) + (outboundStats?.attempted || 0);
    const error = (inboundStats?.error || 0) + (outboundStats?.error || 0);
    const idle = (inboundStats?.idle || 0) + (outboundStats?.idle || 0);
    const unconnected =
      (inboundStats?.unconnected || 0) + (outboundStats?.unconnected || 0);
    return {
      active: active,
      attempted: attempted,
      error: error,
      idle: idle,
      unconnected: unconnected,
    };
  }

  private isDisabled() {
    const nodeId = this.options.hoverNodeId || this.options.activeNodeId;
    return (
      nodeId &&
      !this.options?.connectedNodes?.includes(this.node.id) &&
      nodeId !== this.node.id
    );
  }
}
