/*
  Warnings:

  - Made the column `userId` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."tasks" ALTER COLUMN "userId" SET NOT NULL;
