import { Tabs } from "@skuber/components";

import { PortDirection } from "@/models";

const tabs = [
  {
    id: PortDirection.INBOUND,
    label: PortDirection.INBOUND,
  },
  {
    id: PortDirection.OUTBOUND,
    label: PortDirection.OUTBOUND,
  },
];

export const WorkloadTabs = ({
  onChangeTab,
}: {
  onChangeTab?: (id: string) => void;
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
      }}
    />
  );
};
