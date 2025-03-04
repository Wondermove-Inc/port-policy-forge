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
  const getColor = (path: keyof typeof palette): string | undefined => {
    const keys = path.split(".") as [keyof typeof palette, string?];
    const section = palette[keys[0]];

    return typeof section === "object" && keys[1]
      ? (section as Record<string, string>)[keys[1]]
      : (section as string);
  };

  return (
    <SvgIcon
      sx={{
        width: size || width,
        height: size || height,
        ...sx,
        ...(color && {
          "& path": {
            fill: getColor(color as keyof typeof palette),
          },
        }),
      }}
      inheritViewBox={inheritViewBox}
      {...props}
    />
  );
};
