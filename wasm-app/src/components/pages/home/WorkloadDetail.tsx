import { useEffect, useState, useCallback } from "react";

import { ClosePort } from "./workload-detail/ClosePort";
import { OpenPort } from "./workload-detail/OpenPort";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { INITIAL_WORKLOAD_DETAIL } from "@/constants";
import { exampleWorkload } from "@/data";
import {
  PortDetailGroupType,
  PortDirection,
  PortRangeType,
  WorkloadDetailType,
} from "@/models";
import {
  getAccessLabel,
  getPortKindLabel,
  getPortNumber,
  getPortRiskLabel,
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
    // TODO
    setLoading(true);
    setTimeout(() => {
      setWorkloadDetail({
        ...exampleWorkload,
        workloadName: formatter("workloadName")(exampleWorkload),
        kind: formatter("kind", "", getWorkloadKindLabel)(exampleWorkload),
        stats: {
          active: formatter("stats.active", "", formatNumber)(exampleWorkload),
          unconnected: formatter(
            "stats.unconnected",
            "",
            formatNumber,
          )(exampleWorkload),
          idle: formatter("stats.idle", "", formatNumber)(exampleWorkload),
          error: formatter("stats.error", "", formatNumber)(exampleWorkload),
          attempted: formatter("stats.attempted")(exampleWorkload),
          latencyRtt: formatter(
            "stats.latencyRtt",
            "",
            formatMilliCores,
          )(exampleWorkload),
          throughput: formatter(
            "stats.throughput",
            "/s",
            formatBinarySize,
          )(exampleWorkload),
        },
        ports: ["inbound", "outbound"].reduce(
          (acc, direction) => {
            acc[direction as PortDirection] = {
              open: exampleWorkload.ports[direction as PortDirection].open.map(
                (el) => ({
                  ...el,
                  portNumber: getPortNumber({
                    isRange: el.isRange,
                    portRange: el.portRange as PortRangeType,
                    portNumber: el.portNumber,
                  }),
                  sourceNumber: formatter("source", "", (el) => el.length)(el),
                  access: formatter("access", "", getAccessLabel)(el),
                }),
              ),
              closed: exampleWorkload.ports[
                direction as PortDirection
              ].closed.map((el) => ({
                ...el,
                type: formatter("type", "", getPortKindLabel)(el),
                count: formatter("count", "", formatNumber)(el),
              })),
            };
            return acc;
          },
          {} as Record<PortDirection, PortDetailGroupType>,
        ),
      });
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!id) {
      setWorkloadDetail(INITIAL_WORKLOAD_DETAIL);
      return;
    }
    fetchWorkloadDetail();
  }, [id]);

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
      <WorkloadSummary stats={workloadDetail.stats} />
      <PolicyApplication fetchWorkloadDetail={fetchWorkloadDetail} />
      <OpenPort
        data={workloadDetail.ports[portDirection].open}
        portDirection={portDirection}
        fetchWorkloadDetail={fetchWorkloadDetail}
      />
      <ClosePort
        data={workloadDetail.ports[portDirection].closed}
        fetchWorkloadDetail={fetchWorkloadDetail}
      />
    </Drawer>
  );
};
