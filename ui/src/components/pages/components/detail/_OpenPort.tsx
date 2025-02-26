import { Box } from "@mui/material";
import { Button, Typography } from "@skuber/components";
import { AddIcon } from "../../../icons/AddIcon";
import { EditIcon } from "../../../icons/EditIcon";
import { CollapsibleTable } from "./_CollapsibleTable";
import { workloadDetail } from "./data";
import { PortDetail } from "./_PortDetail";

const columns = [
  {
    id: "portNumber",
    label: "Number",
    sortable: false,
    width: 84,
  },
  {
    id: "status",
    label: "Status",
    sortable: false,
    width: 107,
  },
  {
    id: "source",
    label: "Source",
    sortable: false,
    width: 82,
  },
  {
    id: "access",
    label: "Access ",
    sortable: false,
    width: 136,
    render: (record: any) => (
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Typography variant="b2_r" color="text.primary">
          {record.access}
        </Typography>
        <EditIcon size={16} />
      </Box>
    ),
  },
  {
    id: "close",
    label: "",
    sortable: false,
    width: 84,
    render: (record: any) => (
      <Typography variant="b2_r" color="primary.dark">
        Close
      </Typography>
    ),
  },
];

export const OpenPort = () => {
  // TODO
  const data = workloadDetail.ports.inbound.open.map((el) => ({
    ...el,
    portNumber: el.isRange ? `${el?.portRange?.start} ~ ${el?.portRange?.end}` : el.portNumber,
    status: el.status,
    source: el.source?.length || "-",
    access: "Allow all access ",
    sourceDetail: el.source,
  }));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "4px",
          marginBottom: "12px",
        }}
      >
        <Typography variant="subtitle1" component={"p"}>
          {`Open (${workloadDetail.ports.inbound.open.length})`}
        </Typography>
        <Button
          variant="outlined"
          size="extraSmall"
          sx={{
            width: "94px",
            height: "24px",
          }}
        >
          <AddIcon size={16} />
          Open Port
        </Button>
      </Box>
      <CollapsibleTable
        columns={columns}
        data={data}
        sx={{
          maxWidth: "472px",
        }}
        renderDetails={(record) => (record.sourceDetail ? <PortDetail record={record} /> : undefined)}
      />
    </>
  );
};
