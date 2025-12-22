-- AlterTable
ALTER TABLE "ReferralForm" ADD COLUMN     "checklistAudioComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "checklistNotesComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "checklistReviewComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "checklistSubmitComplete" BOOLEAN NOT NULL DEFAULT false;
