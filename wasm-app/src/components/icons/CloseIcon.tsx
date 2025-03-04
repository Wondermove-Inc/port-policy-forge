import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/close.svg";

export const CloseIcon = (props: BaseIconProps) => {
  console.log(111111111111, props)
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
