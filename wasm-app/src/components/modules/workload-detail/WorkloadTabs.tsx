import { SxProps, Tabs as MuiTabs, Tab } from "@mui/material";

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
  value,
}: {
  onChangeTab: (id: string) => void;
  sx?: SxProps;
  value: string;
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onChangeTab(newValue);
  };
  return (
    <MuiTabs
      value={value}
      onChange={handleChange}
      sx={{
        minHeight: "auto",
        ".MuiTabs-flexContainer": {
          gap: "20px",
          paddingY: "4px",
          marginBottom: "20px",
        },
        ".MuiButtonBase-root": {
          typography: "h2",
          minHeight: "24px",
          minWidth: "78px",
          padding: 0,
          textTransform: "none",
          color: "text.tertiary",

          "&.Mui-selected": {
            color: "text.default",
          },
        },
        ".MuiTabs-indicator": {
          display: "none",
        },
        ...sx,
      }}
    >
      {tabs.map((tab) => (
        <Tab
          sx={{
            ".MuiTouchRipple-root": {
              display: "none",
            },
          }}
          label={tab.label}
          value={tab.id}
          key={tab.id}
        />
      ))}
    </MuiTabs>
  );
};
