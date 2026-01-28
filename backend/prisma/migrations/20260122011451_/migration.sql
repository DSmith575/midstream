-- AlterTable
ALTER TABLE "ReferralForm" ADD COLUMN     "detectedKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
