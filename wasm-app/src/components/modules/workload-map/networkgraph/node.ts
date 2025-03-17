import {
  color,
  DISABLED_GLOBAL_ALPHA,
  EXCLAMATION_SIZE,
  EXTERNAL_GLOBAL_ALPHA,
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
    options: DrawingOptions
  ) {
    this.ctx = ctx;
    this.node = node;
    this.canvasImages = canvasImages;
    this.options = options;
  }

  public draw() {
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    } else {
      if (this.isExternalNamespace()) {
        this.ctx.globalAlpha = EXTERNAL_GLOBAL_ALPHA;
      }
    }

    this.drawNode();
    this.drawNodeKind();
    if (
      this.node.data?.connected_workload_status ===
      WorkloadStatus.BEFORE_INITIAL_SETUP
    ) {
      this.drawNodePolicySettingBadge();
    } else {
      this.drawNodeStatsBadge();
    }
    if (!this.isDisabled() && this.isExternalNamespace()) {
      this.ctx.globalAlpha = EXTERNAL_GLOBAL_ALPHA;
    }
    if (!this.isDisabled()) {
      this.ctx.globalAlpha = GLOBAL_ALPHA;
    }
    this.drawNodeLabel();
    this.ctx.globalAlpha = GLOBAL_ALPHA;
  }

  private drawNode() {
    const isHover =
      !!this.options?.hoverNodeId && this.options.hoverNodeId === this.node.id;
    const isActive =
      !!this.options.activeNodeId && this.options.activeNodeId === this.node.id;
    const isActiveLastConnection =
      !!this.options.portHover &&
      this.options.portHover.lastConnectionWorkloadUUID === this.node.id;
    const isPortClosed =
      !!this.options.portHover && !this.options.portHover.isOpen;
    this.ctx.lineWidth = 1.85;
    const nodeSize = this.node?.data?.nodeSize || 0;
    this.ctx.strokeStyle = color.stroke.default;
    const nodes = this.options.network?.body.nodes;
    let isNodeError = false;
    const currentNodeId = this.options.hoverNodeId || this.options.activeNodeId;
    if (currentNodeId && nodes) {
      const activeNode = nodes[currentNodeId];
      const activeEdges = activeNode?.edges;
      if (activeEdges) {
        for (const edge of activeEdges) {
          if (
            edge.to.id === activeNode.id &&
            edge.data?.status === WorkloadPortStatus.ATTEMPT
          ) {
            if (edge.from.id === this.node.id) {
              isNodeError = true;
            }
          }
        }
      }
    }
    if (isHover || isActive || isActiveLastConnection) {
      if (isHover || isActiveLastConnection) {
        if (isActiveLastConnection && isPortClosed) {
          this.ctx.fillStyle = color.fill.errorInteraction100;
        } else {
          this.ctx.fillStyle = color.fill.activeInteraction100;
        }
        this.ctx.beginPath();

        this.ctx.arc(
          this.node.x,
          this.node.y,
          nodeSize / 2 + 24,
          0,
          2 * Math.PI,
          false
        );
        this.ctx.closePath();
        this.ctx.fill();
        if (isActiveLastConnection && isPortClosed) {
          this.ctx.fillStyle = color.fill.errorInteraction200;
        } else {
          this.ctx.fillStyle = color.fill.activeInteraction200;
        }
        this.ctx.beginPath();
        this.ctx.arc(
          this.node.x,
          this.node.y,
          nodeSize / 2 + 12,
          0,
          2 * Math.PI,
          false
        );
        this.ctx.closePath();
        this.ctx.fill();
      }
      if ((isActiveLastConnection && isPortClosed) || isNodeError) {
        this.ctx.strokeStyle = color.stroke.error;
        this.ctx.fillStyle = color.fill.error;
      } else {
        this.ctx.strokeStyle = color.stroke.active;
        this.ctx.fillStyle = color.fill.active;
      }
    } else {
      this.ctx.fillStyle = color.fill.default;
      this.ctx.strokeStyle = color.stroke.default;
    }

    if (isNodeError) {
      this.ctx.strokeStyle = color.stroke.error;
      this.ctx.fillStyle = color.fill.error;
    }

    this.ctx.beginPath();
    this.ctx.arc(this.node.x, this.node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    const gradient = this.ctx.createLinearGradient(
      this.node.x - nodeSize / 2,
      this.node.y - nodeSize / 2,
      this.node.x + nodeSize / 2,
      this.node.y + nodeSize / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    this.ctx.strokeStyle = gradient;
    this.ctx.stroke();
  }

  private drawNodePolicySettingBadge() {
    let x = this.node.x + 14;
    if (this.node.data?.nodeSize === NodeSize.SMALL) {
      x -= 8;
    }

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#191f2b";
    this.ctx.beginPath();
    this.ctx.arc(
      x + EXCLAMATION_SIZE / 2,
      this.node.y -
        (this.node?.data?.nodeSize || 0) / 2 -
        1 +
        EXCLAMATION_SIZE / 2,
      EXCLAMATION_SIZE / 2,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.closePath();
    this.ctx.fill();
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }
    this.ctx.beginPath();

    this.ctx.drawImage(
      this.canvasImages.exclamation,
      x,
      this.node.y - (this.node?.data?.nodeSize || 0) / 2 - 1,
      EXCLAMATION_SIZE,
      EXCLAMATION_SIZE
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
        deploymentIconSize
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
    const label = this.node?.data?.customLabel as string;
    const namespaceLabel = this.node.data?.externalNamespace as string;

    const textMetrics = this.ctx.measureText(label);
    const namespaceMetrics = this.ctx.measureText(namespaceLabel);
    const textWidth = textMetrics.width;
    const protectedAddImageWidth = this.canvasImages.protected.width;
    const imageToTextSpacing = 2;

    let labelX = this.node.x - textWidth / 2 - imageToTextSpacing;
    if (
      this.node.data?.connected_workload_status ===
      WorkloadStatus.COMPLETE_INITIAL_SETUP
    ) {
      labelX += protectedAddImageWidth / 2;
    }
    this.ctx.beginPath();
    this.ctx.fillText(
      label as string,
      labelX,
      this.node.y + nodeSize / 2 + 15,
      textWidth
    );
    if (this.node.data?.policy_setting_badge) {
      this.ctx.drawImage(
        this.canvasImages.protected,
        labelX - 13,
        this.node.y + nodeSize / 2 + 6 - 1
      );
    }

    if (this.node.data?.externalNamespace) {
      if (!this.isDisabled()) {
        this.ctx.globalAlpha = 0.78;
      }
      this.ctx.fillText(
        namespaceLabel,
        this.node.x - namespaceMetrics.width / 2,
        this.node.y + nodeSize / 2 + 15 + 15,
        namespaceMetrics.width
      );
    }

    this.ctx.closePath();
  }

  private drawNodeStatsBadge() {
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
      if (this.node.data?.nodeSize === NodeSize.SMALL) {
        x -= 8;
      }
      const y = this.node.y - (this.node?.data?.nodeSize || 0) / 2 + 10 - 1;

      // draw background of nodeStats
      this.ctx.globalAlpha = GLOBAL_ALPHA;
      this.ctx.fillStyle = "#191f2b";
      this.ctx.beginPath();
      this.ctx.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI, false);
      this.ctx.closePath();
      this.ctx.fill();

      if (this.isDisabled()) {
        this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
      }
      const badgeColor =
        ports[i].status === WorkloadPortStatus.ERROR ? color.error : color.idle;
      const gradient = this.ctx.createLinearGradient(
        x - ARC_RADIUS,
        y - ARC_RADIUS,
        x + ARC_RADIUS,
        y + ARC_RADIUS
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
      this.ctx.fillStyle = badgeColor;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      this.ctx.beginPath();
      if (ports[i].total <= 99) {
        this.ctx.arc(x, y, ARC_RADIUS, 0, Math.PI * 2);
        this.ctx.lineWidth = 1;
      } else {
        this.ctx.roundRect(x - 13, y - 10, 26, 20, 10);
      }
      this.ctx.fill();

      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      this.ctx.closePath();
      this.ctx.font = "10px Arial";
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

  private isExternalNamespace() {
    return this.node.data?.isExternalNamespace;
  }
}
