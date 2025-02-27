import Icon from "../../assets/icons/delete.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const DeleteIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
