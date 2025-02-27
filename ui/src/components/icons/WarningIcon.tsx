import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/warning.svg";

export const WarningIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
