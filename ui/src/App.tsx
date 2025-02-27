import { Box } from "@mui/material";
import { defaultTheme, ThemeProvider } from "@skuber/theme";

import { Header } from "./components/layout/Header";

import "@skuber/theme/styles/global.css";
import "./index.css";
import { ViewFilter } from "./components/molecules/ViewFilter";
import { EyeIcon } from "./components/icons/EyeIcon";
import { WorkloadDetail } from "./components/pages/WorkloadDetail";

export default function App() {
  return (
    <ThemeProvider
      theme={{
        ...defaultTheme,
        typography: {
          ...defaultTheme.typography,
          b1_m: {
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
            color: "white",
          },
          label_m: {
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "16px",
          },
          b2_r: {
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "18px",
          },
          body3: {
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: "20px",
          },
          subtitle3: {
            fontSize: "16px",
            fontWeight: 800,
            lineHeight: "20px",
          },
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
        <EyeIcon />
        <WorkloadDetail />
      </Box>
    </ThemeProvider>
  );
}
