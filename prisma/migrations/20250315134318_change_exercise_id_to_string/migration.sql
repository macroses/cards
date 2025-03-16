/*
  Warnings:

  - The primary key for the `UserExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
CREATE TABLE "new_WorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutExercise" ("exerciseId", "exerciseName", "id", "workoutId") SELECT "exerciseId", "exerciseName", "id", "workoutId" FROM "WorkoutExercise";
DROP TABLE "WorkoutExercise";
ALTER TABLE "new_WorkoutExercise" RENAME TO "WorkoutExercise";
CREATE TABLE "new_WorkoutSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weight" REAL NOT NULL DEFAULT 0,
    "repeats" INTEGER NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "setTime" INTEGER,
    "setTimeAddedAt" DATETIME,
    CONSTRAINT "WorkoutSet_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutSet" ("completed", "difficulty", "exerciseId", "id", "repeats", "setTime", "setTimeAddedAt", "weight", "workoutId") SELECT "completed", "difficulty", "exerciseId", "id", "repeats", "setTime", "setTimeAddedAt", "weight", "workoutId" FROM "WorkoutSet";
DROP TABLE "WorkoutSet";
ALTER TABLE "new_WorkoutSet" RENAME TO "WorkoutSet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
