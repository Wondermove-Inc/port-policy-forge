import { BaseIcon, BaseIconProps } from "./BaseIcon";
import Icon from "../../assets/icons/edit.svg";

export const EditIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
