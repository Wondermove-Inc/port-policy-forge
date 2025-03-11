import yup from "./base";

import { AccessPolicy } from "@/models";

export const openPortSchema = yup.object().shape({
  workloadUuid: yup.string().required(),
  flag: yup.number().required(),
  portSpec: yup.string().isValidPort(1, 65535).required().label("Port numbers"),
  accessSources: yup.array().when("allowFullAccess", {
    is: false,
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            ip: yup.string().required(),
            protocol: yup.string().required(),
            comment: yup.string().nullable(),
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
