/*
  Warnings:

  - You are about to drop the column `workoutTime` on the `Workout` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "workoutDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("color", "completed", "createdAt", "endedAt", "id", "startedAt", "title", "updatedAt", "userId", "workoutDate") SELECT "color", "completed", "createdAt", "endedAt", "id", "startedAt", "title", "updatedAt", "userId", "workoutDate" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
CREATE INDEX "Workout_userId_idx" ON "Workout"("userId");
CREATE INDEX "workout_date_idx" ON "Workout"("workoutDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
