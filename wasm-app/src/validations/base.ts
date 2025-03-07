import * as Yup from "yup";

import { isValidPort } from "./rule";

Yup.addMethod(Yup.string, "isValidPort", isValidPort);

export default Yup;
