/*
  Warnings:

  - Added the required column `additionalInformationId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AdditionalInformation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "safety" TEXT NOT NULL,
    "otherImportantInformation" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReferralForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "communicationId" INTEGER NOT NULL,
    "medicalId" INTEGER NOT NULL,
    "disabilityId" INTEGER NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "emergencyContactId" INTEGER NOT NULL,
    "consentId" INTEGER NOT NULL,
    "additionalInformationId" INTEGER NOT NULL,
    CONSTRAINT "ReferralForm_additionalInformationId_fkey" FOREIGN KEY ("additionalInformationId") REFERENCES "AdditionalInformation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "EmergencyContact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_communicationId_fkey" FOREIGN KEY ("communicationId") REFERENCES "ReferralCommunication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "ReferralMedical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "ReferralDisability" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "ReferralConsent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReferralForm" ("communicationId", "consentId", "createdAt", "disabilityId", "emergencyContactId", "id", "medicalId", "referrerId", "status", "updatedAt", "userId") SELECT "communicationId", "consentId", "createdAt", "disabilityId", "emergencyContactId", "id", "medicalId", "referrerId", "status", "updatedAt", "userId" FROM "ReferralForm";
DROP TABLE "ReferralForm";
ALTER TABLE "new_ReferralForm" RENAME TO "ReferralForm";
CREATE UNIQUE INDEX "ReferralForm_communicationId_key" ON "ReferralForm"("communicationId");
CREATE UNIQUE INDEX "ReferralForm_medicalId_key" ON "ReferralForm"("medicalId");
CREATE UNIQUE INDEX "ReferralForm_disabilityId_key" ON "ReferralForm"("disabilityId");
CREATE UNIQUE INDEX "ReferralForm_referrerId_key" ON "ReferralForm"("referrerId");
CREATE UNIQUE INDEX "ReferralForm_emergencyContactId_key" ON "ReferralForm"("emergencyContactId");
CREATE UNIQUE INDEX "ReferralForm_consentId_key" ON "ReferralForm"("consentId");
CREATE UNIQUE INDEX "ReferralForm_additionalInformationId_key" ON "ReferralForm"("additionalInformationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
