import Icon from "../../assets/icons/edit.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const EditIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
