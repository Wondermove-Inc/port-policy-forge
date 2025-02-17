import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

declare global {
  interface Window {
    listWorkloads: (namespace: string) => string;
  }
}

type Relation = {
  workloadId: string;
  status: number;
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
  kind: string;
  from: Relation[];
  to: Relation[];
  // stats: Stats;
  // ports: {
  //   open: Port[];
  //   closed: Port[];
  // };
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

  const prettyRawData = rawData ? JSON.stringify(JSON.parse(rawData), null, 2) : "";

  return (
    <div>
      <h2>Workloads for Namespace: {namespaceName}</h2>
      {workloads.map((w) => (
        <div key={w.uuid} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <p><strong>UUID:</strong> {w.uuid}</p>
          <p><strong>Name:</strong> {w.workloadName}</p>
          <p><strong>Kind:</strong> {w.kind}</p>
          <p><strong>From:</strong> {JSON.stringify(w.from)}</p>
          <p><strong>To:</strong> {JSON.stringify(w.to)}</p>
          <p><strong>Stats:</strong> {JSON.stringify(w.stats)}</p>
          <Link to={`/namespace/${namespaceName}/workload/${w.uuid}/ports`}>
            View Port Details
          </Link>
        </div>
      ))}
      <Link to="/namespace">Back to Namespace List</Link>
      <h3>Raw Output:</h3>
      <pre>{prettyRawData}</pre>
    </div>
  );
};

export default Workloads;
