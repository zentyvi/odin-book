import { Router } from "express";
import commentsController from "../../../controllers/v1/commentsController.js";

const commentsRoute = Router();

commentsRoute.post("/:commentId/like", commentsController.likeComment);
commentsRoute.delete("/:commentId", commentsController.deleteComment);

export default commentsRoute;
