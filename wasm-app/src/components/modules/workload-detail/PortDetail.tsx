import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { AccessPolicy, Port, PortDirection, SourceType } from "@/models";
import { formatDateTime } from "@/utils/format";

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

export const PortDetail = ({
  record,
  open,
}: {
  record: Port;
  open: boolean;
}) => {
  const accessSourcesShown =
    record.accessPolicy !== AccessPolicy.ALLOW_ALL && open;

  const isInbound = record.direction === PortDirection.INBOUND;
  const isAllowOnly = record.accessPolicy === AccessPolicy.ALLOW_ONLY;
  return (
    <Box
      sx={{
        border: "none !important",
        "&>div": {
          p: "20px",
          borderColor: "border.elevated",
          backgroundColor: "background.shaded",
        },
      }}
    >
      {accessSourcesShown && (
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="caption" color="text.tertiary">
            {`${isAllowOnly ? "Allowed" : "Excluded"} ${isInbound ? "Sources" : "Destination"} (${record.sourceNumber})`}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(record.accessSources || []).map(
              ({ ip, comment, lastUpdatedAt }: SourceType) => (
                <Box
                  key={ip}
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography variant="body1" color="text.primary">
                    {ip}
                  </Typography>
                  {comment && (
                    <ShadedBox>
                      <Typography variant="body2" color="text.primary">
                        {comment}
                      </Typography>
                      <Typography variant="caption" color="text.tertiary">
                        {formatDateTime(lastUpdatedAt || "")}
                      </Typography>
                    </ShadedBox>
                  )}
                </Box>
              ),
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          borderTop: accessSourcesShown ? "1px solid" : "",
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
              label: open ? "Last connection" : "Last Connection attempts",
              value: record.lastConnectionDate,
            },
            {
              label: isInbound ? "Last Src IP" : "Last Dest Ip",
              value: record.lastConnectionEndpoint,
            },
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
            {open ? "Last Connection Log" : "Last Connection attempts Log"}
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
