import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

declare global {
  interface Window {
    getWorkloadDetail: (workloadId: string) => string;
    openPort: (requestJSON: string) => string;
    editPort: (requestJSON: string) => string;
    closeOpenedPort: (requestJSON: string) => string;
    openClosedPort: (requestJSON: string) => string;
    clearClosedPortHistory: (requestJSON: string) => string;
    closePortsByStatus: (requestJSON: string) => string;
    closeNotActivePorts: (requestJSON: string) => string;
  }
}

type AccessPolicy = "allow-all" | "only-specific" | "exclude-specific";

type AccessSource = {
  ip: string;
  protocol: string;
  comment: string;
  lastUpdatedAt?: string; 
};

type PortRange = {
  start: string;
  end: string;
};

export type Port = {
  id: number;
  isRange: boolean;
  portNumber?: number | null;
  portRange?: PortRange | null;
  status?: number | null;  
  direction: string;
  accessPolicy: AccessPolicy;
  accessSources: AccessSource[];
  isOpen: boolean;
  risk?: number | null;
  count?: number | null;
  lastConnectionDate?: string | null;
  lastConnectionEndpoint?: string | null;
  lastConnectionLog?: string | null;
};

type PortDetailGroup = {
  open: Port[];
  closed: Port[];
};

type Stats = {
  active: number;
  unconnected: number;
  idle: number;
  error: number;
  attempted: number;
  latencyRtt: number | null;
  throughput: number;
};

type TrafficInfo = {
  stats: Stats;
  ports: PortDetailGroup;
};

type WorkloadDetail = {
  uuid: string;
  workloadName: string;
  kind: string;
  inbound: TrafficInfo;
  outbound: TrafficInfo;
};

// PortControlBase (openPort, editPort) 요청 구조
export type PortControlBaseRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
  portSpec: string; // ex: "8080", "8080,8081", "8080-8091"
  accessPolicy: AccessPolicy;
  sources: AccessSource[];
};

// PortCloseRequest: closePort 또는 openClosedPort 요청에 필요한 최소 정보
export type PortCloseRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
  portSpec: string; // ex: "8080" 또는 "8080-8091"
};

// ClosePortsByStatusRequest: 상태별 포트 닫기 요청 구조체
export type ClosePortsByStatusRequest = {
  workloadUuid: string;
  flag: string; // "0": inbound, "1": outbound
  status: string[]; // 상태 배열: "active", "idle", "error", "attempt", "unconnected"
};

// CloseNotActivePortsRequest: 활성 상태가 아닌 포트 닫기 요청 구조체
export type CloseNotActivePortsRequest = {
  workloadUuid: string;
  flag: number; // 0: inbound, 1: outbound
};

function wasmGetWorkloadDetail(workloadId: string): Promise<WorkloadDetail> {
  return new Promise((resolve, reject) => {
    try {
      const res = window.getWorkloadDetail(workloadId);
      const parsed = JSON.parse(res);
      resolve(parsed.result);
    } catch (error) {
      reject(error);
    }
  });
}

