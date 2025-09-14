-- CreateTable
CREATE TABLE "ServicePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_serviceName_key" ON "ServiceCategory"("serviceName");

-- AddForeignKey
ALTER TABLE "ServicePlan" ADD CONSTRAINT "ServicePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlan" ADD CONSTRAINT "ServicePlan_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntry" ADD CONSTRAINT "ServicePlanEntry_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "ServicePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntry" ADD CONSTRAINT "ServicePlanEntry_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntryComment" ADD CONSTRAINT "ServicePlanEntryComment_servicePlanEntryId_fkey" FOREIGN KEY ("servicePlanEntryId") REFERENCES "ServicePlanEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePlanEntryComment" ADD CONSTRAINT "ServicePlanEntryComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
