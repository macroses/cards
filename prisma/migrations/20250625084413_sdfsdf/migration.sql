/*
  Warnings:

  - The `secondary` column on the `UserExercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserExercise" DROP COLUMN "secondary",
ADD COLUMN     "secondary" TEXT[];
