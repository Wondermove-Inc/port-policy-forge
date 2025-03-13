import { AccessPolicy, SourceType } from "@/models";

declare global {
  interface Window {
    openPort: (requestJSON: string) => string;
  }
}

export type PortControlBaseRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
  portSpec: string; // ex: "8080", "8080,8081", "8080-8091"
  accessPolicy: AccessPolicy;
  sources: SourceType[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wasmOpenPort(request: PortControlBaseRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
      const res = window.openPort(requestJSON);
      const parsed = JSON.parse(res);
      if (parsed.error) {
        reject(parsed.error);
      } else {
        resolve(parsed);
      }
    } catch (error) {
      reject(error);
    }
  });
}
