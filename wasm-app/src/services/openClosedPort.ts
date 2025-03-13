declare global {
  interface Window {
    openClosedPort: (requestJSON: string) => string;
  }
}

export type OpenClosedPortRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
  portSpec: string;
};

export function wasmOpenClosedPort(
  requests: OpenClosedPortRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(requests);
      const res = window.openClosedPort(requestJSON);
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
