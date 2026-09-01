import { Router } from "express";
import searchController from "../../../controllers/v1/searchController.js";

const searchRoute = Router();

searchRoute.get("/users", searchController.searchUsers);

export default searchRoute;
