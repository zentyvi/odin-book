import { Router } from "express";

import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import postsRoute from "./routes/postsRoute.js";
import commentsRoute from "./routes/commentsRoute.js";
import searchRoute from "./routes/searchRoute.js";
import chatsRoute from "./routes/chatsRoute.js";

const v1Route = Router();
v1Route.use("/auth", authRoute);
v1Route.use("/users", usersRoute);
v1Route.use("/posts", postsRoute);
v1Route.use("/comments", commentsRoute);
v1Route.use("/search", searchRoute);
v1Route.use("/chats", chatsRoute);

export default v1Route;
