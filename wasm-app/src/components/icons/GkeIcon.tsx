import { BaseIcon, BaseIconProps } from "./BaseIcon";

import Icon from "@/assets/icons/gke.svg";

export const GkeIcon = (props: BaseIconProps) => {
  return <BaseIcon component={Icon} viewBox="0 0 24 24" {...props} />;
};
