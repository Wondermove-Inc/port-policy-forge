import {
  ARROW_SIZE,
  color,
  DISABLED_GLOBAL_ALPHA,
  EDGE_STYLES,
  FONT,
  GLOBAL_ALPHA,
  LINE_WIDTH,
} from "./constants";
import { CanvasImage, CustomEdge, DrawingOptions, NodeSize } from "./types";
import { WorkloadPortStatus } from "@/models";

export class NetworkEdge {
  private ctx: CanvasRenderingContext2D;
  private edge: CustomEdge;
  private canvasImages: CanvasImage;
  private options: DrawingOptions;
  private coords: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    angle: number;
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    edge: CustomEdge,
    canvasImages: CanvasImage,
    options: DrawingOptions
  ) {
    this.ctx = ctx;
    this.edge = edge;
    this.canvasImages = canvasImages;
    this.options = options;
    this.coords = this.calculateCoordinates();
  }

  private calculateCoordinates() {
    const { from, to } = this.edge;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const fromSize = from?.data?.nodeSize;
    const toSize = to?.data?.nodeSize;
    const fromOffset = this.getLineOffset(fromSize);
    const toOffset = this.getLineOffset(toSize);

    return {
      fromX: from.x + fromOffset * Math.cos(angle),
      fromY: from.y + fromOffset * Math.sin(angle),
      toX: to.x - toOffset * Math.cos(angle),
      toY: to.y - toOffset * Math.sin(angle),
      angle,
    };
  }

  public draw() {
    const isActiveEdge = this.options?.connectedEdges?.includes(this.edge.id);
    const disabled =
      (!!this.options.hoverNodeId || !!this.options.activeNodeId) &&
      !isActiveEdge;

    this.ctx.save();
    this.drawEdgeLine(isActiveEdge, disabled);
    this.drawEdgeArrow(isActiveEdge, disabled);
    this.drawEdgeLabel(isActiveEdge, disabled);
    this.ctx.restore();
  }

  public drawEdgeLabel(
    isActiveEdge: boolean = false,
    disabled: boolean = false
  ) {
    if (
      this.isEdgeConnected() &&
      this.options.activeNodeId &&
      !disabled &&
      !this.options.removingEdgeId
    ) {
      this.drawEdgeLinkLabel();
    } else if (isActiveEdge && !this.options.activeNodeId) {
      this.drawEdgeStatusLabel();
    }
  }

  private isEdgeConnected(): boolean {
    return this.options.activeEdgeId === this.edge.id;
  }

  private drawEdgeLine(
    isActiveEdge: boolean = false,
    disabled: boolean = false
  ) {
    const { fromX, fromY, toX, toY } = this.coords;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineJoin = "round";

    if (disabled) {
      ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }

    this.setEdgeLineStyle(isActiveEdge, disabled);

    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.closePath();

    // Reset styles
    ctx.setLineDash([0, 0]);
    ctx.globalAlpha = GLOBAL_ALPHA;
  }

  private setEdgeLineStyle(isActiveEdge: boolean, disabled: boolean) {
    const { removingEdgeId } = this.options;
    const { status } = this.edge.data || {};

    if (removingEdgeId === this.edge.id) {
      this.ctx.strokeStyle = color.stroke.default;
      this.ctx.setLineDash([2, 2]);
      return;
    }

    // Set line dash based on status
    this.ctx.setLineDash(
      status === WorkloadPortStatus.ATTEMPT ? [2, 2] : [0, 0]
    );

    // Set color based on active state and status
    if ((isActiveEdge || this.isEdgeConnected()) && !disabled) {
      const styleKey = status
        ? String(status)
        : String(WorkloadPortStatus.ACTIVE);
      const style = EDGE_STYLES[styleKey] || EDGE_STYLES.ACTIVE;
      this.ctx.strokeStyle = style.strokeStyle;
    } else {
      this.ctx.strokeStyle = color.stroke.default;
    }
  }

  private drawEdgeLinkLabel() {
    const centerX = (this.coords.fromX + this.coords.toX) / 2;
    const centerY = (this.coords.fromY + this.coords.toY) / 2;
    const SIZE = 14;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    // Draw circle background
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 12, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color.active;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color.active;
    this.ctx.stroke();

    // Draw connection icon
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.drawImage(
      this.canvasImages.lineConnected,
      -SIZE / 2,
      -SIZE / 2,
      SIZE,
      SIZE
    );

    this.ctx.restore();
  }

  private drawEdgeStatusLabel() {
    const edgeStatus = this.edge.data?.status;
    if (!edgeStatus) return;

    const styleKey = String(edgeStatus);
    const style = EDGE_STYLES[styleKey];

    if (
      !style?.label ||
      !style.backgroundColor ||
      !style.borderColor ||
      !style.textColor
    ) {
      return;
    }

    const centerX = (this.coords.fromX + this.coords.toX) / 2;
    const centerY = (this.coords.fromY + this.coords.toY) / 2;
    const textAngle = this.getAdjustedTextAngle(this.coords.angle);

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(textAngle);

    // Draw label background
    this.ctx.fillStyle = style.backgroundColor;
    let LABEL_RECT_WIDTH = 48;
    const LABEL_RECT_HEIGHT = 24;
    const LABEL_BORDER_RADIUS = 8;
    if (edgeStatus === WorkloadPortStatus.ATTEMPT) {
      LABEL_RECT_WIDTH = 60;
    }
    this.drawRoundedRect(
      -LABEL_RECT_WIDTH / 2,
      -LABEL_RECT_HEIGHT / 2,
      LABEL_RECT_WIDTH,
      LABEL_RECT_HEIGHT,
      LABEL_BORDER_RADIUS
    );

    // Draw label border
    this.ctx.strokeStyle = style.borderColor;
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.stroke();

    // Draw label text
    this.ctx.font = FONT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = style.textColor;
    this.ctx.fillText(style.label, 0, 0);

    this.ctx.restore();
  }

  private getAdjustedTextAngle(angle: number): number {
    // Adjust text angle to ensure readability
    return angle > Math.PI / 2 || angle < -Math.PI / 2
      ? angle + Math.PI
      : angle;
  }

  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    const ctx = this.ctx;

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
  }

  private drawEdgeArrow(
    isActiveEdge: boolean = false,
    disabled: boolean = false
  ) {
    let arrowKey = this.getArrowKey(isActiveEdge, disabled);
    const arrowImage = this.canvasImages[arrowKey];
    if (!arrowImage) return;

    const toSize = this.edge.to?.data?.nodeSize;
    const arrowOffset = this.getArrowOffset(toSize);
    const arrowX = this.edge.to.x - arrowOffset * Math.cos(this.coords.angle);
    const arrowY = this.edge.to.y - arrowOffset * Math.sin(this.coords.angle);

    this.ctx.save();

    if (disabled) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }

    this.ctx.translate(arrowX, arrowY);
    this.ctx.rotate(this.coords.angle + Math.PI / 2);
    this.ctx.drawImage(
      arrowImage as HTMLImageElement,
      -ARROW_SIZE / 2,
      -ARROW_SIZE / 2,
      ARROW_SIZE,
      ARROW_SIZE
    );

    this.ctx.restore();
    this.ctx.globalAlpha = GLOBAL_ALPHA;
  }

  private getArrowKey(
    isActiveEdge: boolean,
    disabled: boolean
  ): keyof CanvasImage {
    if (this.options.removingEdgeId) {
      return EDGE_STYLES.DEFAULT.arrowKey;
    }

    if (disabled) {
      return "defaultArrow";
    }

    if (isActiveEdge || this.isEdgeConnected()) {
      const edgeStatus = this.edge.data?.status;
      const styleKey = edgeStatus
        ? String(edgeStatus)
        : WorkloadPortStatus.ACTIVE;
      const style = EDGE_STYLES[styleKey] || EDGE_STYLES.DEFAULT;
      return style.arrowKey;
    }

    return "defaultArrow";
  }

  private getLineOffset(nodeSize: NodeSize | undefined): number {
    if (nodeSize === undefined) return 31;

    switch (nodeSize) {
      case NodeSize.BIG:
        return 37.5;
      case NodeSize.SMALL:
        return 21;
      default:
        return 30.5;
    }
  }

  private getArrowOffset(nodeSize: NodeSize | undefined): number {
    if (nodeSize === undefined) return 33.5;

    switch (nodeSize) {
      case NodeSize.BIG:
        return 41;
      case NodeSize.SMALL:
        return 24;
      default:
        return 34;
    }
  }
}
