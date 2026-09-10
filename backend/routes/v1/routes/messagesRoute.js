import e, { Router } from "express";
import messagesController from "../../../controllers/v1/messagesController.js";

const messagesRoute = Router();

messagesRoute.delete("/:messageId", messagesController.deleteMessage);

export default messagesRoute;
