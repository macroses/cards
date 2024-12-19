/*
  Warnings:

  - You are about to drop the column `minutes` on the `WorkoutSet` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `WorkoutSet` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkoutSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "repeats" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "WorkoutSet_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutSet" ("completed", "difficulty", "exerciseId", "id", "repeats", "weight", "workoutId") SELECT "completed", "difficulty", "exerciseId", "id", "repeats", "weight", "workoutId" FROM "WorkoutSet";
DROP TABLE "WorkoutSet";
ALTER TABLE "new_WorkoutSet" RENAME TO "WorkoutSet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
