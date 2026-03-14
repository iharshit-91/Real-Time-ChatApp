import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// signup route
authRouter.post("/signup", signUp);
// login route
authRouter.post("/login", login);
// logout route
authRouter.get("/logout", logout);
export default authRouter;
