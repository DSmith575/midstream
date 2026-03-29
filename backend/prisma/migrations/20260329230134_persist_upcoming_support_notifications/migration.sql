-- CreateEnum
CREATE TYPE "UpcomingSupportUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "UpcomingSupportNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "dueDateISO" TIMESTAMP(3),
    "urgency" "UpcomingSupportUrgency" NOT NULL DEFAULT 'MEDIUM',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "sourceItemId" TEXT,
    "sourceItemName" TEXT,
    "reason" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpcomingSupportNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UpcomingSupportNotification_userId_dueDateISO_idx" ON "UpcomingSupportNotification"("userId", "dueDateISO");

-- CreateIndex
CREATE INDEX "UpcomingSupportNotification_userId_isDismissed_idx" ON "UpcomingSupportNotification"("userId", "isDismissed");

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingSupportNotification_userId_fingerprint_key" ON "UpcomingSupportNotification"("userId", "fingerprint");

-- AddForeignKey
ALTER TABLE "UpcomingSupportNotification" ADD CONSTRAINT "UpcomingSupportNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
