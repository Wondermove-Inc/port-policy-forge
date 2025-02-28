import { useMemo, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Button } from "@skuber/components";

import { WorkloadDetail } from "./WorkloadDetail";

import { Datagrid, CustomGridColDef } from "@/components/atoms/Datagrid";
import { CheckBoxIcon } from "@/components/icons/CheckBoxIcon";
import { ModalClosePort } from "@/components/modules/ModalClosePort";
import { SearchComplete } from "@/components/modules/SearchComplete";
import { useDisclosure } from "@/hooks/useDisclosure";
import { WorkListType } from "@/models";

export const WorkloadList = () => {
  const [checkedRows, setCheckedRows] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [selectedTabBound, setSelectedTabBound] = useState("inbound");
  
  const closePortModal = useDisclosure();
  const detailDrawer = useDisclosure();

  const bounds = [
    { label: "Inbound", value: "inbound" },
    { label: "Outbound", value: "outbound" },
  ];
  const columns: CustomGridColDef[] = [
    { field: "name", headerName: "Name", width: 196 },
    {
      field: "type",
      headerName: "Type",
      width: 196,
    },
    {
      field: "unconnectedPort",
      headerName: "Unconnected Port",
      width: 196,
      enableCheckBox: true,
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              color: `${row.unconnectedPort ? "status.warning" : "text.disabled"}`,
              fontWeight: "600",
            }}
          >
            {row.unconnectedPort || "-"}
          </Typography>
        );
      },
    },
    {
      field: "idlePort",
      headerName: "Idle port",
      width: 196,
      enableCheckBox: true,
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              color: `${row.idlePort ? "status.warning" : "text.disabled"}`,
              fontWeight: "600",
            }}
          >
            {row.idlePort || "-"}
          </Typography>
        );
      },
    },
    {
      field: "activePort",
      headerName: "Active port",
      width: 196,
      enableCheckBox: true,
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              color: `${row.activePort ? "interaction.primaryContrast" : "text.disabled"}`,
              fontWeight: "600",
            }}
          >
            {row.activePort || "-"}
          </Typography>
        );
      },
    },
    {
      field: "errorPort",
      headerName: "Error port",
      width: 196,
      enableCheckBox: true,
      disabled: true,
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              color: `${row.errorPort ? "status.danger" : "text.disabled"}`,
              fontWeight: "600",
            }}
          >
            {row.errorPort || "-"}
          </Typography>
        );
      },
    },
    {
      field: "closedPortAttempted",
      headerName: "Closed Port Attempted",
      width: 196,
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              color: `${row.closedPortAttempted ? "status.danger" : "text.disabled"}`,
              fontWeight: "600",
            }}
          >
            {row.closedPortAttempted || "-"}
          </Typography>
        );
      },
    },
  ];
  const datas: WorkListType = {
    inbound : [
      {
        id: 1,
        name: "Inbound",
        type: "Type Inbound",
        unconnectedPort: 2,
        idlePort: 8,
        activePort: 8,
        errorPort: 6,
        closedPortAttempted: "",
      },
      {
        id: 2,
        name: "Name Inbound 2",
        type: "Type Inbound 2",
        unconnectedPort: 3,
        idlePort: 7,
        activePort: 8,
        errorPort: 9,
        closedPortAttempted: "1",
      },
      {
        id: 3,
        name: "Name Inbound 2",
        type: "Type Inbound 2",
        unconnectedPort: 3,
        idlePort: 7,
        activePort: 8,
        errorPort: 9,
        closedPortAttempted: "1",
      },
    ],
    outbound : [
      {
        id: 1,
        name: "outbound",
        type: "Type outbound",
        unconnectedPort: 2,
        idlePort: 88,
        activePort: 82,
        errorPort: 0,
        closedPortAttempted: "",
      },
      {
        id: 2,
        name: "Name outbound 2",
        type: "Type outbound 2",
        unconnectedPort: 33,
        idlePort: 73,
        activePort: 38,
        errorPort: 39,
        closedPortAttempted: "1",
      },
    ]
  };
  const rows = useMemo(() => {
    return datas[selectedTabBound];
  }, [datas, selectedTabBound]);

  const isCheckedPort = useMemo(() => {
    return Object.values(checkedRows).some((port) =>
      Object.values(port).includes(true),
    );
  }, [checkedRows]);

  const handleChangeTabBound = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTabBound(newValue);
    setCheckedRows({});
  };
  const handleConfirmClosePort = () => {
    console.log(checkedRows);
    closePortModal.close();
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px 0 2px",
          marginTop: "36px",
        }}
      >
        <Tabs value={selectedTabBound} onChange={handleChangeTabBound} sx={{ "& .MuiTabs-indicator": { display: "none" } }}>
          {bounds.map((bound, index) => (
            <Tab
              key={index}
              sx={{
                textTransform: "none",
                typography: "h2",
                color: "text.tertiary",
                "&.Mui-selected": {
                  color: "text.white",
                },
                padding: "0 10px",
              }}
              label={bound.label}
              value={bound.value}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <SearchComplete
            options={["cluster1", "cluster2", "cluster3"]}
            placeholder="Search for workloads"
          />
          <Button
            variant="contained"
            sx={{
              height: "32px",
              typography: "caption",
              fontWeight: "700",
            }}
            startIcon={<CheckBoxIcon color="white" size={16} />}
            onClick={closePortModal.open}
            disabled={!isCheckedPort}
          >
            Close selected ports
          </Button>
        </Box>
      </Box>
      <Box sx={{ marginTop: "24px", padding: "0 12px" }}>
        <Datagrid
          key={selectedTabBound}
          columns={columns}
          rows={rows}
          hasSearch={true}
          noRowsOverlay={() => <Box>Nodata</Box>}
          width="100%"
          checkedRows={checkedRows}
          onCheckedRowsChange={setCheckedRows}
          onRowClick={detailDrawer.open}
        ></Datagrid>
      </Box>
      <ModalClosePort
        open={closePortModal.visible}
        onClose={closePortModal.close}
        onConfirm={handleConfirmClosePort}
      />
      <WorkloadDetail
        open={detailDrawer.visible}
        handleClose={detailDrawer.close}
      />
    </>
  );
};
