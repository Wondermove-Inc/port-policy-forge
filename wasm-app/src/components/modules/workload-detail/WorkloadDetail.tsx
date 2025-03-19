import { useEffect, useMemo, useState } from "react";

import { ClosePort } from "./ClosePort";
import { OpenPort } from "./OpenPort";
import { PolicyApplication } from "./PolicyApplication";
import { WorkloadSummary } from "./WorkloadSummary";
import { WorkloadTabs } from "./WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { INITIAL_WORKLOAD_DETAIL } from "@/constants";
import { PortDirection, PortRangeType, Stats, STATUS_MAP } from "@/models";
import {
  wasmGetWorkloadDetail,
  WorkloadDetailType,
} from "@/services/getworkloadDetail";
import { useCommonStore } from "@/store";
import {
  getPortKindLabel,
  getPortNumberLabel,
  getWorkloadKindLabel,
} from "@/utils";
import {
  formatBinarySize,
  formatDateTime,
  formatMilliCores,
  formatNumber,
  formatter,
} from "@/utils/format";

export const WorkloadDetail = ({
  open,
  id,
  handleClose,
  onDirectionChange,
}: {
  open: boolean;
  id: string;
  handleClose: () => void;
  onDirectionChange: (direction: string) => void;
}) => {
  const { setIsDetailFromMap, isViewList, setToast } = useCommonStore();

  const [portDirection, setPortDirection] = useState<PortDirection>(
    PortDirection.INBOUND
  );
  const [workloadDetail, setWorkloadDetail] = useState<WorkloadDetailType>(
    INITIAL_WORKLOAD_DETAIL
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkloadDetail();
    }
  }, [id]);

  useEffect(() => {
    setIsDetailFromMap(!!id && !isViewList);
  }, [id, isViewList]);

  useEffect(() => {
    if (id) {
      fetchWorkloadDetail();
    }
  }, [id]);

  const isPolicyShown = useMemo(() => {
    return workloadDetail[portDirection].ports.open.some(
      (port) => STATUS_MAP[port.status] !== Stats.ACTIVE
    );
  }, [portDirection, workloadDetail]);

  const fetchWorkloadDetail = () => {
    setLoading(true);
    wasmGetWorkloadDetail(id)
      .then((data) => {
        const newDetailData = data.result;
        setWorkloadDetail({
          ...newDetailData,
          workloadName: formatter("workloadName")(newDetailData),
          kind: getWorkloadKindLabel(newDetailData.kind),
          inbound: formatDirection(newDetailData, PortDirection.INBOUND),
          outbound: formatDirection(newDetailData, PortDirection.OUTBOUND),
        });
      })
      .catch((error) => {
        setToast(error);
      })
      .finally(() => setLoading(false));
  };

  const formatDirection = (
    workloadDetail: WorkloadDetailType,
    direction: PortDirection
  ) => {
    return {
      stats: {
        active: formatter(
          `${direction}.stats.active`,
          "",
          formatNumber
        )(workloadDetail),
        unconnected: formatter(
          `${direction}.stats.unconnected`,
          "",
          formatNumber
        )(workloadDetail),
        idle: formatter(
          `${direction}.stats.idle`,
          "",
          formatNumber
        )(workloadDetail),
        error: formatter(
          `${direction}.stats.error`,
          "",
          formatNumber
        )(workloadDetail),
        attempted: formatter(
          `${direction}.stats.attempted`,
          "",
          formatNumber
        )(workloadDetail),
        latencyRtt: formatter(
          `${direction}.stats.latencyRtt`,
          "",
          formatMilliCores
        )(workloadDetail),
        throughput: formatter(
          `${direction}.stats.throughput`,
          "/s",
          formatBinarySize
        )(workloadDetail),
      },
      ports: {
        open: (workloadDetail[direction].ports.open || []).map((el) => ({
          ...el,
          portNumberLabel: getPortNumberLabel({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber,
          }),
          sourceNumber: el.accessSources?.length || 0,
          lastConnectionDate: formatter(
            "lastConnectionDate",
            "",
            formatDateTime
          )(el),
          lastConnectionLog: formatter("lastConnectionLog")(el),
          lastConnectionEndpoint: formatter("lastConnectionEndpoint")(el),
        })),
        closed: (workloadDetail[direction].ports.closed || []).map((el) => ({
          ...el,
          portNumberLabel: getPortNumberLabel({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber,
          }),
          attemptType: formatter("attemptType", "", getPortKindLabel)(el),
          count: formatter("count", "", formatNumber)(el),
          lastConnectionDate: formatter(
            "lastConnectionDate",
            "",
            formatDateTime
          )(el),
          lastConnectionLog: formatter("lastConnectionLog")(el),
          lastConnectionEndpoint: formatter("lastConnectionEndpoint")(el),
        })),
      },
    };
  };

  const handleDetailClose = () => {
    setPortDirection(PortDirection.INBOUND);
    handleClose();
    setWorkloadDetail(INITIAL_WORKLOAD_DETAIL);
  };

  const handleDirectionChange = (direction: string) => {
    setPortDirection(direction as PortDirection);
    onDirectionChange?.(direction);
  };

  return (
    <Drawer
      open={open}
      title={workloadDetail?.workloadName || ""}
      subTitle={workloadDetail?.kind || ""}
      onClose={handleDetailClose}
      loading={loading}
      variant={isViewList ? "temporary" : "persistent"}
    >
      {id && (
        <>
          <WorkloadTabs onChangeTab={handleDirectionChange} />
          <WorkloadSummary stats={workloadDetail[portDirection].stats} />
          {isPolicyShown && (
            <PolicyApplication
              fetchWorkloadDetail={fetchWorkloadDetail}
              portDirection={portDirection}
              workloadUuid={id}
            />
          )}
          <OpenPort
            data={workloadDetail[portDirection].ports.open}
            portDirection={portDirection}
            fetchWorkloadDetail={fetchWorkloadDetail}
            workloadUuid={id}
          />
          <ClosePort
            data={workloadDetail[portDirection].ports.closed}
            fetchWorkloadDetail={fetchWorkloadDetail}
            workloadUuid={id}
          />
        </>
      )}
    </Drawer>
  );
};
