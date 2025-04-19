import lodash from "lodash";
import { hashPassword, verifyPassword } from "../../Services/Data/password.service.js";
import { generateAuthToken } from "../../Services/Jwt/jwt.service.js";
import User from "../models/User.js";

const { pick } = lodash;

const login = async (credentials) => {
    try {
        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const isPasswordOk = await verifyPassword(password, user.password);
        if (!isPasswordOk) throw new Error("Wrong password");
        if (user.status !== "active") throw new Error("User not activated");
        const token = generateAuthToken(user._id);
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}

const register = async (user) => {
    try {
        const [checkEmail, checkName] = await Promise.all([
            User.findOne({ email: user.email }),
            User.findOne({ name: user.name }),
        ]);

        if (checkEmail) throw new Error("Email already exists");
        if (checkName) throw new Error("Name already exists");

        const newUser = new User(user);
        newUser.isVerified = true; // ************ Remove this line after email verification is implemented ************
        newUser.password = await hashPassword(user.password);
        await newUser.save();

        return newUser;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserById = async (id) => {
    try {
        const user = await User.findById(id);

        return Promise.resolve(pick(user, ["_id", "name", "email", "adress", "phone"]));
    } catch (error) {
        return Promise.reject(error);
    }
};

const deleteUser = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error("User not found");

        await UserAuth.findOneAndDelete({ userId: user._id });
    } catch (error) {
        if (error.name === "DocumentDeleted") {
            return Promise.resolve(error.message);
        };

        return Promise.reject(error);
    }
};

const activateUser = async (id) => {
    try {
        const user = await getUserById(id);
        user.status = "active";
        await user.save();
        return Promise.resolve("User activated");
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateUser = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) throw new Error("User not found");
        return Promise.resolve(pick(user, ["_id", "name", "email", "adress", "phone"]));
    } catch (error) {
        return Promise.reject(error);
    }
}

export {
    activateUser, deleteUser, getUserById, login,
    register, updateUser
};

