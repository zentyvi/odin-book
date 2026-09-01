import { Router } from "express";
import usersController from "../../../controllers/v1/usersController.js";

const usersRoute = Router();

usersRoute.get("/me", usersController.getMyInfo);
usersRoute.get("/me/friends", usersController.getMyFriends);
usersRoute.post("/me/requests/:requestId", usersController.handleRequestAction);
usersRoute.delete("/me/friends/:friendId", usersController.deleteFriend);
usersRoute.get("/:userId", usersController.getUserProfile);
usersRoute.get("/:userId/preview", usersController.getUserPreview);
usersRoute.post("/:userId/friend", usersController.friendRequestPost);

export default usersRoute;
