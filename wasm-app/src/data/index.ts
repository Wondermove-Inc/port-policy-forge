export const clusters = [
  { id: "cluster1", name: "Cluster1", type: "aks" },
  { id: "cluster2", name: "Cluster2", type: "gke" },
];

export const namespaces = [
  { id: "namespace1", name: "Namespace1", clusterId: "cluster1" },
  { id: "namespace2", name: "Namespace2", cluster: "cluster1" },
  { id: "test1", name: "Test1", clusterId: "cluster2" },
  { id: "test2", name: "Test2", clusterId: "cluster2" },
];

export const workloads = [
  {
    id: 1,
    name: "Name",
    type: "Type",
    unconnectedPort: 2,
    idlePort: 8,
    activePort: 8,
    errorPort: 6,
    closedPortAttempted: "",
  },
  {
    id: 2,
    name: "Name",
    type: "Type",
    unconnectedPort: 3,
    idlePort: 7,
    activePort: 8,
    errorPort: 9,
    closedPortAttempted: "1",
  },
  {
    id: 3,
    name: "Name",
    type: "Type",
    unconnectedPort: 0,
    idlePort: 0,
    activePort: 0,
    errorPort: 0,
    closedPortAttempted: "",
  },
];
