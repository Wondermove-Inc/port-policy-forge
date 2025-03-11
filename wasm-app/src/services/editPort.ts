import { PortControlBaseRequest } from "./openPort";

declare global {
  interface Window {
    editPort: (requestJSON: string) => string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wasmEditPort(request: PortControlBaseRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
      const res = window.editPort(requestJSON);
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
