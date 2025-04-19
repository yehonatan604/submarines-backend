import mongoose, { model } from "mongoose";
import { DbSchema } from "../../Services/DB/extensions/DbSchema.js";
import {
    BOOLEAN_VALIDATION,
    EMAIL_VALIDATION,
    PASSWORD_VALIDATION_R,
    STRING_VALIDATION
} from "../../Services/DB/mongooseValidations.service.js";

const UserSchema = new DbSchema({
    name: STRING_VALIDATION(true),
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION_R,
    isVerified: BOOLEAN_VALIDATION(false, false),
});

export default mongoose.models.User || model("User", UserSchema);
