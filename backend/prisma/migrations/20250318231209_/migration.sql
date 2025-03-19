/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AddressInformation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `ContactInformation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `ContactInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ReferralForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communicationId" INTEGER NOT NULL,
    "medicalId" INTEGER NOT NULL,
    "disabilityId" INTEGER NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "emergencyContactId" INTEGER NOT NULL,
    "consentId" INTEGER NOT NULL,
    CONSTRAINT "ReferralForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "EmergencyContact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_communicationId_fkey" FOREIGN KEY ("communicationId") REFERENCES "ReferralCommunication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "ReferralMedical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "ReferralDisability" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralForm_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "ReferralConsent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferralCommunication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstLanguage" TEXT NOT NULL,
    "interpreter" BOOLEAN NOT NULL,
    "culturalSupport" TEXT,
    "communicationNeeds" TEXT
);

-- CreateTable
CREATE TABLE "ReferralMedical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doctorName" TEXT NOT NULL,
    "doctorPhone" TEXT NOT NULL,
    "doctorAddress" TEXT NOT NULL,
    "doctorSuburb" TEXT NOT NULL,
    "doctorCity" TEXT NOT NULL,
    "doctorPostCode" INTEGER NOT NULL,
    "nhiNumber" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReferralDisability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "disabilityType" TEXT NOT NULL,
    "disabilityDetails" TEXT,
    "disabilitySupportDetails" TEXT,
    "disabilityReasonForReferral" TEXT,
    "disabilitySupportRequired" TEXT
);

-- CreateTable
CREATE TABLE "Referrer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReferralConsent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provideInformationConsent" BOOLEAN NOT NULL,
    "provideSharedInformationConsent" BOOLEAN NOT NULL,
    "provideContactConsent" BOOLEAN NOT NULL,
    "provideStatisticalConsent" BOOLEAN NOT NULL,
    "provideCorrectInformation" BOOLEAN NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PersonalInformation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "gender" TEXT NOT NULL,
    "preferredName" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PersonalInformation" ("createdAt", "dateOfBirth", "firstName", "gender", "id", "lastName", "preferredName", "title", "updatedAt", "userId") SELECT "createdAt", "dateOfBirth", "firstName", "gender", "id", "lastName", "preferredName", "title", "updatedAt", "userId" FROM "PersonalInformation";
DROP TABLE "PersonalInformation";
ALTER TABLE "new_PersonalInformation" RENAME TO "PersonalInformation";
CREATE UNIQUE INDEX "PersonalInformation_userId_key" ON "PersonalInformation"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_communicationId_key" ON "ReferralForm"("communicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_medicalId_key" ON "ReferralForm"("medicalId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_disabilityId_key" ON "ReferralForm"("disabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_referrerId_key" ON "ReferralForm"("referrerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_emergencyContactId_key" ON "ReferralForm"("emergencyContactId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_consentId_key" ON "ReferralForm"("consentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralMedical_nhiNumber_key" ON "ReferralMedical"("nhiNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_email_key" ON "Referrer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AddressInformation_userId_key" ON "AddressInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_userId_key" ON "ContactInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_email_key" ON "ContactInformation"("email");
