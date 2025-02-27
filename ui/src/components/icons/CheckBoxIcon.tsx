import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/checkboxicon.svg";

export const CheckBoxIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} size={12} viewBox="0 0 13 12" {...props} />;
};
