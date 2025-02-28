import { useEffect, useState } from "react";

import "../public/wasm_exec.js";
import { Box } from "@mui/material";
import { ThemeProvider } from "@skuber/theme";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home.tsx";
import Namespace from "./pages/Namespace";
import Workloads from "./pages/Workload.tsx";
import WorkloadDetail from "./pages/WorkloadDetail.tsx";
import { customTheme } from "./theme";
import { loadWasm } from "./wasmLoader.tsx";

import { Header } from "@/components/layout/Header";

import "@skuber/theme/styles/global.css";
import "./index.css";

declare global {
  interface Window {
    Go: any;
  }
}

const App = () => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);

  useEffect(() => {
    loadWasm()
      .then(() => setIsWasmLoaded(true))
      .catch((err) => {
        console.error("WASM 로딩 에러:", err);
      });
  }, []);

  if (!isWasmLoaded) {
    return <p>Loading WASM...</p>;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Header />
      <Box
        sx={{
          backgroundColor: "background.secondary",
          width: "100%",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/namespace" element={<Namespace />} />
          <Route path="/namespace/:namespaceName" element={<Workloads />} />
          <Route
            path="/namespace/:namespaceName/workload/:workloadId/ports"
            element={<WorkloadDetail />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
