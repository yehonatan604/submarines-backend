import Joi from "joi";
import { REGEX_PASSWORD } from "../../Services/Data/regex.service.js";

const LoginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().pattern(new RegExp(REGEX_PASSWORD)).required()
});

export default LoginSchema;