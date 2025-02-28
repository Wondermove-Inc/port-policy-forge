import { useEffect, useState, useCallback } from "react";

import { Box } from "@mui/material";

import { ClosePort } from "./workload-detail/ClosePort";
import { workloadDetailData } from "./workload-detail/data";
import { OpenPort } from "./workload-detail/OpenPort";
import { OpenPortModal } from "./workload-detail/OpenPortModal";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { PortDirection, WorkloadDetailType } from "@/models";
import { formatNumber, formatter } from "@/utils/format";

const INITIAL_WORKLOAD_DETAIL: WorkloadDetailType = {
  uuid: "",
  workloadName: "",
  kind: "",
  stats: {
    active: null,
    unconnected: null,
    idle: null,
    error: null,
    attempted: null,
    latencyRtt: null,
    throughput: null,
  },
  ports: {
    inbound: { open: [], closed: [] },
    outbound: { open: [], closed: [] },
  },
};

const formatWorkloadDetail = (data: WorkloadDetailType) => ({
  ...data,
  workloadName: formatter("workloadName")(data),
  stats: {
    ...data.stats,
    active: formatter("stats.active", "", formatNumber)(data),
    unconnected: formatter("stats.unconnected", "", formatNumber)(data),
    idle: formatter("stats.idle", "", formatNumber)(data),
    error: formatter("stats.error", "", formatNumber)(data),
    attempted: formatter("stats.attempted")(data),
    namespace: formatter("namespace")(data),
    latencyRtt: formatter("stats.latencyRtt", "ms")(data),
    throughput: formatter("stats.throughput", "MiB/s")(data),
  },
  ports: Object.fromEntries(
    ["inbound", "outbound"].map((direction) => [
      direction,
      {
        open: data.ports[direction].open.map((el) => ({
          ...el,
          portNumber: el.isRange
            ? `${el?.portRange?.start} ~ ${el?.portRange?.end}`
            : el.portNumber,
          sourceNumber: el.source?.length || "-",
          access: "Allow all access",
        })),
        closed: data.ports[direction].closed.map((el) => ({
          ...el,
          count: el.count || 0,
        })),
      },
    ]),
  ),
});

export const WorkloadDetail = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [portDirection, setPortDirection] = useState<PortDirection>(
    PortDirection.INBOUND,
  );
  const [workloadDetail, setWorkloadDetail] = useState<WorkloadDetailType>(
    INITIAL_WORKLOAD_DETAIL,
  );

  const fetchWorkloadDetail = useCallback(() => {
    setWorkloadDetail(formatWorkloadDetail(workloadDetailData));
  }, []);

  useEffect(() => {
    fetchWorkloadDetail();
  }, [fetchWorkloadDetail]);

  return (
    <Drawer
      open={open}
      title={workloadDetail.workloadName}
      subTitle={workloadDetail.kind}
      onClose={handleClose}
    >
      <WorkloadTabs
        onChangeTab={(direction) =>
          setPortDirection(direction as PortDirection)
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <WorkloadSummary
          stats={workloadDetail.stats}
          workloadName={workloadDetail.workloadName}
        />
        <PolicyApplication />
        <OpenPort data={workloadDetail.ports[portDirection].open} />
        <ClosePort data={workloadDetail.ports[portDirection].closed} />
      </Box>
      <OpenPortModal />
    </Drawer>
  );
};
