-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('SUBMITTED', 'VIEWED', 'ASSIGNED', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'WORKER', 'ADMIN', 'MIDSTREAM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT,
    "casesCompleted" INTEGER DEFAULT 0,
    "casesAssigned" INTEGER DEFAULT 0,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInformation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalInformation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "gender" TEXT NOT NULL,
    "preferredName" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressInformation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddressInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralForm" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedToWorkerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReferralStatus" NOT NULL DEFAULT 'SUBMITTED',
    "communicationId" TEXT NOT NULL,
    "medicalId" TEXT NOT NULL,
    "disabilityId" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "emergencyContactId" TEXT NOT NULL,
    "consentId" TEXT NOT NULL,
    "additionalInformationId" TEXT NOT NULL,

    CONSTRAINT "ReferralForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCommunication" (
    "id" TEXT NOT NULL,
    "firstLanguage" TEXT NOT NULL,
    "interpreter" BOOLEAN NOT NULL,
    "culturalSupport" BOOLEAN,
    "communicationNeeds" BOOLEAN,
    "communicationNeedsDetails" TEXT,

    CONSTRAINT "ReferralCommunication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalInformation" (
    "id" TEXT NOT NULL,
    "safety" TEXT NOT NULL,
    "otherImportantInformation" TEXT,

    CONSTRAINT "AdditionalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralMedical" (
    "id" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "doctorPhone" TEXT NOT NULL,
    "doctorAddress" TEXT NOT NULL,
    "doctorSuburb" TEXT NOT NULL,
    "doctorCity" TEXT NOT NULL,
    "nhiNumber" TEXT NOT NULL,

    CONSTRAINT "ReferralMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralDisability" (
    "id" TEXT NOT NULL,
    "disabilityType" TEXT NOT NULL,
    "disabilityDetails" TEXT,
    "disabilitySupportDetails" TEXT,
    "disabilityReasonForReferral" TEXT,
    "disabilitySupportRequired" TEXT,

    CONSTRAINT "ReferralDisability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referrer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "Referrer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralConsent" (
    "id" TEXT NOT NULL,
    "provideInformationConsent" BOOLEAN NOT NULL,
    "provideSharedInformationConsent" BOOLEAN NOT NULL,
    "provideContactConsent" BOOLEAN NOT NULL,
    "provideStatisticalConsent" BOOLEAN NOT NULL,
    "provideCorrectInformation" BOOLEAN NOT NULL,

    CONSTRAINT "ReferralConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_key" ON "User"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_userId_key" ON "ContactInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_email_key" ON "ContactInformation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInformation_userId_key" ON "PersonalInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AddressInformation_userId_key" ON "AddressInformation"("userId");

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
CREATE UNIQUE INDEX "ReferralForm_additionalInformationId_key" ON "ReferralForm"("additionalInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInformation" ADD CONSTRAINT "ContactInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInformation" ADD CONSTRAINT "PersonalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressInformation" ADD CONSTRAINT "AddressInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_assignedToWorkerId_fkey" FOREIGN KEY ("assignedToWorkerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "EmergencyContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_communicationId_fkey" FOREIGN KEY ("communicationId") REFERENCES "ReferralCommunication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "ReferralMedical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "ReferralDisability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "ReferralConsent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_additionalInformationId_fkey" FOREIGN KEY ("additionalInformationId") REFERENCES "AdditionalInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
