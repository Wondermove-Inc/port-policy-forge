// const canvas = containerRef.current?.querySelector("canvas");
// const onMouseMove = (event: MouseEvent) => {
//   const pointer = networkRef.current?.DOMtoCanvas({
//     x: event.offsetX,
//     y: event.offsetY,
//   });

//   const edgeId = networkRef.current?.getEdgeAt({
//     x: event.offsetX,
//     y: event.offsetY,
//   });
//   if (edgeId && pointer) {
//     const edge = networkRef.current?.body.edges[edgeId as string];
//     if (edge) {
//       const fromNodePos = networkRef.current?.getPositions([edge.from.id])[
//         edge.from.id
//       ];
//       const toNodePos = networkRef.current?.getPositions([edge.to.id])[
//         edge.to.id
//       ];
//       if (fromNodePos && toNodePos) {
//         const mousemoveRatio = calculatePositionAlongEdge(
//           pointer,
//           fromNodePos,
//           toNodePos
//         );
//         if (mousemoveRatio >= 0.2 && mousemoveRatio <= 0.8) {
//           setActiveEdgeId(edgeId as string);
//           document.body.style.cursor = "pointer";
//         }
//       }
//     }
//   } else {
//     setActiveEdgeId("");
//     if (!hoverNodeId.current && !activeNodeId) {
//       document.body.style.cursor = "auto";
//     }
//   }
// };

// if (canvas) {
//   canvas.addEventListener("mousemove", onMouseMove);
// }
