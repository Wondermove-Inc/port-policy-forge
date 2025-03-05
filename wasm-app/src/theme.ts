import { defaultTheme } from "@skuber/theme";

export const customTheme = {
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
    b2_m: {
      fontSize: "13px",
      fontWeight: 600,
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
    labelBold: {
      fontSize: "12px",
      fontWeight: 700,
      lineHeight: "16px",
    },
  },
};
