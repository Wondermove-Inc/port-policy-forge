declare global {
  interface Window {
    closeNotActivePorts: (requestJSON: string) => string;
  }
}

// CloseNotActivePortsRequest: 활성 상태가 아닌 포트 닫기 요청 구조체
export type CloseNotActivePortsRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
};

// 새로 추가한 closeNotActivePorts 호출 함수
export function wasmCloseNotActivePorts(
  request: CloseNotActivePortsRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
      const res = window.closeNotActivePorts(requestJSON);
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
