-- CreateTable
CREATE TABLE "ReferralNote" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReferralNote" ADD CONSTRAINT "ReferralNote_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
