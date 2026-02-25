/*
  Warnings:

  - A unique constraint covering the columns `[goalsId]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ReferralForm" ADD COLUMN     "goalsId" TEXT;

-- CreateTable
CREATE TABLE "ReferralGoals" (
    "id" TEXT NOT NULL,
    "whanauGoal" TEXT NOT NULL,
    "aspiration" TEXT NOT NULL,
    "biggestBarrier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralGoals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_goalsId_key" ON "ReferralForm"("goalsId");

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_goalsId_fkey" FOREIGN KEY ("goalsId") REFERENCES "ReferralGoals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
