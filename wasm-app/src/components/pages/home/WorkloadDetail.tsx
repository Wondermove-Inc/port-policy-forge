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
import {
  PortDetailGroupType,
  PortDirection,
  PortRangeType,
  WorkloadDetailType,
} from "@/models";
import { getAccessLabel, getPortNumber } from "@/utils";
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
    active: formatter("stats.active", "", formatNumber)(data),
    unconnected: formatter("stats.unconnected", "", formatNumber)(data),
    idle: formatter("stats.idle", "", formatNumber)(data),
    error: formatter("stats.error", "", formatNumber)(data),
    attempted: formatter("stats.attempted")(data),
    namespace: formatter("namespace")(data),
    latencyRtt: formatter("stats.latencyRtt", "ms")(data),
    throughput: formatter("stats.throughput", "MiB/s")(data),
  },
  ports: ["inbound", "outbound"].reduce(
    (acc, direction) => {
      acc[direction as PortDirection] = {
        open: data.ports[direction as PortDirection].open.map((el) => ({
          ...el,
          portNumber: getPortNumber({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber as string,
          }),
          sourceNumber: formatter("source", "", (el) => el.length)(el),
          access: formatter("access", "", getAccessLabel)(el),
        })),
        closed: data.ports[direction as PortDirection].closed.map((el) => ({
          ...el,
          count: formatter("count", "", formatNumber)(el),
        })),
      };
      return acc;
    },
    {} as Record<PortDirection, PortDetailGroupType>,
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
    // TODO
    setWorkloadDetail(
      formatWorkloadDetail(workloadDetailData) as WorkloadDetailType,
    );
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
        <PolicyApplication fetchWorkloadDetail={fetchWorkloadDetail} />
        <OpenPort
          data={workloadDetail.ports[portDirection].open}
          portDirection={portDirection}
        />
        <ClosePort data={workloadDetail.ports[portDirection].closed} />
      </Box>
      <OpenPortModal />
    </Drawer>
  );
};
