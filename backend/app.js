import "dotenv/config";
import cors from "cors";
import express, { json, urlencoded } from "express";
import { authorizeUser } from "./middlewares/auth.js";
import v1Route from "./routes/v1/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(authorizeUser);
app.use("/api/v1", v1Route);
