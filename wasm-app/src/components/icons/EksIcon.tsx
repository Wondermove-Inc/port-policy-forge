import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/eks.svg";

export const EksIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 24 24" {...props} />;
};
