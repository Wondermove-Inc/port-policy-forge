declare global {
  interface Window {
    Go: any;
    listWorkloads: (namespace: string) => string;
    getWorkloadDetail: (workloadId: string) => string;
    openPort: (requestJSON: string) => string;
    editPort: (requestJSON: string) => string;
    closeOpenedPort: (requestJSON: string) => string;
    openClosedPort: (requestJSON: string) => string;
    clearClosedPortHistory: (requestJSON: string) => string; // WASM에 노출된 함수
  }
}
