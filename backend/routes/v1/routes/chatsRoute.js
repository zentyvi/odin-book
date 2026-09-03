import { Router } from "express";
import chatsController from "../../../controllers/v1/chatsController.js";

const chatsRoute = Router();

chatsRoute.get("/:user", chatsController.getChat);

export default chatsRoute;
