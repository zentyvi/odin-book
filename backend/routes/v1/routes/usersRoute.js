import { Router } from "express";
import usersController from "../../../controllers/v1/usersController.js";

const usersRoute = Router();

usersRoute.get("/me", usersController.getMyInfo);
usersRoute.get("/me/settings", usersController.getMySettings);
usersRoute.get("/me/friends", usersController.getMyFriends);
usersRoute.get("/me/chats", usersController.getMyChats);
usersRoute.put("/me/settings", usersController.updateMySettings);
usersRoute.patch("/me", usersController.updateMyProfile);
usersRoute.put("/me/avatar", usersController.uploadAvatarPut);
usersRoute.delete("/me/avatar", usersController.deleteAvatar);
usersRoute.delete("/me", usersController.deleteMyProfile);
usersRoute.get("/:userId/preview", usersController.getUserPreview);
usersRoute.get("/:userId", usersController.getUserProfile);
usersRoute.post("/:userId/friend", usersController.friendRequestPost);
usersRoute.post("/me/requests/:requestId", usersController.handleRequestAction);
usersRoute.delete("/me/friends/:friendId", usersController.deleteFriend);

export default usersRoute;
