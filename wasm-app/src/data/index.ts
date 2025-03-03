export const clusters = [
  { id: "cluster1", name: "Cluster1", type: "aks" },
  { id: "cluster2", name: "Cluster2123213123", type: "gke" },
];

export const namespaces = [
  { id: "namespace1", name: "Namespace1", clusterId: "cluster1" },
  { id: "namespace2", name: "Namespace212312312321", clusterId: "cluster1" },
  { id: "test1", name: "Test1", clusterId: "cluster2" },
  { id: "test2", name: "Test2", clusterId: "cluster2" },
];

export const workloadList = [
  {
    id: "1",
    name: "Workload Name 1",
    type: "Type",
    unconnectedPort: 2,
    idlePort: 8,
    activePort: 8,
    errorPort: 6,
    closedPortAttempted: 0,
  },
  {
    id: "2",
    name: "Workload Name 2",
    type: "Type",
    unconnectedPort: 3,
    idlePort: 7,
    activePort: 8,
    errorPort: 9,
    closedPortAttempted: 1,
  },
  {
    id: "3",
    name: "Workload Name 3",
    type: "Type",
    unconnectedPort: 0,
    idlePort: 0,
    activePort: 0,
    errorPort: 0,
    closedPortAttempted: 2,
  },
];

export const exampleWorkload = {
  uuid: "7431bb4f-cae8-4dbe-a542-d6f52c893271",
  workloadName: "demo-workload-1",
  kind: "deployment",
  stats: {
    active: 2,
    unconnected: 8079,
    idle: 1,
    error: 0,
    attempted: 2,
    latencyRtt: 1.39,
    throughput: 469.89,
  },
  ports: {
    inbound: {
      open: [
        {
          id: 0,
          isRange: true,
          portNumber: null,
          portRange: {
            start: "0",
            end: "4999",
          },
          status: 0,
          direction: "inbound",
          source: null,
          isOpen: true,
          risk: 0,
          type: "internal",
          count: null,
          lastConnection: null,
          lastSrcIp: null,
          lastConnectionLog: null,
        },
        {
          id: 1,
          isRange: false,
          portNumber: 5000,
          portRange: null,
          status: 1,
          direction: "inbound",
          source: null,
          isOpen: true,
          risk: 0,
          type: "internal",
          count: null,
          lastConnection: "2023-02-21T11:19:22+09:00",
          lastSrcIp: "10.10.1.19",
          lastConnectionLog: "Connection Log",
        },
        {
          id: 0,
          isRange: true,
          portNumber: null,
          portRange: {
            start: "5001",
            end: "8079",
          },
          status: 0,
          direction: "inbound",
          source: null,
          isOpen: true,
          risk: 0,
          type: "internal",
          count: null,
          lastConnection: null,
          lastSrcIp: null,
          lastConnectionLog: null,
        },
        {
          id: 2,
          isRange: false,
          portNumber: 8080,
          portRange: null,
          status: 2,
          direction: "inbound",
          source: [
            {
              ip: "192.168.1.100",
              port: 51234,
            },
            {
              ip: "192.168.1.101",
              port: 51234,
            },
          ],
          isOpen: true,
          risk: 0,
          type: "internal",
          count: null,
          lastConnection: "2022-02-21T11:19:22+09:00",
          lastSrcIp: "10.10.1.19",
          lastConnectionLog: "Connection Log",
        },
      ],
      closed: [
        {
          id: 5,
          isRange: false,
          portNumber: 50051,
          portRange: null,
          status: 4,
          direction: "inbound",
          source: [
            {
              ip: "192.168.1.100",
              port: 51234,
            },
          ],
          isOpen: false,
          risk: 2,
          type: "internal",
          count: 10,
          lastConnection: "2023-02-21T11:19:22+09:00",
          lastSrcIp: "10.10.1.19",
          lastConnectionLog: "Connection Log",
        },
        {
          id: 6,
          isRange: false,
          portNumber: 50052,
          portRange: null,
          status: 4,
          direction: "inbound",
          source: [
            {
              ip: "192.168.1.100",
              port: 51234,
            },
          ],
          isOpen: false,
          risk: 1,
          type: "internal",
          count: 4,
          lastConnection: "2023-02-21T11:19:22+09:00",
          lastSrcIp: "10.10.1.19",
          lastConnectionLog: "Connection Log",
        },
      ],
    },
    outbound: {
      open: [
        {
          id: 7,
          isRange: false,
          portNumber: 9000,
          portRange: null,
          status: 0,
          direction: "outbound",
          source: [
            {
              ip: "10.0.0.1",
              port: 12345,
            },
          ],
          isOpen: true,
          risk: 0,
          type: "external",
          count: null,
          lastConnection: "2023-02-21T12:00:00+09:00",
          lastSrcIp: "10.0.0.2",
          lastConnectionLog: "Outbound connection log",
        },
      ],
      closed: [
        {
          id: 8,
          isRange: false,
          portNumber: 9001,
          portRange: null,
          status: 4,
          direction: "outbound",
          source: [
            {
              ip: "10.0.0.1",
              port: 12345,
            },
          ],
          isOpen: false,
          risk: 2,
          type: "external",
          count: 5,
          lastConnection: "2023-02-21T12:05:00+09:00",
          lastSrcIp: "10.0.0.2",
          lastConnectionLog: "Outbound closed connection log",
        },
      ],
    },
  },
};
