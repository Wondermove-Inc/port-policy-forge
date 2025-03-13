import { StatsType, WorkloadKind } from "@/models";

type Relation = {
  workloadId: string;
  status: number;
  workload?: WorkloadResource;
};

export type WorkloadResource = {
  uuid: string;
  workloadName: string;
  namespace?: string;
  kind: WorkloadKind;
  from: Relation[];
  to: Relation[];
  usage: number;
  policy_setting_badge: boolean;
  inbound: {
    stats: StatsType;
  };
  outbound: {
    stats: StatsType;
  };
};

type WorkloadsData = {
  raw: string;
  result: WorkloadResource[];
};

export function wasmListWorkloads(namespace: string): Promise<WorkloadsData> {
  return new Promise((resolve, reject) => {
    try {
      const res = window.listWorkloads(namespace);
      const parsed = JSON.parse(res);
      if (!parsed.result || !Array.isArray(parsed.result)) {
        reject("Invalid response format: 'result' is missing or not an array");
      } else {
        resolve({ raw: res, result: parsed.result });
      }
    } catch (error) {
      reject(error);
    }
  });
}
