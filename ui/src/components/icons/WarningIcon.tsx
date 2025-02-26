import Icon from "../../assets/icons/warning.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const WarningIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
