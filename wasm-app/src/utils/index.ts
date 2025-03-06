import { AccessSource, PortKind, WorkloadKind } from "@/models";

export const getPortNumber = ({
  isRange,
  portRange,
  portNumber,
}: {
  isRange: boolean;
  portRange: {
    start: string;
    end: string;
  };
  portNumber: string | number | null;
}) => {
  if (isRange) {
    return `${portRange.start} ~ ${portRange.end}`;
  }
  return portNumber;
};

export const getAccessLabel = (access: number) => {
  switch (access) {
    case AccessSource.ALLOW_ALL:
      return "Allow all sources";
    case AccessSource.ALLOW_EXPECT:
      return "Allow except some sources";
    case AccessSource.ALLOW_ONLY:
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
    case 1:
      return "Normal";
    case 2:
      return "High";
    default:
      return "";
  }
};

export const getWorkloadKindLabel = (kind: string) => {
  switch (kind) {
    case WorkloadKind.Deployment:
      return "Deployment";
    case WorkloadKind.Demonset:
      return "Demonset";
    case WorkloadKind.Replicaset:
      return "Replicaset";
    case WorkloadKind.Cronjob:
      return "Cronjob";
    case WorkloadKind.Job:
      return "Job";
    case WorkloadKind.Cronjob:
      return "Cronjob";
    case WorkloadKind.Statefulset:
      return "Statefulset";
    default:
      return "ETC";
  }
};
