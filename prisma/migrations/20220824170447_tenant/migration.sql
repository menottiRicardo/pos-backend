/*
  Warnings:

  - Added the required column `tenantId` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Table" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full" BOOLEAN NOT NULL,
    "number" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL
);
INSERT INTO "new_Table" ("full", "id", "number", "seats") SELECT "full", "id", "number", "seats" FROM "Table";
DROP TABLE "Table";
ALTER TABLE "new_Table" RENAME TO "Table";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
