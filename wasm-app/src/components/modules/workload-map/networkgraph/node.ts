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

const BORDER_LINE_WIDTH = 1.5;
const ARC_RADIUS = 10;

export class NetworkNode {
  private ctx: CanvasRenderingContext2D;
  private node: CustomNode;
  private canvasImages: CanvasImage;
  private options: DrawingOptions;

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

  public draw(): void {
    this.setInitialOpacity();

    this.drawNode();
    this.drawNodeKind();

    if (this.isBeforeInitialSetup()) {
      this.drawNodePolicySettingBadge();
    } else {
      this.drawNodeStatsBadge();
    }

    this.setLabelOpacity();
    this.drawNodeLabel();

    // Reset opacity
    this.ctx.globalAlpha = GLOBAL_ALPHA;
  }

  private setInitialOpacity(): void {
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    } else if (this.isExternalNamespace()) {
      this.ctx.globalAlpha = EXTERNAL_GLOBAL_ALPHA;
    }
  }

  private setLabelOpacity(): void {
    if (!this.isDisabled() && this.isExternalNamespace()) {
      this.ctx.globalAlpha = EXTERNAL_GLOBAL_ALPHA;
    }
    if (!this.isDisabled()) {
      this.ctx.globalAlpha = GLOBAL_ALPHA;
    }
  }

  private isBeforeInitialSetup(): boolean {
    return (
      this.node.data?.connected_workload_status ===
      WorkloadStatus.BEFORE_INITIAL_SETUP
    );
  }

  private drawNode(): void {
    const nodeSize = this.getNodeSize();

    const {
      isHover,
      isActive,
      isActiveLastConnection,
      isPortClosed,
      isNodeError,
    } = this.getNodeStates();

    this.ctx.lineWidth = BORDER_LINE_WIDTH;
    this.ctx.globalAlpha = GLOBAL_ALPHA;

    // Draw interaction circles if needed
    if (isHover || isActive || isActiveLastConnection) {
      this.drawInteractionCircles(
        isHover,
        isActive,
        isActiveLastConnection,
        isPortClosed
      );
    }

    // Set the appropriate fill and stroke styles
    this.setNodeStyles(
      isHover,
      isActive,
      isActiveLastConnection,
      isPortClosed,
      isNodeError
    );

    // Draw the main node circle

    // Add gradient if not active or hover
    if (!isActive && !isHover) {
      this.addNodeGradient(nodeSize);
    } else {
      this.addNodeActive(nodeSize);
      // this.ctx.stroke();
    }

    this.drawNodeCircle(nodeSize);
  }

  private getNodeStates() {
    const isHover =
      !!this.options?.hoverNodeId && this.options.hoverNodeId === this.node.id;

    const isActive =
      !!this.options.activeNodeId && this.options.activeNodeId === this.node.id;

    const isActiveLastConnection =
      !!this.options.portHover &&
      this.options.portHover.lastConnectionWorkloadUUID === this.node.id;

    const isPortClosed =
      !!this.options.portHover && !this.options.portHover.isOpen;

    const isNodeError = this.checkForNodeError();

    return {
      isHover,
      isActive,
      isActiveLastConnection,
      isPortClosed,
      isNodeError,
    };
  }

  private checkForNodeError(): boolean {
    const currentNodeId = this.options.hoverNodeId || this.options.activeNodeId;
    if (!currentNodeId || !this.options.network?.body.nodes) {
      return false;
    }

    const activeNode = this.options.network.body.nodes[currentNodeId];
    const activeEdges = activeNode?.edges;

    if (!activeEdges) {
      return false;
    }

    for (const edge of activeEdges) {
      if (
        edge.to.id === activeNode.id &&
        edge.data?.status === WorkloadPortStatus.ATTEMPT &&
        edge.from.id === this.node.id
      ) {
        return true;
      }
    }

    return false;
  }

  private drawInteractionCircles(
    isHover: boolean,
    isActive: boolean,
    isActiveLastConnection: boolean,
    isPortClosed: boolean
  ): void {
    const nodeSize = this.getNodeSize();

    if (isHover || isActiveLastConnection) {
      // Draw outer interaction circle
      this.ctx.fillStyle =
        isActiveLastConnection && isPortClosed
          ? color.fill.errorInteraction100
          : color.fill.activeInteraction100;

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

      // Draw inner interaction circle
      this.ctx.fillStyle =
        isActiveLastConnection && isPortClosed
          ? color.fill.errorInteraction200
          : color.fill.activeInteraction200;

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
  }

  private setNodeStyles(
    isHover: boolean,
    isActive: boolean,
    isActiveLastConnection: boolean,
    isPortClosed: boolean,
    isNodeError: boolean
  ): void {
    if (isNodeError || (isActiveLastConnection && isPortClosed)) {
      this.ctx.strokeStyle = color.stroke.error;
      this.ctx.fillStyle = color.fill.error;
    } else if (isHover || isActive || isActiveLastConnection) {
      this.ctx.strokeStyle = color.stroke.active;
      this.ctx.fillStyle = color.fill.active;
    } else {
      this.ctx.fillStyle = color.fill.default;
      this.ctx.strokeStyle = color.stroke.default;
    }
  }

  private drawNodeCircle(nodeSize: number): void {
    this.ctx.beginPath();
    this.ctx.arc(
      this.node.x,
      this.node.y,
      nodeSize / 2 - 0.75,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  private addNodeGradient(nodeSize: number): void {
    const gradient = this.ctx.createLinearGradient(
      this.node.x - nodeSize / 2,
      this.node.y - nodeSize / 2,
      this.node.x + nodeSize / 2,
      this.node.y + nodeSize / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    this.ctx.strokeStyle = color.background;
    this.ctx.beginPath();
    this.ctx.arc(this.node.x, this.node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.strokeStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.node.x, this.node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private addNodeActive(nodeSize: number): void {
    this.ctx.strokeStyle = color.active;
    this.ctx.beginPath();
    this.ctx.arc(this.node.x, this.node.y, nodeSize / 2, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawNodePolicySettingBadge(): void {
    const nodeSize = this.getNodeSize();
    let x = this.node.x + 14;
    let y = this.node.y - nodeSize / 2 - 1;

    if (nodeSize === NodeSize.SMALL) {
      x -= 8;
      y -= 15;
    } else {
      x += 2;
      y -= 10;
    }

    // Draw white background circle
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = color.background;
    this.ctx.beginPath();
    this.ctx.arc(
      x + EXCLAMATION_SIZE / 2,
      y + EXCLAMATION_SIZE,
      EXCLAMATION_SIZE / 2,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Adjust opacity for disabled state
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }

    // Draw exclamation image
    this.ctx.beginPath();
    this.ctx.drawImage(
      this.canvasImages.exclamation,
      x,
      y + EXCLAMATION_SIZE / 2,
      EXCLAMATION_SIZE,
      EXCLAMATION_SIZE
    );
    this.ctx.closePath();
  }

  private drawNodeKind(): void {
    const nodeSize = this.getNodeSize();
    let deploymentIconSize = this.getDeploymentIconSize(nodeSize);

    if (!this.node.data?.kind) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.drawImage(
      this.canvasImages.kind[this.node.data.kind],
      this.node.x - deploymentIconSize / 2,
      this.node.y - deploymentIconSize / 2,
      deploymentIconSize,
      deploymentIconSize
    );
    this.ctx.closePath();
  }

  private getDeploymentIconSize(nodeSize: number): number {
    if (nodeSize === NodeSize.BIG) {
      return NodeKindSize.BIG;
    } else if (nodeSize === NodeSize.SMALL) {
      return NodeKindSize.SMALL;
    }
    return NodeKindSize.MEDIUM;
  }

  private drawNodeLabel(): void {
    const nodeSize = this.getNodeSize();
    const label = this.node?.data?.customLabel as string;
    const namespaceLabel = this.node.data?.externalNamespace as string;

    this.ctx.font = "normal 12px Arial";
    this.ctx.fillStyle = color.white;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "alphabetic";

    const textMetrics = this.ctx.measureText(label);
    const textWidth = textMetrics.width;
    const protectedAddImageWidth = this.canvasImages.protected.width;
    const imageToTextSpacing = 2;

    // Calculate label position
    let labelX = this.node.x - textWidth / 2 - imageToTextSpacing;
    if (
      this.node.data?.connected_workload_status ===
      WorkloadStatus.COMPLETE_INITIAL_SETUP
    ) {
      labelX += protectedAddImageWidth / 2;
    }

    // Draw label text
    this.ctx.beginPath();
    this.ctx.fillText(
      label,
      labelX,
      this.node.y + nodeSize / 2 + 15,
      textWidth
    );

    // Draw protected badge if needed
    if (this.node.data?.policy_setting_badge) {
      this.ctx.drawImage(
        this.canvasImages.protected,
        labelX - 13,
        this.node.y + nodeSize / 2 + 6 - 1
      );
    }

    // Draw namespace label if needed
    if (this.node.data?.externalNamespace) {
      if (!this.isDisabled()) {
        this.ctx.globalAlpha = 0.78;
      }

      const namespaceMetrics = this.ctx.measureText(namespaceLabel);
      this.ctx.fillText(
        namespaceLabel,
        this.node.x - namespaceMetrics.width / 2,
        this.node.y + nodeSize / 2 + 30,
        namespaceMetrics.width
      );
    }

    this.ctx.closePath();
  }

  private drawNodeStatsBadge(): void {
    const stats = this.getStats();
    const filterPorts = this.options.filterPorts;
    const ports = this.getFilteredPorts(stats, filterPorts);

    if (!ports.length) {
      return;
    }

    const nodeSize = this.getNodeSize();

    for (let i = 0; i < ports.length; i++) {
      // Calculate badge position
      let x = this.node.x + ARC_RADIUS + 14;
      let y = this.node.y - nodeSize / 2 + 10 - 1;

      if (ports.length !== 1) {
        x = this.node.x + (ARC_RADIUS * 2 - 5) * i + 14;
      }

      if (nodeSize === NodeSize.SMALL) {
        x -= 4;
        y -= 5;
      }

      // Draw background
      this.drawStatBadgeBackground(x, y, ports[i].total);

      // Draw badge circle with appropriate colors
      this.drawStatBadgeCircle(x, y, ports[i].status, ports[i].total);

      // Draw port count text
      this.drawStatBadgeText(x, y, ports[i].status, ports[i].total);
    }
  }

  private getFilteredPorts(
    stats: { idle: number; attempted: number; error: number },
    filterPorts: any
  ) {
    const ports = [];

    if (filterPorts?.idle && stats.idle > 0) {
      ports.push({
        status: WorkloadPortStatus.IDLE,
        total: stats.idle,
      });
    }

    if (filterPorts?.error || filterPorts?.attempted) {
      let total = 0;
      if (filterPorts?.error && filterPorts?.attempted) {
        total = stats.attempted + stats.error;
      } else if (filterPorts.error) {
        total = stats.error;
      } else {
        total = stats.attempted;
      }

      if (total > 0) {
        ports.push({
          status: WorkloadPortStatus.ERROR,
          total,
        });
      }
    }

    return ports;
  }

  private drawStatBadgeBackground(x: number, y: number, total: number): void {
    this.ctx.globalAlpha = GLOBAL_ALPHA;
    this.ctx.fillStyle = color.background;
    this.ctx.beginPath();

    if (total <= 99) {
      this.ctx.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI, false);
      this.ctx.closePath();
    } else {
      this.ctx.roundRect(x - 13, y - 10, 26, 20, 10);
    }

    this.ctx.fill();
  }

  private drawStatBadgeCircle(
    x: number,
    y: number,
    status: WorkloadPortStatus,
    total: number
  ): void {
    if (this.isDisabled()) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }

    const badgeColor =
      status === WorkloadPortStatus.ERROR ? color.error : color.idle;

    // Create gradient
    const gradient = this.ctx.createLinearGradient(
      x - ARC_RADIUS,
      y - ARC_RADIUS,
      x + ARC_RADIUS,
      y + ARC_RADIUS
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

    // Draw badge circle
    this.ctx.fillStyle = badgeColor;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.beginPath();

    if (total <= 99) {
      this.ctx.arc(x, y, ARC_RADIUS, 0, Math.PI * 2);
      this.ctx.lineWidth = 1;
    } else {
      this.ctx.roundRect(x - 13, y - 10, 26, 20, 10);
    }

    this.ctx.fill();

    // Apply gradient
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawStatBadgeText(
    x: number,
    y: number,
    status: WorkloadPortStatus,
    total: number
  ): void {
    this.ctx.font = "10px Arial";
    const portStr = total <= 99 ? total.toString() : "99+";

    this.ctx.fillStyle =
      status === WorkloadPortStatus.ERROR ? color.white : color.black;

    this.ctx.fillText(portStr, x, y);
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

  private isDisabled(): boolean {
    const nodeId = this.options.hoverNodeId || this.options.activeNodeId;
    return (
      !!nodeId &&
      !this.options?.connectedNodes?.includes(this.node.id) &&
      nodeId !== this.node.id
    );
  }

  private isExternalNamespace(): boolean {
    return !!this.node.data?.isExternalNamespace;
  }

  private getNodeSize(): number {
    return this.node?.data?.nodeSize || 0;
  }
}
