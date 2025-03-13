import { useEffect, useMemo, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Button } from "@skuber/components";

import { WorkloadDetail } from "../workload-detail/WorkloadDetail";
import { WorkloadTabs } from "../workload-detail/WorkloadTabs";

import {
  Datagrid,
  CustomGridColDef,
  TableSelectionRow,
} from "@/components/atoms/Datagrid";
import { ModalConfirm } from "@/components/atoms/ModalConfirm";
import { CheckBoxIcon } from "@/components/icons/CheckBoxIcon";
import { SearchComplete } from "@/components/modules/common/SearchComplete";
import { useDisclosure } from "@/hooks/useDisclosure";
import { PortDirection, StatsType } from "@/models";
import { wasmClosePortsByStatus } from "@/services/closePortsByStatus";
import { wasmListWorkloads, WorkloadResource } from "@/services/listWorkloads";
import { useCommonStore } from "@/store";
import { getWorkloadKindLabel } from "@/utils";
import { formatNumber } from "@/utils/format";

export const WorkloadList = () => {
  const {
    workloads,
    setWorkloads,
    workloadsLoading,
    setWorkloadsLoading,
    selectedNamespace,
    setToast,
  } = useCommonStore();

  const closePortModal = useDisclosure();
  const detailDrawer = useDisclosure();
  const [selectedTabBound, setSelectedTabBound] = useState<PortDirection>(
    PortDirection.INBOUND,
  );
  const [keyword, setKeyword] = useState("");
  const [selectedWorkloadId, setSelectedWorkloadId] = useState("");
  const [closedWorkloads, setClosedWorkloads] = useState<TableSelectionRow[]>(
    [],
  );
  const [closePortLoading, setClosePortLoading] = useState(false);

  const renderCellWithEmptyValue = (
    row: WorkloadResource,
    status: string,
    color: string,
  ) => {
    const value = row[selectedTabBound].stats[status as keyof StatsType];
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

  const checkIfDisabled = (row: WorkloadResource, field: string) => {
    const value = row[selectedTabBound].stats[field as keyof StatsType];
    return value !== undefined && value === 0;
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
      field: "unconnected",
      headerName: "Unconnected Port",
      flex: 1,
      enableCheckBox: true,
      disabled: ({ row, field }) => checkIfDisabled(row, field),
      renderCell: ({ row, field }) =>
        renderCellWithEmptyValue(row, field, "status.warning"),
    },
    {
      field: "idle",
      headerName: "Idle port",
      flex: 1,
      enableCheckBox: true,
      disabled: ({ row, field }) => checkIfDisabled(row, field),
      renderCell: ({ row, field }) =>
        renderCellWithEmptyValue(row, field, "status.warning"),
    },
    {
      field: "active",
      headerName: "Active port",
      flex: 1,
      enableCheckBox: true,
      disabled: ({ row, field }) => checkIfDisabled(row, field),
      renderCell: ({ row, field }) =>
        renderCellWithEmptyValue(row, field, "interaction.primaryContrast"),
    },
    {
      field: "error",
      headerName: "Error port",
      flex: 1,
      disabled: ({ row, field }) => checkIfDisabled(row, field),
      enableCheckBox: true,
      renderCell: ({ row, field }) =>
        renderCellWithEmptyValue(row, field, "status.danger"),
    },
    {
      field: "attempted",
      headerName: "Closed Port Attempted",
      flex: 1,
      renderCell: ({ row, field }) =>
        renderCellWithEmptyValue(row, field, "status.danger"),
    },
  ];

  const isCheckedPort = useMemo(() => {
    return closedWorkloads?.length > 0;
  }, [closedWorkloads]);

  const filteredWorkloads = useMemo(() => {
    if (!keyword) {
      return workloads;
    }
    return workloads.filter((item) =>
      item.workloadName
        ?.toLowerCase()
        .includes((keyword as string)?.toLowerCase()),
    );
  }, [keyword, workloads]);

  useEffect(() => {
    setClosedWorkloads([]);
  }, [keyword]);

  const handleSelectionChange = (data: TableSelectionRow[]) => {
    setClosedWorkloads(data);
  };

  const handleChangeTabBound = (newValue: string) => {
    setSelectedTabBound(newValue as PortDirection);
    setClosedWorkloads([]);
  };
  const handleConfirmClosePort = () => {
    setClosePortLoading(true);
    const params = closedWorkloads.map((item) => ({
      workloadUuid: item.id,
      flag: selectedTabBound === PortDirection.INBOUND ? "0" : "1",
      status: item.columns,
    }));
    console.log("wasmClosePortsByStatus", params);
    wasmClosePortsByStatus(params)
      .then(() => {
        setWorkloadsLoading(true);
        closePortModal.close();
        wasmListWorkloads(selectedNamespace).then((data) => {
          setWorkloads(
            data.result.map((item) => ({
              ...item,
              id: item.uuid,
            })),
          );
          setWorkloadsLoading(false);
          setClosedWorkloads([]);
        });
      })
      .catch((error) => {
        setToast(error);
      })
      .finally(() => {
        setClosePortLoading(false);
      });
  };

  const handleShowDetail = (id: string) => {
    detailDrawer.open();
    setSelectedWorkloadId(id);
  };

  const handleCloseDetail = () => {
    detailDrawer.close();
    setSelectedWorkloadId("");
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
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
            onInputChange={handleKeywordChange}
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
          loading={workloadsLoading}
          height="calc(100vh - 240px)"
          width="100%"
          onCheckedRowsChange={handleSelectionChange}
          onRowClick={(row) => handleShowDetail(String(row.id))}
          selectionRows={closedWorkloads}
        ></Datagrid>
      </Box>
      <ModalConfirm
        title="Close Selected Ports"
        description="Closing an port makes the following changes"
        descriptionDetails={[
          "Closed ports will no longer be accessible externally.",
          "To reopen a port, you must manually reset it.",
        ]}
        open={closePortModal.visible}
        onClose={closePortModal.close}
        onConfirm={handleConfirmClosePort}
        loading={closePortLoading}
      />
      <WorkloadDetail
        open={detailDrawer.visible}
        handleClose={handleCloseDetail}
        id={selectedWorkloadId}
      />
    </Box>
  );
};
