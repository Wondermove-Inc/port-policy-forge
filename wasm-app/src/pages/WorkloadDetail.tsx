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
  portNumber?: number;
  portRange?: PortRange;
  status: number;
  direction: string;
  isOpen: boolean;
  risk: number;
  type: string;
};

type PortsData = {
  open: Port[];
  closed: Port[];
};

type WorkloadDetail = {
  uuid: string;
  workloadName: string;
  kind: string;
  stats: {
    active: number;
    unconnected: number;
    idle: number;
    error: number;
    attempted: number;
    latencyRtt: number | null;
    throughput: number;
  };
  ports: PortsData;
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

const WorkloadDetail = () => {
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

  return (
    <div>
      <h2>Workload Detail: {namespaceName}-workload-1</h2>
      <p>
        <strong>Kind:</strong> {detail.kind}
      </p>
      <p>
        <strong>Stats:</strong> Active: {detail.stats.active}, Unconnected: {detail.stats.unconnected}, Idle: {detail.stats.idle}, Error: {detail.stats.error}, Attempted: {detail.stats.attempted}, Latency RTT: {detail.stats.latencyRtt}, Throughput: {detail.stats.throughput}
      </p>
      <h3>Ports:</h3>
      <div>
        <h4>Open Ports</h4>
        {detail.ports.open && detail.ports.open.length > 0 ? (
          <ul>
            {detail.ports.open.map((port) => (
              <li key={port.id}>
                <strong>ID:</strong> {port.id} | <strong>Port:</strong>{" "}
                {port.isRange
                  ? `${port.portRange?.start} - ${port.portRange?.end}`
                  : port.portNumber} | <strong>Status:</strong> {port.status} |{" "}
                <strong>Direction:</strong> {port.direction}
              </li>
            ))}
          </ul>
        ) : (
          <p>No open ports.</p>
        )}
      </div>
      <div>
        <h4>Closed Ports</h4>
        {detail.ports.closed && detail.ports.closed.length > 0 ? (
          <ul>
            {detail.ports.closed.map((port) => (
              <li key={port.id}>
                <strong>ID:</strong> {port.id} | <strong>Port:</strong>{" "}
                {port.isRange
                  ? `${port.portRange?.start} - ${port.portRange?.end}`
                  : port.portNumber} | <strong>Status:</strong> {port.status} |{" "}
                <strong>Direction:</strong> {port.direction}
              </li>
            ))}
          </ul>
        ) : (
          <p>No closed ports.</p>
        )}
      </div>
      <Link to={`/namespace/${namespaceName}`}>Back to Workloads List</Link>
      <h3>Raw Output:</h3>
      <pre>{rawData}</pre>
    </div>
  );
};

export default WorkloadDetail;
