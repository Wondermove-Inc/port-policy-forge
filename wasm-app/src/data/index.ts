export const clusters = [
  { id: "cluster1", name: "Cluster1", avatar: "-" },
  { id: "cluster2", name: "Cluster2", avatar: "-" },
];

export const namespaces = [
  { id: "namespace1", name: "Namespace1", clusterId: "cluster1" },
  { id: "namespace2", name: "Namespace2", cluster: "cluster1" },
  { id: "test1", name: "Test1", clusterId: "cluster2" },
  { id: "test2", name: "Test2", clusterId: "cluster2" },
];
