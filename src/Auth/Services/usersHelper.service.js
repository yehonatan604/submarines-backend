import { verifyPassword } from "../../Services/Data/password.service.js";
import User from "../models/User.js";

const checkEmailExist = async (email) => {
    const checkUser = await User.findOne({ email });
    if (checkUser) throw new Error("Email already exist");
    return checkUser;
};

const checkUserExist = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    return user;
}

const checkPassword = async (password, storedPassword) => {
    const checkPassword = await verifyPassword(password, storedPassword);
    if (!checkPassword) throw new Error("Wrong password");
}


const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found")
    else return user;
}


export { checkEmailExist, checkPassword, checkUserExist, getUserById };

