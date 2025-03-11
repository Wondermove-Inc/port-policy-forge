import { useEffect, useState } from "react";

import "../public/wasm_exec.js";
import { Box, Snackbar } from "@mui/material";
import { ThemeProvider } from "@skuber/theme";
import { Routes, Route } from "react-router-dom";

import { Home } from "@/pages/Home.tsx";
import Namespace from "@/pages/Namespace";
import Workloads from "@/pages/Workload.tsx";
import WorkloadDetail from "@/pages/WorkloadDetail.tsx";
import { customTheme } from "@/theme";
import { loadWasm } from "./wasmLoader.tsx";

import { Header } from "@/components/layout/Header";
import { PageLoading } from "@/components/layout/PageLoading.tsx";
import { CloseIcon } from "@/components/icons/CloseIcon.tsx";

import "@skuber/theme/styles/global.css";
import "./index.css";
import { WasmProvider } from "./wasm.provider.tsx";

const App = () => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);

  useEffect(() => {
    console.log("wasm loading ...");
    loadWasm()
      .then(() => setIsWasmLoaded(true))
      .catch((err) => {
        console.error("WASM 로딩 에러:", err);
      });
  }, []);

  return (
    <ThemeProvider theme={customTheme}>
      <WasmProvider>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={true}
          onClose={() => {
            console.log("hihi");
          }}
          message="I love snacks"
          action={
            <CloseIcon
              onClick={() => {
                console.log("hihi");
              }}
            />
          }
        />
        <Header />
        <Box
          sx={{
            backgroundColor: "background.modal",
            width: "100%",
            minHeight: "calc(100vh - 56px)",
            position: "relative",
          }}
        >
          {isWasmLoaded ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/namespace" element={<Namespace />} />
              <Route path="/namespace/:namespaceName" element={<Workloads />} />
              <Route
                path="/namespace/:namespaceName/workload/:workloadId/ports"
                element={<WorkloadDetail />}
              />
            </Routes>
          ) : (
            <PageLoading />
          )}
        </Box>
      </WasmProvider>
    </ThemeProvider>
  );
};

export default App;
