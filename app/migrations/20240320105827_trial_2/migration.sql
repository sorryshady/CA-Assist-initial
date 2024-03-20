/*
  Warnings:

  - A unique constraint covering the columns `[panNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_panNumber_key" ON "User"("panNumber");
