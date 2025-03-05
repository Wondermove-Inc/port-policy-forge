import { IdType } from "vis-network";
import {
  ARROW_SIZE,
  color,
  DISABLED_GLOBAL_ALPHA,
  EDGE_STYLES,
  FONT,
  GLOBAL_ALPHA,
  LABEL_BORDER_RADIUS,
  LABEL_RECT_HEIGHT,
  LABEL_RECT_WIDTH,
  LINE_WIDTH,
} from "./constants";
import { CanvasImage, CustomEdge, NodeSize } from "./types";

export class NetworkEdge {
  ctx: CanvasRenderingContext2D;
  edge: CustomEdge;
  canvasImages: CanvasImage;
  options: {
    connectedEdges?: IdType[];
    hoverNodeId?: string;
  };
  coords: {
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
    options: {
      connectedEdges?: IdType[];
      hoverNodeId?: string;
    }
  ) {
    this.canvasImages = canvasImages;
    this.ctx = ctx;
    this.edge = edge;
    this.options = options;
    const { from, to } = this.edge;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const fromSize = from?.data?.nodeSize;
    const toSize = to?.data?.nodeSize;
    const fromOffset = this.getLineOffset(fromSize);
    const toOffset = this.getLineOffset(toSize);

    const newFromX = from.x + fromOffset * Math.cos(angle);
    const newFromY = from.y + fromOffset * Math.sin(angle);
    const newToX = to.x - toOffset * Math.cos(angle);
    const newToY = to.y - toOffset * Math.sin(angle);
    this.coords = {
      fromX: newFromX,
      fromY: newFromY,
      toX: newToX,
      toY: newToY,
      angle,
    };
  }

  public draw() {
    const isActiveEdge = this.options?.connectedEdges?.includes(this.edge.id);
    const disabled = !!this.options.hoverNodeId && !isActiveEdge;
    this.ctx.save();
    this.drawEdgeLine(isActiveEdge, disabled);
    this.drawEdgeArrow(isActiveEdge, disabled);
  }

  public drawLabel() {
    const isActiveEdge = this.options?.connectedEdges?.includes(this.edge.id);
    this.ctx.save();
    if (isActiveEdge) {
      this.drawEdgeLabel();
    }
  }

  private drawEdgeLine(isActiveEdge?: boolean, disabled?: boolean) {
    this.ctx.beginPath();
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.lineJoin = "round";
    if (disabled) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA;
    }
    if (isActiveEdge) {
      const edgeStatus = this.edge.data?.status;
      const styleKey = edgeStatus ? String(edgeStatus) : "DEFAULT";
      const style = EDGE_STYLES[styleKey] || EDGE_STYLES.DEFAULT;

      this.ctx.strokeStyle = style.strokeStyle;
      this.ctx.setLineDash(style.lineDash);
    } else {
      this.ctx.strokeStyle = color.stroke.default;
      this.ctx.setLineDash([0, 0]);
    }

    this.ctx.moveTo(this.coords.fromX, this.coords.fromY);
    this.ctx.lineTo(this.coords.toX, this.coords.toY);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.setLineDash([0, 0]);
    this.ctx.globalAlpha = GLOBAL_ALPHA;
  }

  private drawEdgeLabel() {
    const edgeStatus = this.edge.data?.status;
    if (!edgeStatus) return;

    const styleKey = String(edgeStatus);
    const style = EDGE_STYLES[styleKey];

    if (
      !style ||
      !style.label ||
      !style.backgroundColor ||
      !style.borderColor ||
      !style.textColor
    ) {
      return;
    }

    const centerX = (this.coords.fromX + this.coords.toX) / 2;
    const centerY = (this.coords.fromY + this.coords.toY) / 2;

    this.ctx.save();

    this.ctx.font = FONT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.translate(centerX, centerY);

    let textAngle = this.coords.angle;
    if (textAngle > Math.PI / 2 || textAngle < -Math.PI / 2) {
      textAngle += Math.PI;
    }
    this.ctx.rotate(textAngle);

    this.ctx.fillStyle = style.backgroundColor;
    this.drawRoundedRect(
      -LABEL_RECT_WIDTH / 2,
      -LABEL_RECT_HEIGHT / 2,
      LABEL_RECT_WIDTH,
      LABEL_RECT_HEIGHT,
      LABEL_BORDER_RADIUS
    );

    this.ctx.strokeStyle = style.borderColor;
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.stroke();

    this.ctx.fillStyle = style.textColor;
    this.ctx.fillText(style.label, 0, 0);

    this.ctx.restore();
  }

  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(
      x + width,
      y + height,
      x + width - radius,
      y + height,
      radius
    );
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawEdgeArrow(isActiveEdge?: boolean, disabled?: boolean) {
    let arrowKey: keyof CanvasImage = "arrow";
    if (disabled) {
      this.ctx.globalAlpha = DISABLED_GLOBAL_ALPHA
    }
    if (isActiveEdge) {
      const edgeStatus = this.edge.data?.status;
      const styleKey = edgeStatus ? String(edgeStatus) : "DEFAULT";
      const style = EDGE_STYLES[styleKey] || EDGE_STYLES.DEFAULT;
      arrowKey = style.arrowKey;
    }

    const arrowImage = this.canvasImages[arrowKey];
    if (!arrowImage) return;

    const toSize = this.edge.to?.data?.nodeSize;
    const arrowOffset = this.getArrowOffset(toSize);
    const arrowX = this.edge.to.x - arrowOffset * Math.cos(this.coords.angle);
    const arrowY = this.edge.to.y - arrowOffset * Math.sin(this.coords.angle);

    this.ctx.save();

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

  private getLineOffset(nodeSize: NodeSize | undefined): number {
    if (nodeSize === undefined) return 31;

    switch (nodeSize) {
      case NodeSize.BIG:
        return 38;
      case NodeSize.SMALL:
        return 21;
      default:
        return 31;
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
