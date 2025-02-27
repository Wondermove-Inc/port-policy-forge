import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/indeterminateIcon.svg";

export const IndeterminateIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} size={12} viewBox="0 0 13 12" {...props} />;
};
