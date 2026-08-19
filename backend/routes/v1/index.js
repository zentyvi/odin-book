import { Router } from "express";

import authRoute from "./routes/authRoute.js";

const v1Route = Router();
v1Route.use("/auth", authRoute);

export default v1Route;
