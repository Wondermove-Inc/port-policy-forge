import * as Yup from "yup";

import { isValidPort, isValidIP } from "./rule";

Yup.addMethod(Yup.string, "isValidPort", isValidPort);
Yup.addMethod(Yup.string, "isValidIP", isValidIP);

export default Yup;
