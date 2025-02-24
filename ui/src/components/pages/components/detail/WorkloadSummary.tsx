import { Box } from "@mui/material";
import { Typography } from "@skuber/components";
import { WORKLOAD_STATUS } from "../../../../share/constants/common";
import { useMemo } from "react";

export const WorkloadSummary = () => {
  const stylesByType = {
    status: { variant: "subtitle3", gap: "12px" },
    metric: { variant: "body3", gap: "8px" },
  };

  const workloadData = useMemo(
    () => [
      { title: WORKLOAD_STATUS.active.label, value: "2", color: WORKLOAD_STATUS.active.color, ...stylesByType.status },
      {
        title: WORKLOAD_STATUS.unconnected.label,
        value: "65,536",
        color: WORKLOAD_STATUS.unconnected.color,
        ...stylesByType.status,
      },
      { title: WORKLOAD_STATUS.idle.label, value: "", color: WORKLOAD_STATUS.idle.color, ...stylesByType.status },
      { title: WORKLOAD_STATUS.error.label, value: "", color: WORKLOAD_STATUS.error.color, ...stylesByType.status },
      {
        title: WORKLOAD_STATUS.attempted.label,
        value: "",
        color: WORKLOAD_STATUS.attempted.color,
        ...stylesByType.status,
      },
      { title: "Namespace", value: "Default", color: "text.primary", ...stylesByType.metric },
      { title: "Latency rtt", value: "1.39ms", color: "text.primary", ...stylesByType.metric },
      { title: "Throughput", value: "469.89MiB/s", color: "text.primary", ...stylesByType.metric },
    ],
    []
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.shaded",
        borderRadius: 1,
        p: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: "24px 12px",
        maxWidth: 440,
      }}
    >
      {workloadData.map(({ title, value, color, variant, gap }, index) => (
        <Box key={index} sx={{ minWidth: 78.4, display: "flex", flexDirection: "column", gap }}>
          <Typography variant="caption" component="p" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
          <Typography variant={variant as any} component="p" sx={{ color: value ? color : "status.idle" }}>
            {value || "-"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
