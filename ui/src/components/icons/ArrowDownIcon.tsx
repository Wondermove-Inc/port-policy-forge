import Icon from "../../assets/icons/arrow-down.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const ArrowDownIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
