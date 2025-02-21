import { Box } from "@mui/material";
import { defaultTheme, ThemeProvider } from "@skuber/theme";

import { Header } from "./components/layout/Header";

import "@skuber/theme/styles/global.css";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Header />
      <Box
        sx={{
          backgroundColor: "background.secondary",
          width: "100%",
          minHeight: "calc(100vh - 56px)",
        }}
      ></Box>
    </ThemeProvider>
  );
}
