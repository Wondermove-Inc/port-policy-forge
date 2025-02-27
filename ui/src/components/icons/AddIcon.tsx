import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/add.svg";

export const AddIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
