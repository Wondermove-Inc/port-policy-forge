import { SvgIcon, SvgIconProps } from "@mui/material";
import { palette } from "@skuber/theme";

export type BaseIconProps = Omit<SvgIconProps, "size" | "color"> & {
  size?: number;
  color?: string;
};

export const BaseIcon = ({
  width,
  height,
  size = 24,
  inheritViewBox = true,
  sx,
  color,
  ...props
}: BaseIconProps) => {
  return (
    <SvgIcon
      sx={{
        width: size || width,
        height: size || height,
        ...sx,
        ...(color && {
          "& path": {
            fill: palette[color as keyof typeof palette] || "inherit",
          },
        }),
      }}
      inheritViewBox={inheritViewBox}
      {...props}
    />
  );
};
