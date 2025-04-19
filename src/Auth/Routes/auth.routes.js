import { Router } from "express";
import auth from "../../Middlewares/auth.mw.js";
import { validate } from "../../Middlewares/validation.mw.js";
import { deleteUser, getUserById, login, register } from "../Services/usersAccess.service.js";
import LoginSchema from "../Validations/Login.joi.schema.js";
import RegisterSchema from "../validations/Register.joi.schema.js";

const authRouter = Router();

authRouter.post("/login", validate(LoginSchema), async (req, res) => {
    try {
        const token = await login(req.body);
        res.status(200).json(token);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

authRouter.post("/", validate(RegisterSchema), async (req, res) => {
    try {
        await register(req.body);
        res.status(200).json("User registered successfully");
    } catch (err) {
        res.status(400).json(err.message);
    }
});

authRouter.get("/:id", auth, async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

authRouter.post("/verify-email/:token", (req, res) => {
    res.send("Verify email");
});

authRouter.post("/forgot-password", (req, res) => {
    res.send("Forgot password");
});

authRouter.post("/reset-password/:token", (req, res) => {
    res.send("Reset password");
});

authRouter.patch("/update-password", auth, (req, res) => {
    res.send("Update password");
});

authRouter.delete("/:id", auth, async (req, res) => {
    try {
        await deleteUser(req.params.id);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

export { authRouter };

