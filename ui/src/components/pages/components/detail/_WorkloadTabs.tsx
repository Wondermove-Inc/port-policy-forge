import { Tabs } from "@skuber/components";
import { defaultTheme } from "@skuber/theme";

import { WorkloadDivided } from "../../../../share/constants/common";

const tabs = [
  {
    id: WorkloadDivided.INBOUND,
    label: WorkloadDivided.INBOUND,
  },
  {
    id: WorkloadDivided.OUTBOUND,
    label: WorkloadDivided.OUTBOUND,
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
        },
        ".MuiButtonBase-root": {
          ...defaultTheme.typography.h2,
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
