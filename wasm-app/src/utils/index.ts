import { AccessSource } from "@/models";

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
  portNumber: string;
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
      return "allow except some sources";
    case AccessSource.ALLOW_ONLY:
      return "allow only some sources";
    default:
      return "Allow all access";
  }
};
