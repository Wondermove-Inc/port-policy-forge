import yup from "./base";
import { doesPortExist } from "./rule";

import { AccessPolicy, Port, PortDirection, Protocol } from "@/models";
import { getPortNumberValue } from "@/utils";

export const openPortSchema = (direction: string, ports: Port[]) =>
  yup.object().shape({
    workloadUuid: yup.string().required(),
    flag: yup.number().required(),
    portSpec: yup
      .string()
      .isValidPort(1, 65535)
      .required()
      .test(
        "duplicate",
        "The port is already open. Please change it through the port settings.",
        (value) => {
          return (
            !ports.length ||
            !ports.some((item) =>
              doesPortExist(value, getPortNumberValue(item)),
            )
          );
        },
      )
      .label("Port number"),
    accessSources: yup.array().when("allowFullAccess", {
      is: false,
      then: (schema) =>
        schema
          .of(
            yup.object().shape({
              ip: yup
                .string()
                .required()
                .isValidIP()
                .label(
                  direction === PortDirection.INBOUND
                    ? "Source"
                    : "Destination",
                ),
              protocol: yup
                .string()
                .oneOf([Protocol.TCP, Protocol.UDP, Protocol.ICMP])
                .required(),
              comment: yup.string().nullable(),
              lastUpdatedAt: yup.string().nullable(),
            }),
          )
          .min(1),
    }),
    allowFullAccess: yup.boolean().required(),
    accessPolicy: yup
      .string()
      .oneOf([
        AccessPolicy.ALLOW_ONLY,
        AccessPolicy.ALLOW_EXCLUDE,
        AccessPolicy.ALLOW_ALL,
      ])
      .when("allowFullAccess", {
        is: false,
        then: (schema) => schema.required(),
      }),
  });
