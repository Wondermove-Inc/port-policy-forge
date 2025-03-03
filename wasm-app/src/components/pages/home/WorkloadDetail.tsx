import { useEffect, useState, useCallback } from "react";

import { Box } from "@mui/material";

import { ClosePort } from "./workload-detail/ClosePort";
import { OpenPort } from "./workload-detail/OpenPort";
import { PolicyApplication } from "./workload-detail/PolicyApplication";
import { WorkloadSummary } from "./workload-detail/WorkloadSummary";
import { WorkloadTabs } from "./workload-detail/WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
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
} from "@/utils";
import { formatNumber, formatter } from "@/utils/format";

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
  const [workloadDetail, setWorkloadDetail] =
    useState<WorkloadDetailType | null>(null);

  useEffect(() => {
    fetchWorkloadDetail();
  }, []);

  const fetchWorkloadDetail = useCallback(() => {
    // TODO
    setTimeout(() => {
      setWorkloadDetail({
        ...exampleWorkload,
        workloadName: formatter("workloadName")(exampleWorkload),
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
          namespace: formatter("namespace")(exampleWorkload),
          latencyRtt: formatter("stats.latencyRtt", "ms")(exampleWorkload),
          throughput: formatter("stats.throughput", "MiB/s")(exampleWorkload),
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
                risk: formatter("risk", "", getPortRiskLabel)(el),
                type: formatter("type", "", getPortKindLabel)(el),
                count: formatter("count", "", formatNumber)(el),
              })),
            };
            return acc;
          },
          {} as Record<PortDirection, PortDetailGroupType>,
        ),
      });
    }, 500);
  }, []);

  if (!workloadDetail) {
    return <></>;
  }

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
    </Drawer>
  );
};
