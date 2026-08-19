import { Router } from "express";
import authController from "../../../controllers/v1/authContoller.js";

const authRoute = Router();

authRoute.post("/sign-up", authController.signUpPost);
authRoute.post("/log-in", authController.logInPost);
authRoute.post("/log-in/google", authController.googleLogInPost);
authRoute.post("/log-in/github", authController.githubLogInPost);

export default authRoute;
