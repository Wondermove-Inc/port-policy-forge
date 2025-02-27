import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { PortDetail } from "./PortDetail";
import { workloadDetail } from "./data";
import { CloseIcon } from "../../../../icons/CloseIcon";
import { WarningIcon } from "../../../../icons/WarningIcon";
import { CollapsibleTable } from "./CollapsibleTable";

const columns = [
  {
    id: "portNumber",
    label: "Number",
    sortable: false,
    width: 112,
  },
  {
    id: "risk",
    label: "Risk",
    sortable: false,
    width: 112,
  },
  {
    id: "type",
    label: "Type",
    sortable: false,
    width: 92,
  },
  {
    id: "count",
    label: "Count ",
    sortable: false,
    width: 64,
  },
  {
    id: "open",
    label: "",
    sortable: false,
    width: 68,
    render: (record: any) => (
      <Typography variant="b2_r" color="primary.dark">
        Open
      </Typography>
    ),
  },
  {
    id: "close",
    label: "",
    sortable: false,
    width: 24,
    render: (record: any) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CloseIcon size={16} />
      </Box>
    ),
  },
];

export const ClosePort = () => {
  const data = workloadDetail.ports.inbound.closed.map((el) => ({
    ...el,
    risk: el.risk,
    type: el.type,
    count: el.count || 0,
  }));

  return (
    <>
      <Box
        sx={{
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          paddingY: "4px",
          gap: "8px",
        }}
      >
        <Typography
          variant="subtitle1"
          component={"span"}
          sx={{
            paddingY: "4px",
          }}
        >
          {`Closed Port Attempted (${workloadDetail.ports.inbound.closed.length || 0})`}
        </Typography>
        <WarningIcon size={20} />
      </Box>
      <CollapsibleTable
        columns={columns}
        data={data}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) => <PortDetail record={record} />}
      />
    </>
  );
};
