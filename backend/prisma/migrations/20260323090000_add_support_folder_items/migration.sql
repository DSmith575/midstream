-- CreateEnum
CREATE TYPE "SupportFolderItemType" AS ENUM ('FILE', 'AUDIO', 'TEXT');

-- CreateTable
CREATE TABLE "SupportFolderItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SupportFolderItemType" NOT NULL DEFAULT 'FILE',
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "content" TEXT,
    "fileData" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportFolderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupportFolderItem" ADD CONSTRAINT "SupportFolderItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
