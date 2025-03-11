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

export const getAccessLabel = (access: string) => {
  switch (access) {
    case AccessPolicy.ALLOW_ALL:
      return "Allow all sources";
    case AccessPolicy.ALLOW_EXCLUDE:
      return "Allow except some sources";
    case AccessPolicy.ALLOW_ONLY:
      return "Allow only some sources";
    default:
      return "Allow all access";
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
      return "normal";
    case PortRisk.HIGH:
      return "high";
    case PortRisk.VERY_HIGH:
      return "very high";
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
