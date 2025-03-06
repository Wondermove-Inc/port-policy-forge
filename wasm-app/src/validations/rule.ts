import Yup from "./base";

import { VALIDATION_MESSAGES } from "@/constants/message";
import { REGEX } from "@/constants/regex";

export function isValidPort(this: Yup.StringSchema, min: number, max: number) {
  return this.test("portSpec", "", function (value) {
    if (!value) return true;

    const { createError, path } = this;

    if (!REGEX.INVALID_PORT_CHARACTERS.test(value)) {
      return createError({
        path,
        message: VALIDATION_MESSAGES.invalid_port_characters,
      });
    }

    if (REGEX.INVALID_PORT_FORMAT.test(value)) {
      return createError({
        path,
        message: VALIDATION_MESSAGES.invalid_port_format,
      });
    }

    const parts = value.split(",");

    for (const part of parts) {
      if (part.split("-").length > 2) {
        return createError({
          path,
          message: VALIDATION_MESSAGES.invalid_port_format,
        });
      }

      const range = part.split("-").map(Number);

      if (range.some((num) => isNaN(num) || num < min || num > max)) {
        return createError({
          path,
          message: VALIDATION_MESSAGES.range
            .replace("${min}", String(min))
            .replace("${max}", String(max)),
        });
      }

      if (range.length === 2 && range[0] >= range[1]) {
        return createError({
          path,
          message: VALIDATION_MESSAGES.invalid_port_format,
        });
      }
    }

    return true;
  });
}
