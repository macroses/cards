/*
  Warnings:

  - The primary key for the `UserExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserExercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleId" INTEGER NOT NULL,
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "force" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    CONSTRAINT "UserExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserExercise" ("category", "equipment", "force", "id", "level", "muscleId", "name", "primary", "secondary", "userId") SELECT "category", "equipment", "force", "id", "level", "muscleId", "name", "primary", "secondary", "userId" FROM "UserExercise";
DROP TABLE "UserExercise";
ALTER TABLE "new_UserExercise" RENAME TO "UserExercise";
CREATE INDEX "UserExercise_userId_idx" ON "UserExercise"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
