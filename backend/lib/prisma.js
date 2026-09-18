import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const isDev = Boolean(Number(process.env.DEV));

const connectionString = isDev
  ? process.env["DEV_DATABASE_URL"]
  : process.env["PROD_DATABASE_URL"];

const adapter = new PrismaPg({ connectionString });
const prisma_client = new PrismaClient({ adapter });

export { prisma_client };
