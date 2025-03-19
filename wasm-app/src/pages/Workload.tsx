/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

declare global {
  interface Window {
    listWorkloads: (namespace: string) => string;
  }
}

type InlineWorkload = {
  uuid: string;
  workloadName: string;
  namespace: string;
  kind: string;
  usage: number;
};

type Relation = {
  workloadId: string;
  status: number;
  direction: string; 
  workload?: {
    uuid: string;
    workloadName: string;
    namespace: string;
    kind: string;
  };
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

type TrafficStats = {
  stats: Stats;
};

type Port = {
  id: number;
  isRange: boolean;
  portNumber: number | null;
  portRange: { start: string; end: string } | null;
  status: number;
  direction: string;
  source: any;
  isOpen: boolean;
  risk: number;
  type: string;
  count: any;
  lastConnection: string | null;
  lastSrcIp: string | null;
  lastConnectionLog: any;
};

type WorkloadResource = {
  uuid: string;
  workloadName: string;
  connected_workload_status: string;
  policy_setting_badge: boolean;
  kind: string;
  usage: number;
  from: Relation[];
  to: Relation[];
  inbound: TrafficStats;
  outbound: TrafficStats;
};

type WorkloadsData = {
  raw: string;
  result: WorkloadResource[];
};

function wasmListWorkloads(namespace: string): Promise<WorkloadsData> {
  return new Promise((resolve, reject) => {
    try {
      const res = window.listWorkloads(namespace);
      const parsed = JSON.parse(res);
      console.log("Parsed workloads:", parsed);
      if (!parsed.result || !Array.isArray(parsed.result)) {
        reject("Invalid response format: 'result' is missing or not an array");
      } else {
        resolve({ raw: res, result: parsed.result });
      }
    } catch (error) {
      reject(error);
    }
  });
}

function getRelationStatus(status: number): string {
  switch(status) {
    case 0: return "Active";
    case 1: return "Idle";
    case 2: return "Error";
    case 3: return "Attempted";
    default: return `Unknown (${status})`;
  }
}

// 방향에 따른 스타일 지정 함수
function getDirectionStyle(direction: string): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '0.8em',
    marginLeft: '5px',
    backgroundColor: direction === 'inbound' ? '#e1f5fe' : '#fff9c4',
    color: direction === 'inbound' ? '#0277bd' : '#f57f17',
    border: `1px solid ${direction === 'inbound' ? '#81d4fa' : '#ffee58'}`
  };
}

const Workloads = () => {
  const { namespaceName } = useParams<{ namespaceName: string }>();
  const [workloads, setWorkloads] = useState<WorkloadResource[]>([]);
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (namespaceName) {
      wasmListWorkloads(namespaceName)
        .then((data) => {
          setWorkloads(data.result);
          setRawData(data.raw);
          setLoading(false);
        })
        .catch((err) => {
          setError(String(err));
          setLoading(false);
        });
    }
  }, [namespaceName]);

  if (loading) return <p>Loading workloads for {namespaceName}...</p>;
  if (error) return <p>Error: {error}</p>;

  const prettyRawData = rawData
    ? JSON.stringify(JSON.parse(rawData), null, 2)
    : "";

  return (
    <div>
      <h2>Workloads for Namespace: {namespaceName}</h2>
      {workloads.map((w) => (
        <div key={w.uuid} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{w.workloadName}</h3>
          <div>
            <p><strong>UUID:</strong> {w.uuid}</p>
            <p><strong>Kind:</strong> {w.kind}</p>
            <p><strong>Status:</strong> {w.connected_workload_status}</p>
            <p><strong>CPU Usage:</strong> {(w.usage * 100).toFixed(1)}%</p>
            
            <h4>Inbound Connections:</h4>
            {w.from.length > 0 ? (
              <ul>
                {w.from.map((relation, idx) => (
                  <li key={`from-${idx}`}>
                    {relation.workload ? (
                      <>
                        <strong>From External: </strong>
                        <span style={{ color: '#0066cc' }}>
                          {relation.workload.workloadName}
                        </span> 
                        <span style={{ color: '#666', fontSize: '0.9em' }}>
                          ({relation.workload.namespace})
                        </span>
                        <span> - {getRelationStatus(relation.status)}</span>
                        <span style={getDirectionStyle(relation.direction)}>
                          {relation.direction}
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>From: </strong>
                        <span>{relation.workloadId}</span>
                        <span> - {getRelationStatus(relation.status)}</span>
                        <span style={getDirectionStyle(relation.direction)}>
                          {relation.direction}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No inbound connections</p>
            )}
            
            <h4>Outbound Connections:</h4>
            {w.to.length > 0 ? (
              <ul>
                {w.to.map((relation, idx) => (
                  <li key={`to-${idx}`}>
                    {relation.workload ? (
                      <>
                        <strong>To External: </strong>
                        <span style={{ color: '#0066cc' }}>
                          {relation.workload.workloadName}
                        </span>
                        <span style={{ color: '#666', fontSize: '0.9em' }}>
                          ({relation.workload.namespace})
                        </span>
                        <span> - {getRelationStatus(relation.status)}</span>
                        <span style={getDirectionStyle(relation.direction)}>
                          {relation.direction}
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>To: </strong>
                        <span>{relation.workloadId}</span>
                        <span> - {getRelationStatus(relation.status)}</span>
                        <span style={getDirectionStyle(relation.direction)}>
                          {relation.direction}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No outbound connections</p>
            )}

            <h4>Traffic Statistics:</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <h5>Inbound</h5>
                <p>Active: {w.inbound.stats.active}</p>
                <p>Unconnected: {w.inbound.stats.unconnected}</p>
                <p>Idle: {w.inbound.stats.idle}</p>
                <p>Error: {w.inbound.stats.error}</p>
                <p>Latency: {w.inbound.stats.latencyRtt !== null ? `${w.inbound.stats.latencyRtt}ms` : 'N/A'}</p>
                <p>Throughput: {w.inbound.stats.throughput.toFixed(2)} KB/s</p>
              </div>
              <div>
                <h5>Outbound</h5>
                <p>Active: {w.outbound.stats.active}</p>
                <p>Unconnected: {w.outbound.stats.unconnected}</p>
                <p>Idle: {w.outbound.stats.idle}</p>
                <p>Error: {w.outbound.stats.error}</p>
                <p>Latency: {w.outbound.stats.latencyRtt !== null ? `${w.outbound.stats.latencyRtt}ms` : 'N/A'}</p>
                <p>Throughput: {w.outbound.stats.throughput.toFixed(2)} KB/s</p>
              </div>
            </div>

            <Link to={`/namespace/${namespaceName}/workload/${w.uuid}/ports`}>
              View Port Details
            </Link>
          </div>
        </div>
      ))}
      <Link to="/namespace">Back to Namespace List</Link>
      
      <details>
        <summary>Raw Data</summary>
        <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
          {JSON.stringify(JSON.parse(rawData), null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default Workloads;