/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Like` table. All the data in the column will be lost.
  - Added the required column `tweet` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tweetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("created_at", "tweetId", "userId") SELECT "created_at", "tweetId", "userId" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE INDEX "Like_userId_idx" ON "Like"("userId");
CREATE INDEX "Like_tweetId_idx" ON "Like"("tweetId");
CREATE UNIQUE INDEX "Like_tweetId_userId_key" ON "Like"("tweetId", "userId");
CREATE TABLE "new_Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tweet" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("created_at", "id", "updated_at", "userId") SELECT "created_at", "id", "updated_at", "userId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE INDEX "Tweet_userId_idx" ON "Tweet"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "created_at", "email", "id", "password", "updated_at", "username") SELECT "bio", "created_at", "email", "id", "password", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
