import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/info.svg";

export const InfoIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
