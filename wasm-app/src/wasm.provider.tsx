import { createContext, useContext } from "react";

export type WorkloadConnector = {
  workloadId: string;
  status: number;
};

export type Workload = {
  uuid: string;
  workloadName: string;
  kind: string;
  from: WorkloadConnector[];
  to: WorkloadConnector[];
};

type WasmData = {
  getWorkloads: (namespaceId: string) => Workload[];
};

type WasmProviderProps = {
  children: React.ReactNode;
};

const wasmContext = createContext<WasmData>({} as WasmData);

export function WasmProvider({ children }: WasmProviderProps) {
  const ctxVal: WasmData = {
    getWorkloads(namespaceId) {
      try {
        const workloads = JSON.parse(window.listWorkloads(namespaceId));
        return workloads.result;
      } catch {
        return [];
      }
    },
  };
  return <wasmContext.Provider value={ctxVal}>{children}</wasmContext.Provider>;
}

export const useWasmContext = () => useContext(wasmContext);
