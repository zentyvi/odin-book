import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DEV
      ? process.env["DEV_DATABASE_URL"]
      : process.env["PROD_DATABASE_URL"],
  },
});
