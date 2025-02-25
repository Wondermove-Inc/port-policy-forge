import Icon from "../../assets/icons/arrow-right.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const ArrowRightIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
