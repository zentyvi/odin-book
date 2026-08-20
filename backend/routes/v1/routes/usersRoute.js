import { Router } from "express";
import usersController from "../../../controllers/v1/usersController.js";

const usersRoute = Router();

usersRoute.get("/me", usersController.getMyInfo);

export default usersRoute;
