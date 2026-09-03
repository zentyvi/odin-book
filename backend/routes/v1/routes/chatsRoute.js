import { Router } from "express";
import chatsController from "../../../controllers/v1/chatsController.js";

const chatsRoute = Router();

chatsRoute.post("/:user/start", chatsController.startChat);

export default chatsRoute;
