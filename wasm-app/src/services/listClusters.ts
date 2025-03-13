import { ClusterType } from "@/models";

declare global {
  interface Window {
    listClusters: () => string;
  }
}

type ClusterResource = {
  id: string;
  clusterName: string;
  clusterType: ClusterType;
};

type ClusterData = {
  raw: string;
  result: ClusterResource[];
};

export function wasmListClusters(): Promise<ClusterData> {
  return new Promise((resolve, reject) => {
    try {
      const raw = window.listClusters();
      const parsed = JSON.parse(raw);
      resolve({ raw, result: parsed.result });
    } catch (error) {
      reject(error);
    }
  });
}
