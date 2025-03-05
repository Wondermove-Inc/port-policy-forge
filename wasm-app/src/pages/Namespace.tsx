import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

declare global {
  interface Window {
    listNamespace: () => string;
  }
}

type NamespaceType = {
  id: number;
  namespaceName: string;
};

type NamespaceData = {
  raw: string;
  result: NamespaceType[];
};

function wasmListNamespace(): Promise<NamespaceData> {
  return new Promise((resolve, reject) => {
    try {
      const raw = window.listNamespace();
      const parsed = JSON.parse(raw);
      console.log("Parsed output:", parsed);
      resolve({ raw, result: parsed.result });
    } catch (error) {
      reject(error);
    }
  });
}

const Namespace = () => {
  const [namespaces, setNamespaces] = useState<NamespaceType[]>([]);
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    wasmListNamespace()
      .then((data) => {
        setNamespaces(data.result);
        setRawData(data.raw);
        console.log(data.raw);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading namespaces...</p>;
  if (error) return <p>Error: {error}</p>;

  const prettyRawData = rawData
    ? JSON.stringify(JSON.parse(rawData), null, 2)
    : "";

  return (
    <div>
      <h2>Namespace List</h2>
      <ul>
        {namespaces.map((ns) => (
          <li key={ns.id}>
            <Link to={`/namespace/${ns.namespaceName}`}>
              {ns.namespaceName}
            </Link>
          </li>
        ))}
      </ul>
      <h3>Raw Output:</h3>
      <pre>{prettyRawData}</pre>
    </div>
  );
};

export default Namespace;
