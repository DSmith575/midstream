-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pdfFile" BYTEA NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
