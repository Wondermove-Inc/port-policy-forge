import { useEffect, useState, useCallback } from "react";

import { ClosePort } from "./workload-detail/ClosePort";
import { OpenPort } from "./workload-detail/OpenPort";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { INITIAL_WORKLOAD_DETAIL } from "@/constants";
import { PortDirection, PortRangeType, WorkloadDetailType } from "@/models";
import { wasmGetWorkloadDetail } from "@/services/getworkloadDetail";
import {
  getAccessLabel,
  getPortKindLabel,
  getPortNumber,
  getWorkloadKindLabel,
} from "@/utils";
import {
  formatBinarySize,
  formatMilliCores,
  formatNumber,
  formatter,
} from "@/utils/format";

export const WorkloadDetail = ({
  open,
  id,
  handleClose,
}: {
  open: boolean;
  id: string;
  handleClose: () => void;
}) => {
  const [portDirection, setPortDirection] = useState<PortDirection>(
    PortDirection.INBOUND,
  );
  const [workloadDetail, setWorkloadDetail] = useState<WorkloadDetailType>(
    INITIAL_WORKLOAD_DETAIL,
  );
  const [loading, setLoading] = useState(false);

  const fetchWorkloadDetail = useCallback(() => {
    setLoading(true);
    wasmGetWorkloadDetail(id)
      .then((data) => {
        const workloadDetail = data.result;
        setWorkloadDetail({
          ...workloadDetail,
          workloadName: formatter("workloadName")(workloadDetail),
          kind: formatter("kind", "", getWorkloadKindLabel)(workloadDetail),
          inbound: formatDirection(workloadDetail, PortDirection.INBOUND),
          outbound: formatDirection(workloadDetail, PortDirection.OUTBOUND),
        });
      })
      .catch(() => {
        // TODO: handle error
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) {
      setWorkloadDetail(INITIAL_WORKLOAD_DETAIL);
      return;
    }
    fetchWorkloadDetail();
  }, [id]);

  const formatDirection = (
    workloadDetail: WorkloadDetailType,
    direction: PortDirection,
  ) => {
    return {
      stats: {
        active: formatter(
          `${direction}.stats.active`,
          "",
          formatNumber,
        )(workloadDetail),
        unconnected: formatter(
          `${direction}.stats.unconnected`,
          "",
          formatNumber,
        )(workloadDetail),
        idle: formatter(
          `${direction}.stats.idle`,
          "",
          formatNumber,
        )(workloadDetail),
        error: formatter(
          `${direction}.stats.error`,
          "",
          formatNumber,
        )(workloadDetail),
        attempted: formatter(`${direction}.stats.attempted`)(workloadDetail),
        latencyRtt: formatter(
          `${direction}.stats.latencyRtt`,
          "",
          formatMilliCores,
        )(workloadDetail),
        throughput: formatter(
          `${direction}.stats.throughput`,
          "/s",
          formatBinarySize,
        )(workloadDetail),
      },
      ports: {
        open: workloadDetail[direction].ports.open.map((el) => ({
          ...el,
          portNumber: getPortNumber({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber,
          }),
          sourceNumber: formatter("source", "", (el) => el.length)(el),
          access: formatter("access", "", getAccessLabel)(el),
        })),
        closed: workloadDetail[direction].ports.closed.map((el) => ({
          ...el,
          type: formatter("type", "", getPortKindLabel)(el),
          count: formatter("count", "", formatNumber)(el),
        })),
      },
    };
  };

  return (
    <Drawer
      open={open}
      title={workloadDetail.workloadName}
      subTitle={workloadDetail.kind}
      onClose={handleClose}
      loading={loading}
    >
      <WorkloadTabs
        onChangeTab={(direction) =>
          setPortDirection(direction as PortDirection)
        }
      />
      <WorkloadSummary stats={workloadDetail[portDirection].stats} />
      <PolicyApplication fetchWorkloadDetail={fetchWorkloadDetail} />
      <OpenPort
        data={workloadDetail[portDirection].ports.open}
        portDirection={portDirection}
        fetchWorkloadDetail={fetchWorkloadDetail}
      />
      <ClosePort
        data={workloadDetail[portDirection].ports.closed}
        fetchWorkloadDetail={fetchWorkloadDetail}
      />
    </Drawer>
  );
};
