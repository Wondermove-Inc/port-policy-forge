import yup from "./base";

import { AccessPolicy, PortDirection, Protocol } from "@/models";

export const openPortSchema = (direction: string) =>
  yup.object().shape({
    workloadUuid: yup.string().required(),
    flag: yup.number().required(),
    portSpec: yup
      .string()
      .isValidPort(1, 65535)
      .required()
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
