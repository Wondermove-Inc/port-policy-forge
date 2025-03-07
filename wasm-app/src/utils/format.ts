import React from "react";

import { DateTime } from "luxon";

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

export const formatBinarySize = (size?: number): string => {
  if (size === undefined) {
    return "";
  }

  if (typeof size !== "number") {
    return size;
  }

  const units: string[] = ["MiB", "GiB"];
  const step: number = 1024;

  let unit: number = 0;
  while (size > step && unit < units.length - 1) {
    size /= step;
    unit++;
  }

  return `${size.toFixed(1)} ${units[unit]}`;
};

export const formatMilliCores = (milliCores?: number): string => {
  if (milliCores === undefined) {
    return "";
  }
  if (typeof milliCores !== "number") {
    return milliCores;
  }
  return (milliCores / 1000).toFixed(1) + "ms";
};

export const formatDateTime = (isoString: string) => {
  const dt = DateTime.fromISO(isoString, { setZone: true });

  return `${dt.toFormat("yyyy.MM.dd")}, ${dt.toFormat("HH:mm:ss")} (GMT ${dt.offset / 60 >= 0 ? "+" : ""}${dt.offset / 60})`;
};
