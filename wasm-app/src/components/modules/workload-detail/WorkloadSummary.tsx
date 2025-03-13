import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { PORT_STATUS_MAP } from "@/constants";
import { StatsType, Stats } from "@/models";
import { useCommonStore } from "@/store";

export type WorkloadSummaryProps = {
  stats: StatsType;
};

export const WorkloadSummary = ({ stats }: WorkloadSummaryProps) => {
  const { selectedNamespace } = useCommonStore();

  const stylesByType = {
    status: { variant: "subtitle3", gap: "12px" },
    metric: { variant: "body3", gap: "8px" },
  };

  const statistics = Object.values(Stats).map((status) => ({
    title: PORT_STATUS_MAP[status].label,
    value: stats[status],
    color: PORT_STATUS_MAP[status].color,
    ...stylesByType.status,
  }));

  const metrics = [
    { title: "Namespace", value: selectedNamespace },
    { title: "Latency rtt", value: stats.latencyRtt },
    { title: "Throughput", value: stats.throughput },
  ].map((metric) => ({
    ...metric,
    color: "text.primary",
    ...stylesByType.metric,
  }));

  return (
    <Box
      sx={{
        backgroundColor: "background.shaded",
        borderRadius: 1,
        p: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: "24px 12px",
        mb: 4,
      }}
    >
      {[...statistics, ...metrics].map(
        ({ title, value, color, variant, gap }, index) => (
          <Box
            key={index}
            sx={{
              width: 78.4,
              display: "flex",
              flexDirection: "column",
              gap,
            }}
          >
            <Typography
              variant="caption"
              component="p"
              sx={{ color: "text.secondary" }}
            >
              {title}
            </Typography>
            <Typography
              variant={variant}
              component="p"
              sx={{ color: value ? color : "status.idle" }}
            >
              {value || "-"}
            </Typography>
          </Box>
        ),
      )}
    </Box>
  );
};
