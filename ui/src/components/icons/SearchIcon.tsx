import Icon from "../../assets/icons/search.svg";

import { BaseIcon, BaseIconProps } from "./BaseIcon";

export const SearchIcon = (props: BaseIconProps) => {
  return <BaseIcon size={16} component={Icon} viewBox="0 0 16 16" {...props} />;
};
