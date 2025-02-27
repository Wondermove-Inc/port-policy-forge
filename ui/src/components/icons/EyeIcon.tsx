import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/eye.svg";

export const EyeIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
