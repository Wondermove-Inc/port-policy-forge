import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { Port } from "@/models";

const ShadedBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "background.shaded",
    }}
  >
    {children}
  </Box>
);

export const PortDetail = ({ record }: { record: Port }) => {
  const isOpen = record.isOpen;

  return (
    <Box>
      {isOpen && (
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="caption" color="text.tertiary">
            {`Connected sources (${record.source})`}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(record.source || []).map(
              ({ ip, port }: { ip: string; port: number }) => (
                <Box
                  key={`${ip}-${port}`}
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography variant="body1" color="text.primary">
                    {`${ip}/${port}`}
                  </Typography>
                  <ShadedBox>
                    <Typography variant="body2" color="text.primary">
                      Working on deploying a front-end application, making it
                      accessible only from an internal test server.
                    </Typography>
                    <Typography variant="caption" color="text.tertiary">
                      2023.02.21, 11:19:22 (GMT +9)
                    </Typography>
                  </ShadedBox>
                </Box>
              ),
            )}
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
              value: record.lastConnection,
            },
            { label: "Last Src IP", value: record.lastSrcIp },
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
            <Typography variant="body2" color="text.primary">
              {record.lastConnectionLog}
            </Typography>
          </ShadedBox>
        </Box>
      </Box>
    </Box>
  );
};
