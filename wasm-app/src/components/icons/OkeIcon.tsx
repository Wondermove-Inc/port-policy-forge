import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/oke.svg";

export const OkeIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 24 24" {...props} />;
};
