import { useEffect, useRef, useState } from "react";

import { Network } from "vis-network";

import { createNodes, createEdges } from "./dataUtils";
import { loadAllImages } from "./imageLoader";
import { setupNetworkEvents } from "./networkEvents";
import { createNetworkOptions } from "./networkOptions";
import { CanvasImage, CustomEdge, CustomNode, NetworkWithBody } from "./types";

let network: NetworkWithBody;

const NetworkGraph = () => {
  const containerRef = useRef(null);
  const [canvasImages, setCanvasImages] = useState<CanvasImage>();
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [nodes, setNodes] = useState<CustomNode[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      setEdges(createEdges());
      setNodes(createNodes());
      const images = await loadAllImages();
      setCanvasImages(images);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (
      !canvasImages ||
      !containerRef.current ||
      edges.length === 0 ||
      nodes.length === 0
    ) {
      return;
    }

    const data = { nodes, edges };
    const options = createNetworkOptions();

    network = new Network(
      containerRef.current,
      data,
      options,
    ) as NetworkWithBody;

    setupNetworkEvents(network, canvasImages, edges);
  }, [canvasImages, edges, nodes]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default NetworkGraph;
