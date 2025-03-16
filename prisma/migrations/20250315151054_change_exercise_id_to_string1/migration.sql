-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
