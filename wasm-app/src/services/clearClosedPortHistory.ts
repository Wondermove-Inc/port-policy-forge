declare global {
  interface Window {
    clearClosedPortHistory: (requestJSON: string) => string;
  }
}

export type ClearClosedPortHistoryRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
  portSpec: string;
};

export function wasmClearClosedPortHistory(
  request: ClearClosedPortHistoryRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
      const res = window.clearClosedPortHistory(requestJSON);
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
