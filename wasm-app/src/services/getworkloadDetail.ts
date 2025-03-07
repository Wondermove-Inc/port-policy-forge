import { WorkloadDetailType } from "@/models";

type WorkloadDetailData = {
  raw: string;
  result: WorkloadDetailType;
};

export function wasmGetWorkloadDetail(id: string): Promise<WorkloadDetailData> {
  return new Promise((resolve, reject) => {
    try {
      const raw = window.getWorkloadDetail(id);
      const parsed = JSON.parse(raw);
      resolve({ raw, result: parsed.result });
    } catch (error) {
      reject(error);
    }
  });
}
