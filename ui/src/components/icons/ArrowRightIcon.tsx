import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/arrow-right.svg";

export const ArrowRightIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
