import { AccessPolicy, PortKind, WorkloadKind } from "@/models";

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
    case WorkloadKind.DEPLOYMENT:
      return "Deployment";
    case WorkloadKind.STAGING:
      return "Staging";
    case WorkloadKind.PRODUCTION:
      return "Production";
    default:
      return "";
  }
};
