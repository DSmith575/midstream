/*
  Warnings:

  - You are about to drop the column `pdfFile` on the `Document` table. All the data in the column will be lost.
  - The `type` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `rawBytes` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PDF');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "pdfFile",
ADD COLUMN     "rawBytes" BYTEA NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'PDF';
