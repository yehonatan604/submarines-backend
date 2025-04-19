import { Router } from "express";
import { authRouter } from "../Auth/Routes/auth.routes.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);

export { appRouter };

