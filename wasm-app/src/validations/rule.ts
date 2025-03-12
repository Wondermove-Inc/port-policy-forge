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

      if (range.length === 2 && range[0] >= range[1]) {
        return createError({
          path,
          message: VALIDATION_MESSAGES.invalid_port_format,
        });
      }

      if (range.some((num) => isNaN(num) || num < min || num > max)) {
        return createError({
          path,
          message: VALIDATION_MESSAGES.range
            .replace("${min}", String(min))
            .replace("${max}", String(max)),
        });
      }
    }

    return true;
  });
}

export function isValidIP(this: Yup.StringSchema) {
  return this.test("portSpec", "", function (value) {
    if (!value) return true;

    const { createError, path } = this;

    if (!(REGEX.MULTIPLE_IPS.test(value) || REGEX.FSDN.test(value))) {
      return createError({
        path,
        message:
          "The source or direction is incorrect. Please enter it in the correct format.",
      });
    }

    return true;
  });
}

/**
 * Parses a port string into a set of numbers.
 * The string can contain single ports, ranges (using a hyphen), or comma-separated values.
 *
 * Examples:
 * "8080" => {8080}
 * "8080-8081" => {8080, 8081}
 * "8080,8000,8333" => {8080, 8000, 8333}
 *
 * @param ports - The port string to parse.
 * @returns A Set of port numbers.
 */
function parsePorts(ports: string): Set<number> {
  const result = new Set<number>();
  const parts = ports.split(",");

  parts.forEach((part) => {
    const trimmed = part.trim();
    // If the entry is a range (contains a hyphen).
    if (trimmed.includes("-")) {
      const rangeParts = trimmed.split("-").map((s) => parseInt(s.trim(), 10));
      if (
        rangeParts.length === 2 &&
        !isNaN(rangeParts[0]) &&
        !isNaN(rangeParts[1])
      ) {
        const [start, end] = rangeParts;
        // Ensure we handle ranges in any order.
        const low = Math.min(start, end);
        const high = Math.max(start, end);
        for (let port = low; port <= high; port++) {
          result.add(port);
        }
      }
    } else {
      // If it's just a single port.
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        result.add(num);
      }
    }
  });

  return result;
}

/**
 * Determines whether the input ports and the item ports share at least one port.
 *
 * @param inputPorts - The input port string (may be single, comma-separated, or a range).
 * @param itemPorts - The item port string (may be single, comma-separated, or a range).
 * @returns True if there is an intersection, false otherwise.
 */
export function doesPortExist(inputPorts: string, itemPorts: string): boolean {
  const inputSet = parsePorts(inputPorts);
  const itemSet = parsePorts(itemPorts);

  // Check if any port in the input exists in the item port set.
  for (const port of inputSet) {
    if (itemSet.has(port)) {
      return true;
    }
  }

  return false;
}
