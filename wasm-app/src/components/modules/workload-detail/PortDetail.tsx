import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { Port, SourceType } from "@/models";

const ShadedBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "background.shaded",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}
  >
    {children}
  </Box>
);

export const PortDetail = ({ record }: { record: Port }) => {
  const isOpen = !!record.accessSources?.length;

  return (
    <Box
      sx={{
        border: "none !important",
        "&>div": {
          p: "20px",
          borderColor: "action.disabledBackground",
        },
      }}
    >
      {isOpen && (
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="caption" color="text.tertiary">
            {`Connected sources (${record.sourceNumber})`}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(record.accessSources || []).map(({ ip, comment }: SourceType) => (
              <Box
                key={ip}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography variant="body1" color="text.primary">
                  {ip}
                </Typography>
                <ShadedBox>
                  <Typography variant="body2" color="text.primary">
                    {comment}
                  </Typography>
                </ShadedBox>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          borderTop: isOpen ? "1px solid" : "",
          borderColor: "border.elevated",
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 2.5 }}>
          {[
            {
              label: isOpen ? "Last connection" : "Last Connection attempts",
              value: record.lastConnectionDate,
            },
            { label: "Last Src IP", value: record.lastConnectionEndpoint },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Typography variant="caption" color="text.tertiary">
                {label}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="caption" color="text.tertiary">
            {isOpen ? "Last Connection Log" : "Last Connection attempts Log"}
          </Typography>
          <ShadedBox>
            <Typography
              variant="body2"
              color="text.primary"
              fontFamily={"Roboto Mono"}
            >
              {record.lastConnectionLog}
            </Typography>
          </ShadedBox>
        </Box>
      </Box>
    </Box>
  );
};
