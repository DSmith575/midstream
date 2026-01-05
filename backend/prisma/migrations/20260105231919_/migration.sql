-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('CREATED', 'SUBMITTED', 'VIEWED', 'ASSIGNED', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'WORKER', 'ADMIN', 'MIDSTREAM');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PDF');

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
    "status" "ReferralStatus" NOT NULL DEFAULT 'CREATED',
    "checklistAudioComplete" BOOLEAN NOT NULL DEFAULT false,
    "checklistNotesComplete" BOOLEAN NOT NULL DEFAULT false,
    "checklistReviewComplete" BOOLEAN NOT NULL DEFAULT false,
    "checklistSubmitComplete" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transcribedContent" TEXT,
    "type" "DocumentType" NOT NULL DEFAULT 'PDF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralNote" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePlan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceCaseId" TEXT NOT NULL,

    CONSTRAINT "ServicePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "flexibleHours" BOOLEAN NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePlanEntry" (
    "id" TEXT NOT NULL,
    "servicePlanId" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,
    "allocatedMinutes" INTEGER NOT NULL,

    CONSTRAINT "ServicePlanEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePlanEntryComment" (
    "id" TEXT NOT NULL,
    "servicePlanEntryId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ServicePlanEntryComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "referralFormId" TEXT,

    CONSTRAINT "ServiceCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

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
CREATE UNIQUE INDEX "ServicePlan_serviceCaseId_key" ON "ServicePlan"("serviceCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_serviceName_key" ON "ServiceCategory"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCase_referralFormId_key" ON "ServiceCase"("referralFormId");

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

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralNote" ADD CONSTRAINT "ReferralNote_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlan" ADD CONSTRAINT "ServicePlan_serviceCaseId_fkey" FOREIGN KEY ("serviceCaseId") REFERENCES "ServiceCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntry" ADD CONSTRAINT "ServicePlanEntry_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "ServicePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntry" ADD CONSTRAINT "ServicePlanEntry_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntryComment" ADD CONSTRAINT "ServicePlanEntryComment_servicePlanEntryId_fkey" FOREIGN KEY ("servicePlanEntryId") REFERENCES "ServicePlanEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntryComment" ADD CONSTRAINT "ServicePlanEntryComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_referralFormId_fkey" FOREIGN KEY ("referralFormId") REFERENCES "ReferralForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
