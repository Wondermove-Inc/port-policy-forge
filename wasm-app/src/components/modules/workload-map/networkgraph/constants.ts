import { EdgeStyle } from "./types";

import { WorkloadPortStatus } from "@/models";

export const color = {
  white: "#fff",
  black: "#19191B",
  stroke: {
    default: "#4d4d4f",
    active: "#125AED",
    error: "#EB4136",
  },
  fill: {
    default: "#2d323d",
    active: "#2d4169",
    activeInteraction100: "rgba(83, 139, 255, 0.1)",
    activeInteraction200: "rgba(83, 139, 255, 0.2)",
    error: "#EB41361A",
    errorInteraction100: "rgba(235, 65, 54, 0.1)",
    errorInteraction200: "rgba(235, 65, 54, 0.2)",
  },

  active: "#125AED",
  idle: "#FFA800",
  idleBackground: "#302d27",
  error: "#EB4136",
  errorBackground: "#2e222c",
};

export const EXCLAMATION_SIZE = 20;
export const GLOBAL_ALPHA = 1.0;
export const DISABLED_GLOBAL_ALPHA = 0.2;

export const ARROW_SIZE = 16;
export const LINE_WIDTH = 1;
export const LABEL_RECT_WIDTH = 48;
export const LABEL_RECT_HEIGHT = 24;
export const LABEL_BORDER_RADIUS = 8;
export const FONT = "12px Arial";

export const EDGE_STYLES: Record<string, EdgeStyle> = {
  [WorkloadPortStatus.IDLE]: {
    strokeStyle: color.idle,
    label: "Idle",
    backgroundColor: color.idleBackground,
    borderColor: color.idle,
    textColor: color.idle,
    arrowKey: "idleArrow",
    lineDash: [0, 0],
  },
  [WorkloadPortStatus.ERROR]: {
    strokeStyle: color.error,
    label: "Error",
    backgroundColor: color.errorBackground,
    borderColor: color.error,
    textColor: color.error,
    arrowKey: "errorArrow",
    lineDash: [0, 0],
  },
  [WorkloadPortStatus.ATTEMPT]: {
    strokeStyle: color.error,
    label: "Attempt",
    backgroundColor: color.errorBackground,
    borderColor: color.error,
    textColor: color.error,
    arrowKey: "errorArrow",
    lineDash: [2, 2],
  },
  [WorkloadPortStatus.ACTIVE]: {
    strokeStyle: color.active,
    arrowKey: "activeArrow",
    lineDash: [0, 0],
  },
  DEFAULT: {
    strokeStyle: color.active,
    arrowKey: "activeArrow",
    lineDash: [0, 0],
  },
};
