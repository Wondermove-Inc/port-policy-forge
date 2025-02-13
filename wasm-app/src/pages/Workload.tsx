import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

declare global {
  interface Window {
    listWorkloads: (namespace: string) => string;
  }
}

type WorkloadType = {
  id: number;
  workloadName: string;
};

type WorkloadsData = {
  raw: string;
  result: WorkloadType[];
};

function wasmListWorkloads(namespace: string): Promise<WorkloadsData> {
  return new Promise((resolve, reject) => {
    try {
      const res = window.listWorkloads(namespace);
      const parsed = JSON.parse(res);
      console.log("Parsed workloads:", parsed);
      resolve({ raw: res, result: parsed.result });
    } catch (error) {
      reject(error);
    }
  });
}

const Workloads = () => {
  const { namespaceName } = useParams<{ namespaceName: string }>();
  const [workloads, setWorkloads] = useState<WorkloadType[]>([]);
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

  // Pretty print raw JSON data
  const prettyRawData = rawData ? JSON.stringify(JSON.parse(rawData), null, 2) : "";

  return (
    <div>
      <h2>Workloads for Namespace: {namespaceName}</h2>
      <ul>
        {workloads.map((w) => (
          <li key={w.id}>
            <Link to={`/namespace/${namespaceName}/workload/${w.id}/ports`}>
              {w.workloadName}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/namespace">Back to Namespace List</Link>
      <h3>Raw Output:</h3>
      <pre>{prettyRawData}</pre>
    </div>
  );
};

export default Workloads;
