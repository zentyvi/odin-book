-- CreateEnum
CREATE TYPE "WhoCanTextMe" AS ENUM ('EVERYONE', 'FRIENDS');

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "is24h" BOOLEAN NOT NULL DEFAULT true,
    "whoCanTextMe" "WhoCanTextMe" NOT NULL DEFAULT 'EVERYONE',
    "theme" TEXT NOT NULL DEFAULT 'DEFAULT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
