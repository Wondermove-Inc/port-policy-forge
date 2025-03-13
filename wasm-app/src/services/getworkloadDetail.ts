import { Port, StatsType } from "@/models";

type PortDetailGroupType = {
  open: Port[];
  closed: Port[];
};

export type WorkloadDetailType = {
  uuid: string;
  workloadName: string;
  kind: string;
  inbound: {
    stats: StatsType;
    ports: PortDetailGroupType;
  };
  outbound: {
    stats: StatsType;
    ports: PortDetailGroupType;
  };
};

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
