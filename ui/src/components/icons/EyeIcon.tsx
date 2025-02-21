import Icon from "../../assets/icons/eye.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const EyeIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
