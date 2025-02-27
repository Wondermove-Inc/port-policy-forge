import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/close.svg";

export const CloseIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
