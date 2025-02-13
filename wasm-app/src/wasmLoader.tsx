let wasmPromise: Promise<WebAssembly.Instance> | null = null;

export function loadWasm(): Promise<WebAssembly.Instance> {
  if (!wasmPromise) {
    wasmPromise = (async () => {
      const goWasm = new (window as any).Go();
      const response = await fetch('../public/main.wasm');
      const { instance } = await WebAssembly.instantiateStreaming(
        response,
        goWasm.importObject
      );
      goWasm.run(instance);
      return instance;
    })();
  }
  return wasmPromise;
}