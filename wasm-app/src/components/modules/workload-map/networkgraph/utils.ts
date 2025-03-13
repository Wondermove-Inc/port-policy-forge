import { Position } from "vis-network";

export function calculatePositionAlongEdge(
  clickPos: Position,
  fromPos: Position,
  toPos: Position,
) {
  const edgeVector = {
    x: toPos.x - fromPos.x,
    y: toPos.y - fromPos.y,
  };
  const clickVector = {
    x: clickPos.x - fromPos.x,
    y: clickPos.y - fromPos.y,
  };
  const edgeLength = Math.sqrt(
    edgeVector.x * edgeVector.x + edgeVector.y * edgeVector.y,
  );
  const dotProduct =
    (clickVector.x * edgeVector.x + clickVector.y * edgeVector.y) / edgeLength;
  return Math.max(0, Math.min(1, dotProduct / edgeLength));
}
