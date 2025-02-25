import Icon from "../../assets/icons/add.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const AddIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 16 16" {...props} />;
};
