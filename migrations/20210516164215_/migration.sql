/*
  Warnings:

  - A unique constraint covering the columns `[uniqueName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `uniqueName` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "uniqueName",
ADD COLUMN     "uniqueName" CITEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.uniqueName_unique" ON "User"("uniqueName");
