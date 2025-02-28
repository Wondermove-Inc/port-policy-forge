import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransformFunction = (value: any) => any;

export function formatter(
  name: string,
  unit?: string,
  transform?: TransformFunction,
  defaultName?: string,
  unitFirst?: boolean,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (row: any): any => {
    const attributes = name.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = row;
    for (const attr of attributes) {
      if (val === null || val === undefined || typeof val !== "object") {
        return "-";
      }
      val = val[attr];
    }

    if (val === null || val === "" || val === undefined) {
      return defaultName ? defaultName : "-";
    }

    const value = transform ? transform(val) : val;
    if (React.isValidElement(value)) {
      return value;
    }
    if (value === undefined) {
      return "-";
    }
    return unitFirst ? (unit || "") + value : value + (unit || "");
  };
}

export const formatNumber = (value: number) => {
  if (value !== 0 && value !== null && value !== undefined) {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
    return 0;
  }
};
