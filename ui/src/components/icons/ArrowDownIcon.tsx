import Icon from "../../assets/icons/down.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const ArrowDownIcon = (props: BaseIconProps) => {
  return <BaseIcon size={16} component={Icon} viewBox="0 0 16 16" {...props} />;
};
