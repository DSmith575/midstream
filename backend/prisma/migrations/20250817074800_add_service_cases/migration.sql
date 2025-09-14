/*
  Warnings:

  - You are about to drop the column `userId` on the `ServicePlan` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `ServicePlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceCaseId]` on the table `ServicePlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceCaseId` to the `ServicePlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_workerId_fkey";

-- AlterTable
ALTER TABLE "ServicePlan" DROP COLUMN "userId",
DROP COLUMN "workerId",
ADD COLUMN     "serviceCaseId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ServiceCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "referralFormId" TEXT,

    CONSTRAINT "ServiceCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCase_referralFormId_key" ON "ServiceCase"("referralFormId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePlan_serviceCaseId_key" ON "ServicePlan"("serviceCaseId");

-- AddForeignKey
ALTER TABLE "ServicePlan" ADD CONSTRAINT "ServicePlan_serviceCaseId_fkey" FOREIGN KEY ("serviceCaseId") REFERENCES "ServiceCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCase" ADD CONSTRAINT "ServiceCase_referralFormId_fkey" FOREIGN KEY ("referralFormId") REFERENCES "ReferralForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
