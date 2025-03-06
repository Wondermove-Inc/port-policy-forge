import { useEffect, useMemo, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Button } from "@skuber/components";

import { WorkloadTabs } from "./workload-detail/WorkloadTabs";
import { WorkloadDetail } from "./WorkloadDetail";

import { Datagrid, CustomGridColDef } from "@/components/atoms/Datagrid";
import { CheckBoxIcon } from "@/components/icons/CheckBoxIcon";
import { ModalClosePort } from "@/components/modules/ModalClosePort";
import { SearchComplete } from "@/components/modules/SearchComplete";
import { useDisclosure } from "@/hooks/useDisclosure";
import { wasmListWorkloads, WorkloadResource } from "@/services/listWorkloads";
import { useCommonStore } from "@/store";
import { getWorkloadKindLabel } from "@/utils";
import { formatNumber } from "@/utils/format";

export const WorkloadList = () => {
  const { selectedNamespace } = useCommonStore();
  const closePortModal = useDisclosure();
  const detailDrawer = useDisclosure();
  const [workloads, setWorkloads] = useState<WorkloadResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedRows, setCheckedRows] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [selectedTabBound, setSelectedTabBound] = useState("Inbound");
  const [filteredWorkloadId, setFilterWorkloadId] = useState("");
  const [selectedWorkloadId, setSelectedWorkloadId] = useState("");

  useEffect(() => {
    if (selectedNamespace) {
      getWorkloads();
    }
  }, [selectedNamespace]);

  const getWorkloads = () => {
    setLoading(true);
    console.log(selectedTabBound);
    wasmListWorkloads(selectedNamespace)
      .then((data) => {
        setWorkloads(
          data.result.map((item) => ({
            ...item,
            id: item.uuid,
          })),
        );
        setLoading(false);
      })
      .catch(() => {
        // TODO: show error
        // setError(String(err));
        setLoading(false);
      });
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
    { field: "workloadName", headerName: "Name", flex: 1 },
    {
      field: "kind",
      headerName: "Type",
      flex: 1,
      valueGetter: (value) => getWorkloadKindLabel(value),
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
    const result: {
      workloadUuid: string;
      flag: string;
      status: string[];
    }[] = [];

    const statusMap: Record<string, string> = {
      unconnectedPort: "unconnectedPort",
      idlePort: "idlePort",
      activePort: "activePort",
      errorPort: "errorPort",
    };
    const portMap: Record<string, string[]> = {};
    Object.entries(checkedRows).forEach(([statusKey, ports]) => {
      Object.entries(ports).forEach(([portId, value]) => {
        if (portId === "allChecked" || portId === "isIndeterminate") return;
        if (value) {
          if (!portMap[portId]) portMap[portId] = [];
          portMap[portId].push(statusMap[statusKey]);
        }
      });
    });
    Object.entries(portMap).forEach(([id, status]) => {
      result.push({ workloadUuid: id, flag: selectedTabBound, status });
    });

    return result;
  }, [checkedRows, selectedTabBound]);

  const filteredWorkloads = useMemo(() => {
    if (!filteredWorkloadId) {
      return workloads;
    }
    return workloads.filter((item) => item.uuid === filteredWorkloadId);
  }, [filteredWorkloadId, workloads]);

  const handleChangeTabBound = (newValue: string) => {
    setSelectedTabBound(newValue);
    setCheckedRows({});
  };
  const handleConfirmClosePort = () => {
    closePortModal.close();
    console.log(formatCheckedRows);
  };

  const handleShowDetail = (id: string) => {
    detailDrawer.open();
    setSelectedWorkloadId(id);
  };

  const handleCloseDetail = () => {
    detailDrawer.close();
    setSelectedWorkloadId("");
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
              id: item.uuid,
              label: item.workloadName,
            }))}
            onChange={(option) => {
              setFilterWorkloadId(option?.id || "");
            }}
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
      <Box sx={{ marginTop: "24px", padding: "0 12px", width: "100%" }}>
        <Datagrid
          columns={columns}
          rows={filteredWorkloads}
          hasSearch={false}
          loading={loading}
          height="calc(100vh - 240px)"
          width="100%"
          checkedRows={checkedRows}
          onCheckedRowsChange={setCheckedRows}
          onRowClick={(row) => handleShowDetail(String(row.id))}
        ></Datagrid>
      </Box>
      <ModalClosePort
        title="Close Selected Ports"
        open={closePortModal.visible}
        onClose={closePortModal.close}
        onConfirm={handleConfirmClosePort}
      />
      <WorkloadDetail
        open={detailDrawer.visible}
        handleClose={handleCloseDetail}
        id={selectedWorkloadId}
      />
    </Box>
  );
};
