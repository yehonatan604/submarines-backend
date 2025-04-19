import jwt from "jsonwebtoken";
import { env } from "../ENV/dotenv.service.js";

const { JWT_SECRET, MAIL_SECRET } = env;

const generateAuthToken = (id, isRegister = false) => {
  const payloadData = { _id: id };
  const secret = isRegister ? MAIL_SECRET : JWT_SECRET
  return jwt.sign(payloadData, secret, { expiresIn: "1d" });
};

const verifyToken = (tokenFromClient, isRegister = false) => {
  try {
    const secret = isRegister ? MAIL_SECRET : JWT_SECRET
    const userData = jwt.verify(tokenFromClient, secret);
    return userData;
  } catch (error) {
    return null;
  }
};

export { generateAuthToken, verifyToken };

