/*
  Warnings:

  - You are about to drop the column `detectedKeywords` on the `ReferralForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "detectedKeywords",
ADD COLUMN     "mobilityIssues" BOOLEAN NOT NULL DEFAULT false;
