import { useEffect, useState } from "react";

import { ClosePort } from "./ClosePort";
import { OpenPort } from "./OpenPort";
import { PolicyApplication } from "./PolicyApplication";
import { WorkloadSummary } from "./WorkloadSummary";
import { WorkloadTabs } from "./WorkloadTabs";

import { Drawer } from "@/components/atoms/Drawer";
import { INITIAL_WORKLOAD_DETAIL } from "@/constants";
import { AccessPolicy, PortDirection, PortRangeType } from "@/models";
import {
  wasmGetWorkloadDetail,
  WorkloadDetailType,
} from "@/services/getworkloadDetail";
import { useCommonStore } from "@/store";
import {
  getAccessLabel,
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
  const [loading, setLoading] = useState(true);
  const { setIsDetailFromMap, isViewList } = useCommonStore();

  useEffect(() => {
    if (id) {
      fetchWorkloadDetail();
    }
  }, [id]);

  useEffect(() => {
    setIsDetailFromMap(!!id && !isViewList);
  }, [id, isViewList]);

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
      .catch(() => {
        // TODO: handle error
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      fetchWorkloadDetail();
    }
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
          portNumberLabel: getPortNumberLabel({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber,
          }),
          sourceNumber: formatter("accessSources", "", (el) => el.length)(el),
          accessPolicy: formatter("accessPolicy", "", () =>
            getAccessLabel(el.accessPolicy as AccessPolicy, direction),
          )(el),
          lastConnectionDate: formatter(
            "lastConnectionDate",
            "",
            formatDateTime,
          )(el),
          lastConnectionLog: formatter("lastConnectionLog")(el),
          lastConnectionEndpoint: formatter("lastConnectionEndpoint")(el),
        })),
        closed: workloadDetail[direction].ports.closed.map((el) => ({
          ...el,
          portNumberLabel: getPortNumberLabel({
            isRange: el.isRange,
            portRange: el.portRange as PortRangeType,
            portNumber: el.portNumber,
          }),
          type: formatter("type", "", getPortKindLabel)(el),
          count: formatter("count", "", formatNumber)(el),
          lastConnectionDate: formatter(
            "lastConnectionDate",
            "",
            formatDateTime,
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
            workloadUuid={workloadDetail.uuid}
          />
          <ClosePort
            data={workloadDetail[portDirection].ports.closed}
            fetchWorkloadDetail={fetchWorkloadDetail}
            workloadUuid={workloadDetail.uuid}
          />
        </>
      )}
    </Drawer>
  );
};
