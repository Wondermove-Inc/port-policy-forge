import "yup";

declare module "yup" {
  interface StringSchema {
    isValidPort(min: number, max: number): StringSchema;
    isValidIP(): StringSchema;
  }
}
