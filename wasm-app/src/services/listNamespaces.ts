type NamespaceType = {
  id: number;
  namespaceName: string;
};

type NamespaceData = {
  raw: string;
  result: NamespaceType[];
};

export function wasmListNamespace(): Promise<NamespaceData> {
  return new Promise((resolve, reject) => {
    try {
      const raw = window.listNamespace();
      const parsed = JSON.parse(raw);
      resolve({ raw, result: parsed.result });
    } catch (error) {
      reject(error);
    }
  });
}
