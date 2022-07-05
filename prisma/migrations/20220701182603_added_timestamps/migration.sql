/*
  Warnings:

  - Added the required column `createTime` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedTime` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createTime" DATETIME NOT NULL DEFAULT(DATE('now')),
    "lastUpdatedTime" DATETIME NOT NULL DEFAULT(DATE('now')),
    CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Posts" ("content", "id", "poster", "slug", "tagline", "title", "userId") SELECT "content", "id", "poster", "slug", "tagline", "title", "userId" FROM "Posts";
DROP TABLE "Posts";
ALTER TABLE "new_Posts" RENAME TO "Posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
