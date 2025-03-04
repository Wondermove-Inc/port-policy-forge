import { useEffect, useMemo, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Button } from "@skuber/components";

import { WorkloadTabs } from "./workload-detail/WorkloadTabs";
import { WorkloadDetail } from "./WorkloadDetail";

import { Datagrid, CustomGridColDef } from "@/components/atoms/Datagrid";
import { CheckBoxIcon } from "@/components/icons/CheckBoxIcon";
import { ModalClosePort } from "@/components/modules/ModalClosePort";
import { SearchComplete } from "@/components/modules/SearchComplete";
import { workloadList } from "@/data";
import { useDisclosure } from "@/hooks/useDisclosure";
import { WorkloadListItem } from "@/models";
import { formatNumber } from "@/utils/format";

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
          typography: "body1",
          color: `${value ? color : "text.disabled"}`,
          fontWeight: "600",
        }}
      >
        {value ? formatNumber(Number(value)) : "-"}
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

  const formatCheckedRows = useMemo(() => {
    return Object.fromEntries(
      Object.entries(checkedRows).map(([key, value]) => [
        key,
        Object.keys(value).filter(
          (k) => k !== "allChecked" && k !== "isIndeterminate" && value[k],
        ),
      ]),
    );
  }, [checkedRows]);

  const handleChangeTabBound = (newValue: string) => {
    setSelectedTabBound(newValue);
    setCheckedRows({});
  };
  const handleConfirmClosePort = () => {
    closePortModal.close();
    console.log(formatCheckedRows);
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
        <WorkloadTabs
          sx={{
            paddingLeft: "12px",
            marginBottom: "0px",
            ".MuiTabs-flexContainer": {
              gap: "20px",
              paddingY: "0px",
              marginBottom: "0px",
            },
          }}
          onChangeTab={handleChangeTabBound}
        ></WorkloadTabs>
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
              width: "162px",
              whiteSpace: "nowrap",
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
