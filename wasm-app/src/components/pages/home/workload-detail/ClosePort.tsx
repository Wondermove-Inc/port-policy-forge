import { Box } from "@mui/material";
import { Typography } from "@skuber/components";

import { PortDetail } from "./PortDetail";

import { CloseIcon } from "@/components/icons/CloseIcon";
import { WarningIcon } from "@/components/icons/WarningIcon";
import { CollapsibleTable } from "@/components/modules/CollapsibleTable";
import { Port } from "@/models";

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
    render: () => (
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
    render: () => (
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

type ClosePortProps = {
  data: Port[];
};

export const ClosePort = ({ data }: ClosePortProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingY: "4px",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <Typography
          variant="subtitle1"
          component={"span"}
          sx={{
            paddingY: "6.5px",
          }}
        >
          {`Closed Port Attempted (${data?.length || 0})`}
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
    </Box>
  );
};
