import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

declare global {
  interface Window {
    getWorkloadDetail: (workloadId: string) => string;
  }
}

type PortRange = {
  start: string;
  end: string;
};

type Port = {
  id: number;
  isRange: boolean;
  portNumber?: number | null;
  portRange?: PortRange | null;
  status: number;
  direction: string;
  isOpen: boolean;
  risk: number;
  type: string;
  count: number | null;
  lastConnection: string | null;
  lastSrcIp: string | null;
  lastConnectionLog: string | null;
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

type WorkloadDetail = {
  uuid: string;
  workloadName: string;
  kind: string;
  stats: Stats;
  ports: {
    inbound: PortDetailGroup;
    outbound: PortDetailGroup;
  };
};

function wasmGetWorkloadDetail(workloadId: string): Promise<WorkloadDetail> {
  return new Promise((resolve, reject) => {
    try {
      const res = window.getWorkloadDetail(workloadId);
      const parsed = JSON.parse(res);
      console.log("Parsed workload detail:", parsed);
      resolve(parsed);
    } catch (error) {
      reject(error);
    }
  });
}

const WorkloadDetailComponent = () => {
  const { namespaceName, workloadId } = useParams<{ namespaceName: string; workloadId: string }>();
  const [detail, setDetail] = useState<WorkloadDetail | null>(null);
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workloadId) {
      wasmGetWorkloadDetail(workloadId)
        .then((data) => {
          setDetail(data);
          setRawData(JSON.stringify(data, null, 2));
          setLoading(false);
        })
        .catch((err) => {
          setError(String(err));
          setLoading(false);
        });
    }
  }, [workloadId]);

  if (loading) return <p>Loading workload detail for {workloadId}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!detail) return <p>No detail available.</p>;

  // 테이블의 헤더 렌더링을 위한 헬퍼
  const renderTableHeader = () => (
    <thead>
      <tr>
        <th>ID</th>
        <th>isRange</th>
        <th>portNumber</th>
        <th>portRange</th>
        <th>status</th>
        <th>direction</th>
        <th>isOpen</th>
        <th>risk</th>
        <th>type</th>
        <th>count</th>
        <th>lastConnection</th>
        <th>lastSrcIp</th>
        <th>lastConnectionLog</th>
      </tr>
    </thead>
  );

  // 포트 배열을 받아 테이블 행들을 렌더링
  const renderPortRows = (ports: Port[]) => (
    <tbody>
      {ports.map((port) => (
        <tr key={port.id}>
          <td>{port.id}</td>
          <td>{port.isRange ? "true" : "false"}</td>
          <td>{port.portNumber ?? "N/A"}</td>
          <td>
            {port.portRange
              ? `${port.portRange.start} - ${port.portRange.end}`
              : "N/A"}
          </td>
          <td>{port.status}</td>
          <td>{port.direction}</td>
          <td>{port.isOpen ? "true" : "false"}</td>
          <td>{port.risk}</td>
          <td>{port.type}</td>
          <td>{port.count ?? "N/A"}</td>
          <td>{port.lastConnection ?? "N/A"}</td>
          <td>{port.lastSrcIp ?? "N/A"}</td>
          <td>{port.lastConnectionLog ?? "N/A"}</td>
        </tr>
      ))}
    </tbody>
  );

  // 테이블 전체를 렌더링하는 헬퍼
  const renderPortTable = (ports: Port[]) => {
    if (ports.length === 0) {
      return <p>No ports found.</p>;
    }
    return (
      <table border={1} cellPadding={4} style={{ marginBottom: '1rem' }}>
        {renderTableHeader()}
        {renderPortRows(ports)}
      </table>
    );
  };

  return (
    <div>
      <h2>Workload Detail: {namespaceName}-workload-1</h2>
      <p><strong>Kind:</strong> {detail.kind}</p>
      <p>
        <strong>Stats:</strong> Active: {detail.stats.active}, Unconnected:{" "}
        {detail.stats.unconnected}, Idle: {detail.stats.idle}, Error:{" "}
        {detail.stats.error}, Attempted: {detail.stats.attempted},{" "}
        Latency RTT: {detail.stats.latencyRtt}, Throughput:{" "}
        {detail.stats.throughput}
      </p>

      {/* Inbound Ports */}
      <h3>Inbound Ports</h3>
      <h4>Open</h4>
      {renderPortTable(detail.ports.inbound.open)}
      <h4>Closed</h4>
      {renderPortTable(detail.ports.inbound.closed)}

      {/* Outbound Ports */}
      <h3>Outbound Ports</h3>
      <h4>Open</h4>
      {renderPortTable(detail.ports.outbound.open)}
      <h4>Closed</h4>
      {renderPortTable(detail.ports.outbound.closed)}

      <Link to={`/namespace/${namespaceName}`}>Back to Workloads List</Link>
      <h3>Raw Output:</h3>
      <pre>{rawData}</pre>
    </div>
  );
};

export default WorkloadDetailComponent;
