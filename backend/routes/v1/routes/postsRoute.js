import { Router } from "express";
import postsController from "../../../controllers/v1/postsController.js";

const postsRoute = Router();

postsRoute.get("/", postsController.getFeed);
postsRoute.post("/:postId/like", postsController.likePost);

export default postsRoute;
