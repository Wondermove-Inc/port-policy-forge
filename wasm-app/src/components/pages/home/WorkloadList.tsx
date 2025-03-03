import { useEffect, useMemo, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Button } from "@skuber/components";

import { WorkloadDetail } from "./WorkloadDetail";

import { Datagrid, CustomGridColDef } from "@/components/atoms/Datagrid";
import { CheckBoxIcon } from "@/components/icons/CheckBoxIcon";
import { ModalClosePort } from "@/components/modules/ModalClosePort";
import { SearchComplete } from "@/components/modules/SearchComplete";
import { BOUND_TYPES } from "@/constants";
import { workloadList } from "@/data";
import { useDisclosure } from "@/hooks/useDisclosure";
import { WorkloadListItem } from "@/models";

export const WorkloadList = () => {
  const closePortModal = useDisclosure();
  const detailDrawer = useDisclosure();

  const [workloads, setWorkloads] = useState<WorkloadListItem[]>([]);
  const [checkedRows, setCheckedRows] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [selectedTabBound, setSelectedTabBound] = useState("1");

  useEffect(() => {
    getWorkloads();
  }, []);

  const getWorkloads = () => {
    setTimeout(() => {
      setWorkloads(workloadList);
    }, 500);
  };

  const renderCellWithEmptyValue = (value: string, color: string) => {
    return (
      <Typography
        sx={{
          color: `${value ? color : "text.disabled"}`,
          fontWeight: "600",
        }}
      >
        {value || "-"}
      </Typography>
    );
  };

  const columns: CustomGridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "unconnectedPort",
      headerName: "Unconnected Port",
      flex: 1,
      enableCheckBox: true,
      renderCell: ({ value }) =>
        renderCellWithEmptyValue(value, "status.warning"),
    },
    {
      field: "idlePort",
      headerName: "Idle port",
      flex: 1,
      enableCheckBox: true,
      renderCell: ({ value }) =>
        renderCellWithEmptyValue(value, "status.warning"),
    },
    {
      field: "activePort",
      headerName: "Active port",
      flex: 1,
      enableCheckBox: true,
      renderCell: ({ value }) =>
        renderCellWithEmptyValue(value, "interaction.primaryContrast"),
    },
    {
      field: "errorPort",
      headerName: "Error port",
      flex: 1,
      enableCheckBox: true,
      disabled: true,
      renderCell: ({ value }) =>
        renderCellWithEmptyValue(value, "status.danger"),
    },
    {
      field: "closedPortAttempted",
      headerName: "Closed Port Attempted",
      flex: 1,
      renderCell: ({ value }) =>
        renderCellWithEmptyValue(value, "status.danger"),
    },
  ];

  const isCheckedPort = useMemo(() => {
    return Object.values(checkedRows).some((port) =>
      Object.values(port).includes(true),
    );
  }, [checkedRows]);

  const handleChangeTabBound = (
    event: React.SyntheticEvent,
    newValue: string,
  ) => {
    setSelectedTabBound(newValue);
    setCheckedRows({});
  };
  const handleConfirmClosePort = () => {
    closePortModal.close();
    console.log(checkedRows);
  };

  return (
    <Box
      sx={{
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px 0 2px",
          marginTop: "80px",
          height: "32px",
        }}
      >
        <Tabs
          value={selectedTabBound}
          onChange={handleChangeTabBound}
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
        >
          {BOUND_TYPES.map((bound, index) => (
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
            options={workloads.map((item) => ({
              id: item.id,
              label: item.name,
            }))}
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
          rows={workloads}
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
    </Box>
  );
};
