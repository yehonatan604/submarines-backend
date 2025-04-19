import Joi from "joi";
import { REGEX_PASSWORD } from "../../Services/Data/regex.service.js";


const RegisterSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().pattern(new RegExp(REGEX_PASSWORD)).required(),
    name: Joi.string().min(2).max(30).required(),
});

export default RegisterSchema;