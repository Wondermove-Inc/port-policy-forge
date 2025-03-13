export type ClosePortsByStatusRequest = {
  workloadUuid: string;
  flag: string; // "0": inbound, "1": outbound
  status: string[]; // 상태 배열: "active", "idle", "error", "attempt", "unconnected"
};

export function wasmClosePortsByStatus(
  requests: ClosePortsByStatusRequest[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(requests);
      const res = window.closePortsByStatus(requestJSON);
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
