import { Router } from "express";
import postsController from "../../../controllers/v1/postsController.js";

const postsRoute = Router();

postsRoute.get("/", postsController.getFeed);
postsRoute.post("/", postsController.createPost);
postsRoute.get("/:postId", postsController.getSinglePost);
postsRoute.delete("/:postId", postsController.deletePost);
postsRoute.put("/:postId/like", postsController.likePost);
postsRoute.put("/:postId/comment", postsController.newCommentPost);

export default postsRoute;
