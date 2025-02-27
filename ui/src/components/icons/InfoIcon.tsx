import Icon from "../../assets/icons/info.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const InfoIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
