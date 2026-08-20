import { Router } from "express";

import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import postsRoute from "./routes/postsRoute.js";

const v1Route = Router();
v1Route.use("/auth", authRoute);
v1Route.use("/users", usersRoute);
v1Route.use("/posts", postsRoute);

export default v1Route;
