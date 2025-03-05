import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/prm.svg";

export const PrmIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 24 24" {...props} />;
};
