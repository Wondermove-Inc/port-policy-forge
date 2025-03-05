import { SxProps } from "@mui/material";
import { Tabs } from "@skuber/components";

import { PortDirection } from "@/models";

const tabs = [
  {
    id: PortDirection.INBOUND,
    label: "Inbound",
  },
  {
    id: PortDirection.OUTBOUND,
    label: "Outbound",
  },
];

export const WorkloadTabs = ({
  onChangeTab,
  sx = {},
}: {
  onChangeTab?: (id: string) => void;
  sx?: SxProps;
}) => {
  return (
    <Tabs
      data={tabs}
      onChangeTab={onChangeTab}
      sx={{
        ".MuiTabs-flexContainer": {
          gap: "20px",
          paddingY: "4px",
          marginBottom: "16px",
          ".Mui-selected": {
            color: "text.primary",
          },
        },
        ".MuiButtonBase-root": {
          typography: "h2",
          minHeight: "24px",
          minWidth: "78px",
          padding: 0,
        },
        ".MuiTabs-indicator": {
          display: "none",
        },
        ...sx,
      }}
    />
  );
};
