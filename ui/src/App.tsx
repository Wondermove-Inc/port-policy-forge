import { Box } from "@mui/material";
import { ThemeProvider } from "@skuber/theme";

import { customTheme } from "./theme";

import { Header } from "@/components/layout/Header";
import { Home } from "@/pages/Home";

import "@skuber/theme/styles/global.css";
import "./index.css";

export default function App() {
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
        <Home />
      </Box>
    </ThemeProvider>
  );
}