function wasmOpenPort(request: PortControlBaseRequest): Promise<any> {
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

function wasmEditPort(request: PortControlBaseRequest): Promise<any> {
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

function wasmCloseOpenedPort(request: PortCloseRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
      const res = window.closeOpenedPort(requestJSON);
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

function wasmOpenClosedPort(request: PortCloseRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const requestJSON = JSON.stringify(request);
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

function wasmClearClosedPortHistory(request: PortCloseRequest): Promise<any> {
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

function wasmClosePortsByStatus(requests: ClosePortsByStatusRequest[]): Promise<any> {
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

function wasmCloseNotActivePorts(request: CloseNotActivePortsRequest): Promise<any> {
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

// 헬퍼: 주어진 포트에 대한 PortSpec 문자열 반환
const getPortSpec = (port: Port): string => {
  if (port.isRange && port.portRange) {
    return `${port.portRange.start}-${port.portRange.end}`;
  } else if (port.portNumber) {
    return String(port.portNumber);
  }
  return "";
};

const WorkloadDetailComponent: React.FC = () => {
  const { namespaceName, workloadId } = useParams<{
    namespaceName: string;
    workloadId: string;
  }>();

  const [detail, setDetail] = useState<WorkloadDetail | null>(null);
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 표시 상태들
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusFilterModal, setShowStatusFilterModal] = useState(false);

  // [A] 인바운드 모달 입력값
  const [inboundPortSpec, setInboundPortSpec] = useState("");
  const [inboundAccessPolicy, setInboundAccessPolicy] = useState<AccessPolicy>("allow-all");
  const [inboundSources, setInboundSources] = useState<AccessSource[]>([]);

  // [B] 아웃바운드 모달 입력값
  const [outboundPortSpec, setOutboundPortSpec] = useState("");
  const [outboundAccessPolicy, setOutboundAccessPolicy] = useState<AccessPolicy>("allow-all");
  const [outboundSources, setOutboundSources] = useState<AccessSource[]>([]);

  // [C] 에딧 모달 입력값 (단일 포트 및 포트 범위 모두 허용)
  const [editFlag, setEditFlag] = useState<number>(0); // 0: inbound, 1: outbound
  const [editPortSpec, setEditPortSpec] = useState<string>(""); // 수정할 포트 스펙 문자열
  const [editAccessPolicy, setEditAccessPolicy] = useState<AccessPolicy>("allow-all");
  const [editSources, setEditSources] = useState<AccessSource[]>([]);

  // [D] 상태 필터 모달 입력값
  const [filterDirection, setFilterDirection] = useState<string>("0"); // "0": inbound, "1": outbound
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // 상태/위험도 매핑
  const statusMapping: { [key: number]: string } = {
    0: "unconnected",
    1: "active",
    2: "idle",
    3: "error",
    4: "attempt"
  };
  const riskMapping: { [key: number]: string } = {
    0: "normal",
    1: "high",
    2: "very high",
  };

  // 상태 필터 옵션
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "idle", label: "Idle" },
    { value: "error", label: "Error" },
    { value: "attempt", label: "Attempted" },
    { value: "unconnected", label: "Unconnected" }
  ];

  useEffect(() => {
    if (workloadId) {
      loadWorkloadDetail(workloadId);
    }
  }, [workloadId]);

  const loadWorkloadDetail = (id: string) => {
    setLoading(true);
    wasmGetWorkloadDetail(id)
      .then((data) => {
        setDetail(data);
        setRawData(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  };

  // OpenPort - Inbound
  const handleOpenInboundPort = () => {
    if (!workloadId) return;
    const request: PortControlBaseRequest = {
      workloadUuid: workloadId,
      flag: 0,
      portSpec: inboundPortSpec.trim(),
      accessPolicy: inboundAccessPolicy,
      sources: inboundSources,
    };

    wasmOpenPort(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
        setShowInboundModal(false);
        setInboundPortSpec("");
        setInboundAccessPolicy("allow-all");
        setInboundSources([]);
      })
      .catch((err) => {
        alert("Failed to open inbound port: " + err);
      });
  };

  // OpenPort - Outbound
  const handleOpenOutboundPort = () => {
    if (!workloadId) return;
    const request: PortControlBaseRequest = {
      workloadUuid: workloadId,
      flag: 1,
      portSpec: outboundPortSpec.trim(),
      accessPolicy: outboundAccessPolicy,
      sources: outboundSources,
    };
    
    wasmOpenPort(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
        setShowOutboundModal(false);
        setOutboundPortSpec("");
        setOutboundAccessPolicy("allow-all");
        setOutboundSources([]);
      })
      .catch((err) => {
        alert("Failed to open outbound port: " + err);
      });
  };

  // EditPort (단일 포트 및 포트 범위 모두 허용)
  const handleEditPort = () => {
    if (!workloadId || editPortSpec.trim() === "") return;
    const request: PortControlBaseRequest = {
      workloadUuid: workloadId,
      flag: editFlag,
      portSpec: editPortSpec.trim(),
      accessPolicy: editAccessPolicy,
      sources: editSources,
    };

    wasmEditPort(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
        setShowEditModal(false);
        resetEditStates();
      })
      .catch((err) => {
        alert("Failed to edit port: " + err);
      });
  };

  // CloseOpenedPort: Open된 포트를 닫음
  const handleCloseOpenedPort = (flag: number, port: Port) => {
    if (!workloadId) return;
    const spec = getPortSpec(port);
    if (!window.confirm(`Are you sure you want to close port ${spec}?`)) return;

    const request: PortCloseRequest = {
      workloadUuid: workloadId,
      flag: flag,
      portSpec: spec,
    };

    wasmCloseOpenedPort(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
      })
      .catch((err) => {
        alert("Failed to close port: " + err);
      });
  };

  // OpenClosedPort: 닫힌 포트를 allow-all 정책으로 재오픈
  const handleOpenClosedPort = (flag: number, port: Port) => {
    if (!workloadId) return;
    const spec = getPortSpec(port);
    if (!window.confirm(`Are you sure you want to allow (re-open) closed port ${spec}?`)) return;

    const request: PortCloseRequest = {
      workloadUuid: workloadId,
      flag: flag,
      portSpec: spec,
    };

    wasmOpenClosedPort(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
      })
      .catch((err) => {
        alert("Failed to allow closed port: " + err);
      });
  };

  // ClearClosedPortHistory: 닫힌 포트의 접속 기록을 삭제
  const handleClearClosedPortHistory = (flag: number, port: Port) => {
    if (!workloadId) return;
    const spec = getPortSpec(port);
    if (!window.confirm(`Clear connection history for closed port ${spec}?`)) return;
    const request: PortCloseRequest = {
      workloadUuid: workloadId,
      flag: flag,
      portSpec: spec,
    };
    wasmClearClosedPortHistory(request)
      .then(() => {
        loadWorkloadDetail(workloadId);
      })
      .catch((err) => {
        alert("Failed to clear closed port history: " + err);
      });
  };

  // ClosePortsByStatus: 상태별 포트 닫기
  const handleClosePortsByStatus = () => {
    if (!workloadId || selectedStatuses.length === 0) {
      alert("Please select at least one status");
      return;
    }

    if (!window.confirm(`Close all ports with statuses: ${selectedStatuses.join(", ")}?`)) {
      return;
    }

    const request: ClosePortsByStatusRequest[] = [
      {
        workloadUuid: workloadId,
        flag: filterDirection,
        status: selectedStatuses
      }
    ];

    wasmClosePortsByStatus(request)
      .then((result) => {
        loadWorkloadDetail(workloadId);
        setShowStatusFilterModal(false);
        setSelectedStatuses([]);
      })
      .catch((err) => {
        alert(`Failed to close ports by status: ${err}`);
      });
  };

  // CloseNotActivePorts: 활성 상태가 아닌 모든 포트 닫기
  const handleCloseNotActivePorts = (flag: number) => {
    if (!workloadId) return;
    
    if (!window.confirm(`Close all non-active ports for ${flag === 0 ? 'inbound' : 'outbound'}?`)) {
      return;
    }
    
    const request: CloseNotActivePortsRequest = {
      workloadUuid: workloadId,
      flag: flag
    };
    
    wasmCloseNotActivePorts(request)
      .then((result) => {
        loadWorkloadDetail(workloadId);
      })
      .catch((err) => {
        alert(`Failed to close non-active ports: ${err}`);
      });
  };

  // 상태 체크박스 토글
  const handleStatusChange = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // 모달에서 AccessSources 추가/삭제 (Inbound/Outbound/EDIT 각각)
  // 1) inbound
  const handleAddInboundSource = () => {
    setInboundSources((prev) => [
      ...prev,
      { ip: "", protocol: "tcp", comment: "", lastUpdatedAt: "" },
    ]);
  };
  const handleRemoveInboundSource = (index: number) => {
    setInboundSources((prev) => prev.filter((_, i) => i !== index));
  };
  const handleChangeInboundSource = (index: number, field: keyof AccessSource, value: string) => {
    setInboundSources((prev) =>
      prev.map((src, i) =>
        i === index ? { ...src, [field]: value } : src
      )
    );
  };

  // 2) outbound
  const handleAddOutboundSource = () => {
    setOutboundSources((prev) => [
      ...prev,
      { ip: "", protocol: "tcp", comment: "", lastUpdatedAt: "" },
    ]);
  };
  const handleRemoveOutboundSource = (index: number) => {
    setOutboundSources((prev) => prev.filter((_, i) => i !== index));
  };
  const handleChangeOutboundSource = (index: number, field: keyof AccessSource, value: string) => {
    setOutboundSources((prev) =>
      prev.map((src, i) =>
        i === index ? { ...src, [field]: value } : src
      )
    );
  };

  // 3) edit
  const handleAddEditSource = () => {
    setEditSources((prev) => [
      ...prev,
      { ip: "", protocol: "tcp", comment: "", lastUpdatedAt: "" },
    ]);
  };
  const handleRemoveEditSource = (index: number) => {
    setEditSources((prev) => prev.filter((_, i) => i !== index));
  };
  const handleChangeEditSource = (index: number, field: keyof AccessSource, value: string) => {
    setEditSources((prev) =>
      prev.map((src, i) =>
        i === index ? { ...src, [field]: value } : src
      )
    );
  };

  // Edit 모달 열기 (단일 포트 및 포트 범위 모두 허용)
  const openEditModal = (flag: number, port: Port) => {
    setEditFlag(flag);
    if (port.isRange && port.portRange) {
      setEditPortSpec(`${port.portRange.start}-${port.portRange.end}`);
    } else if (port.portNumber) {
      setEditPortSpec(String(port.portNumber));
    } else {
      setEditPortSpec("");
    }
    setEditAccessPolicy(port.accessPolicy);
    setEditSources(port.accessSources ? [...port.accessSources] : []);
    setShowEditModal(true);
  };

  const resetEditStates = () => {
    setEditFlag(0);
    setEditPortSpec("");
    setEditAccessPolicy("allow-all");
    setEditSources([]);
  };

  if (loading) return <p>Loading workload detail for {workloadId}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!detail) return <p>No detail available.</p>;

  // === Table Rendering ===
  const renderTableHeader = () => (
    <thead>
      <tr>
        <th>ID</th>
        <th>isRange</th>
        <th>portNumber</th>
        <th>portRange</th>
        <th>status</th>
        <th>accessPolicy</th>
        <th>accessSources</th>
        <th>isOpen</th>
        <th>risk</th>
        <th>count</th>
        <th>LastConnectionDate</th>
        <th>LastConnectionEndpoint</th>
        <th>LastConnectionLog</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  const renderPortRows = (ports: Port[], flag: number) => (
    <tbody>
      {ports.map((port) => (
        <tr key={port.id}>
          <td>{port.id}</td>
          <td>{port.isRange ? "true" : "false"}</td>
          <td>{port.portNumber ?? "N/A"}</td>
          <td>
            {port.portRange ? `${port.portRange.start}-${port.portRange.end}` : "N/A"}
          </td>
          <td>
            {port.status !== undefined && port.status !== null
              ? statusMapping[port.status]
              : "N/A"}
          </td>
          <td>{port.accessPolicy}</td>
          <td>
            {port.accessSources && port.accessSources.length > 0 ? (
              <ul>
                {port.accessSources.map((src, idx) => (
                  <li key={idx}>
                    {src.ip} / {src.protocol} / {src.comment} / {src.lastUpdatedAt}
                  </li>
                ))}
              </ul>
            ) : (
              "N/A"
            )}
          </td>
          <td>{port.isOpen ? "true" : "false"}</td>
          <td>
            {port.risk !== undefined && port.risk !== null
              ? riskMapping[port.risk]
              : "N/A"}
          </td>
          <td>{port.count ?? "N/A"}</td>
          <td>{port.lastConnectionDate ?? "N/A"}</td>
          <td>{port.lastConnectionEndpoint ?? "N/A"}</td>
          <td>{port.lastConnectionLog ?? "N/A"}</td>
          <td>
            {port.isOpen ? (
              <>
                <button onClick={() => openEditModal(flag, port)}>Edit</button>
                <button onClick={() => handleCloseOpenedPort(flag, port)} style={{ marginLeft: '0.5rem' }}>
                  Close
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleOpenClosedPort(flag, port)}>Allow</button>
                {port.count && port.count > 0 && (
                  <button onClick={() => handleClearClosedPortHistory(flag, port)} style={{ marginLeft: '0.5rem' }}>
                    Clear
                  </button>
                )}
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderPortTable = (ports: Port[], flag: number) => {
    if (ports.length === 0) {
      return <p>No ports found.</p>;
    }
    return (
      <table border={1} cellPadding={4} style={{ marginBottom: '1rem' }}>
        {renderTableHeader()}
        {renderPortRows(ports, flag)}
      </table>
    );
  };

  // === Modal Rendering ===
  const renderModalOverlay = (children: React.ReactNode) => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {children}
      </div>
    </div>
  );

  // Inbound Modal (openPort)
  const renderInboundModal = () => {
    if (!showInboundModal) return null;
    return renderModalOverlay(
      <>
        <h3>Open Inbound Port (flag=0)</h3>
        <label>Port Spec: </label>
        <input
          type="text"
          value={inboundPortSpec}
          onChange={(e) => setInboundPortSpec(e.target.value)}
          placeholder="Ex) 8080, 8081, 8080-8091"
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <label>Access Policy: </label>
        <select
          value={inboundAccessPolicy}
          onChange={(e) => setInboundAccessPolicy(e.target.value as AccessPolicy)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="allow-all">allow-all</option>
          <option value="only-specific">only-specific</option>
          <option value="exclude-specific">exclude-specific</option>
        </select>
        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block' }}>Access Sources:</label>
          {inboundSources.map((src, idx) => (
            <div key={idx} style={{ marginBottom: '0.3rem' }}>
              <input
                type="text"
                placeholder="IP"
                value={src.ip}
                onChange={(e) => handleChangeInboundSource(idx, "ip", e.target.value)}
                style={{ width: '90px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Protocol"
                value={src.protocol}
                onChange={(e) => handleChangeInboundSource(idx, "protocol", e.target.value)}
                style={{ width: '80px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Comment"
                value={src.comment}
                onChange={(e) => handleChangeInboundSource(idx, "comment", e.target.value)}
                style={{ width: '120px', marginRight: '0.5rem' }}
              />
              <button onClick={() => handleRemoveInboundSource(idx)}>X</button>
            </div>
          ))}
          <button onClick={handleAddInboundSource}>+ Add Source</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleOpenInboundPort} style={{ marginRight: '0.5rem' }}>
            Open Port
          </button>
          <button onClick={() => setShowInboundModal(false)}>Cancel</button>
        </div>
      </>
    );
  };

  // Outbound Modal (openPort)
  const renderOutboundModal = () => {
    if (!showOutboundModal) return null;
    return renderModalOverlay(
      <>
        <h3>Open Outbound Port (flag=1)</h3>
        <label>Port Spec: </label>
        <input
          type="text"
          value={outboundPortSpec}
          onChange={(e) => setOutboundPortSpec(e.target.value)}
          placeholder="Ex) 9000, 9001, 9001-9010"
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <label>Access Policy: </label>
        <select
          value={outboundAccessPolicy}
          onChange={(e) => setOutboundAccessPolicy(e.target.value as AccessPolicy)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="allow-all">allow-all</option>
          <option value="only-specific">only-specific</option>
          <option value="exclude-specific">exclude-specific</option>
        </select>
        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block' }}>Access Sources:</label>
          {outboundSources.map((src, idx) => (
            <div key={idx} style={{ marginBottom: '0.3rem' }}>
              <input
                type="text"
                placeholder="IP"
                value={src.ip}
                onChange={(e) => handleChangeOutboundSource(idx, "ip", e.target.value)}
                style={{ width: '90px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Protocol"
                value={src.protocol}
                onChange={(e) => handleChangeOutboundSource(idx, "protocol", e.target.value)}
                style={{ width: '80px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Comment"
                value={src.comment}
                onChange={(e) => handleChangeOutboundSource(idx, "comment", e.target.value)}
                style={{ width: '120px', marginRight: '0.5rem' }}
              />
              <button onClick={() => handleRemoveOutboundSource(idx)}>X</button>
            </div>
          ))}
          <button onClick={handleAddOutboundSource}>+ Add Source</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleOpenOutboundPort} style={{ marginRight: '0.5rem' }}>
            Open Port
          </button>
          <button onClick={() => setShowOutboundModal(false)}>Cancel</button>
          </div>
      </>
    );
  };

  // Edit Modal (단일 포트 및 포트 범위 모두 편집)
  const renderEditModal = () => {
    if (!showEditModal) return null;
    return renderModalOverlay(
      <>
        <h3>Edit Port (flag={editFlag})</h3>
        <label>Port Spec: </label>
        <input
          type="text"
          value={editPortSpec}
          onChange={(e) => setEditPortSpec(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <p>(예: 단일 포트 "8080" 또는 포트 범위 "8083-8085")</p>
        <label>Access Policy: </label>
        <select
          value={editAccessPolicy}
          onChange={(e) => setEditAccessPolicy(e.target.value as AccessPolicy)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="allow-all">allow-all</option>
          <option value="only-specific">only-specific</option>
          <option value="exclude-specific">exclude-specific</option>
        </select>
        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block' }}>Access Sources:</label>
          {editSources.map((src, idx) => (
            <div key={idx} style={{ marginBottom: '0.3rem' }}>
              <input
                type="text"
                placeholder="IP"
                value={src.ip}
                onChange={(e) => handleChangeEditSource(idx, "ip", e.target.value)}
                style={{ width: '90px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Protocol"
                value={src.protocol}
                onChange={(e) => handleChangeEditSource(idx, "protocol", e.target.value)}
                style={{ width: '80px', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Comment"
                value={src.comment}
                onChange={(e) => handleChangeEditSource(idx, "comment", e.target.value)}
                style={{ width: '120px', marginRight: '0.5rem' }}
              />
              <button onClick={() => handleRemoveEditSource(idx)}>X</button>
            </div>
          ))}
          <button onClick={handleAddEditSource}>+ Add Source</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleEditPort} style={{ marginRight: '0.5rem' }}>Save</button>
          <button onClick={() => { setShowEditModal(false); resetEditStates(); }}>Cancel</button>
        </div>
      </>
    );
  };

  // 상태 필터 모달
  const renderStatusFilterModal = () => {
    if (!showStatusFilterModal) return null;
    
    return renderModalOverlay(
      <>
        <h3>Close Ports by Status</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Direction: </label>
          <select 
            value={filterDirection} 
            onChange={(e) => setFilterDirection(e.target.value)}
            style={{ marginBottom: '0.5rem' }}
          >
            <option value="0">Inbound</option>
            <option value="1">Outbound</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Statuses to Close:</label>
          {statusOptions.map(option => (
            <div key={option.value} style={{ marginBottom: '0.3rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(option.value)}
                  onChange={() => handleStatusChange(option.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {option.label}
              </label>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={handleClosePortsByStatus} 
            disabled={selectedStatuses.length === 0}
            style={{ marginRight: '0.5rem' }}
          >
            Close Matching Ports
          </button>
          <button onClick={() => {
            setShowStatusFilterModal(false);
            setSelectedStatuses([]);
          }}>
            Cancel
          </button>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Workload Detail: {detail.workloadName}</h2>
      <p><strong>Kind:</strong> {detail.kind}</p>

      {/* ==== Inbound Stats ==== */}
      <h3>Inbound Stats</h3>
      <p>
        Active: {detail.inbound.stats.active}, Unconnected: {detail.inbound.stats.unconnected}, Idle: {detail.inbound.stats.idle},
        Error: {detail.inbound.stats.error}, Attempted: {detail.inbound.stats.attempted},
        Latency RTT: {detail.inbound.stats.latencyRtt}, Throughput: {detail.inbound.stats.throughput}
      </p>

      {/* ==== Inbound Ports ==== */}
      <h3>Inbound Ports</h3>
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ display: 'inline-block', marginRight: '1rem' }}>Open</h4>
        <button onClick={() => setShowInboundModal(true)} style={{ marginRight: '0.5rem' }}>
          + Open Inbound Port
        </button>
        <button 
          onClick={() => {
            setFilterDirection("0");
            setShowStatusFilterModal(true);
          }}
          style={{ marginRight: '0.5rem' }}
        >
          Close by Status
        </button>
        <button onClick={() => handleCloseNotActivePorts(0)}>
          Close Non-Active
        </button>
      </div>
      {renderInboundModal()}
      {renderPortTable(detail.inbound.ports.open, 0)}

      <h4>Closed</h4>
      {renderPortTable(detail.inbound.ports.closed, 0)}

      {/* ==== Outbound Stats ==== */}
      <h3>Outbound Stats</h3>
      <p>
        Active: {detail.outbound.stats.active}, Unconnected: {detail.outbound.stats.unconnected}, Idle: {detail.outbound.stats.idle},
        Error: {detail.outbound.stats.error}, Attempted: {detail.outbound.stats.attempted},
        Latency RTT: {detail.outbound.stats.latencyRtt}, Throughput: {detail.outbound.stats.throughput}
      </p>

      {/* ==== Outbound Ports ==== */}
      <h3>Outbound Ports</h3>
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ display: 'inline-block', marginRight: '1rem' }}>Open</h4>
        <button onClick={() => setShowOutboundModal(true)} style={{ marginRight: '0.5rem' }}>
          + Open Outbound Port
        </button>
        <button 
          onClick={() => {
            setFilterDirection("1");
            setShowStatusFilterModal(true);
          }}
          style={{ marginRight: '0.5rem' }}
        >
          Close by Status
        </button>
        <button onClick={() => handleCloseNotActivePorts(1)}>
          Close Non-Active
        </button>
      </div>
      {renderOutboundModal()}
      {renderPortTable(detail.outbound.ports.open, 1)}

      <h4>Closed</h4>
      {renderPortTable(detail.outbound.ports.closed, 1)}

      {/* ==== Edit Modal ==== */}
      {renderEditModal()}
      
      {/* ==== Status Filter Modal ==== */}
      {renderStatusFilterModal()}

      <Link to={`/namespace/${namespaceName}`} style={{ display: 'block', marginTop: '2rem' }}>
        Back to Workloads List
      </Link>

      <h3>Raw Output:</h3>
      <pre>{rawData}</pre>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    minWidth: '350px',
    maxWidth: '600px'
  }
};

export default WorkloadDetailComponent;