export const createNetworkOptions = () => {
  return {
    interaction: {
      dragNodes: false,
      hover: true,
      selectable: false,
    },
    nodes: {
      shape: "dot",
      color: { background: "#007bff", border: "#0056b3" },
      font: { color: "#ffffff", size: 12 },
    },
    edges: {
      color: "transparent",
      smooth: false,
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 200,
      },
    },
  };
};
