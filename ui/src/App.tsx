import { Box } from "@mui/material";
import { defaultTheme, ThemeProvider } from "@skuber/theme";

import { Header } from "./components/layout/Header";

import "@skuber/theme/styles/global.css";
import "./index.css";
import { ViewFilter } from "./components/molecules/ViewFilter";

export default function App() {
  return (
    <ThemeProvider
      theme={{
        ...defaultTheme,
        typography: {
          ...defaultTheme.typography,
          body1Bold: {
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "16px",
          },
          captionBold: {
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "16px",
          },
        },
      }}
    >
      <Header />
      <Box
        sx={{
          backgroundColor: "background.secondary",
          width: "100%",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <ViewFilter />
      </Box>
    </ThemeProvider>
  );
}
