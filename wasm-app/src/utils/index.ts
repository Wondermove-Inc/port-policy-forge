import {
  AccessPolicy,
  PortDirection,
  PortKind,
  PortRangeType,
  PortRisk,
  WorkloadKind,
} from "@/models";

export const getPortNumberLabel = ({
  isRange,
  portRange,
  portNumber,
}: {
  isRange: boolean;
  portRange: {
    start: string;
    end: string;
  };
  portNumber: number | null;
}) => {
  if (isRange && portRange) {
    return `${portRange.start} ~ ${portRange.end}`;
  }
  return portNumber ? `${portNumber}` : "";
};

export const getPortNumberValue = ({
  isRange,
  portRange,
  portNumber,
}: {
  isRange: boolean;
  portRange: PortRangeType | null;
  portNumber: number | null;
}) => {
  if (isRange && portRange) {
    return `${portRange.start}-${portRange.end}`;
  }
  return portNumber ? `${portNumber}` : "";
};

export const getAccessLabel = (access: string, direction: PortDirection) => {
  const isInbound = direction === PortDirection.INBOUND;
  switch (access) {
    case AccessPolicy.ALLOW_ALL:
      return "Allow all access";
    case AccessPolicy.ALLOW_EXCLUDE:
      return isInbound
        ? "Exclude specific sources"
        : "Exclude specific destination";
    case AccessPolicy.ALLOW_ONLY:
      return isInbound ? "Only specific sources" : "Only specific destination";
    default:
      return "";
  }
};

export const getPortKindLabel = (kind: string) => {
  switch (kind) {
    case PortKind.INTERNAL:
      return "Internal";
    case PortKind.EXTERNAL:
      return "External";
    default:
      return "";
  }
};

export const getPortRiskLabel = (risk: number) => {
  switch (risk) {
    case PortRisk.NORMAL:
      return "Normal";
    case PortRisk.HIGH:
      return "High";
    case PortRisk.VERY_HIGH:
      return "Very High";
    default:
      return "";
  }
};

export const getWorkloadKindLabel = (kind: string) => {
  switch (kind) {
    case WorkloadKind.DEPLOYMENT:
      return "Deployment";
    case WorkloadKind.DEMONSET:
      return "Demonset";
    case WorkloadKind.REPLICASET:
      return "Replicaset";
    case WorkloadKind.CRONJOB:
      return "Cronjob";
    case WorkloadKind.JOB:
      return "Job";
    case WorkloadKind.STATEFULSET:
      return "Statefulset";
    default:
      return "ETC";
  }
};

export const getPortFlag = (flag: string) => {
  return flag === PortDirection.INBOUND ? 0 : 1;
};
