import { Router } from "express";
import chatsController from "../../../controllers/v1/chatsController.js";

const chatsRoute = Router();

chatsRoute.get("/:user", chatsController.getChat);
chatsRoute.post("/:user", chatsController.sendMessage);
chatsRoute.delete("/:user", chatsController.deleteChat);
chatsRoute.put("/:user/read", chatsController.markChatAsRead);

export default chatsRoute;
