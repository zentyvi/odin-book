-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USERNAME', 'GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserType";
