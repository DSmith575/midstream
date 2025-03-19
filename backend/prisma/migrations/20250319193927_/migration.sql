/*
  Warnings:

  - You are about to drop the column `doctorPostCode` on the `ReferralMedical` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReferralMedical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doctorName" TEXT NOT NULL,
    "doctorPhone" TEXT NOT NULL,
    "doctorAddress" TEXT NOT NULL,
    "doctorSuburb" TEXT NOT NULL,
    "doctorCity" TEXT NOT NULL,
    "nhiNumber" TEXT NOT NULL
);
INSERT INTO "new_ReferralMedical" ("doctorAddress", "doctorCity", "doctorName", "doctorPhone", "doctorSuburb", "id", "nhiNumber") SELECT "doctorAddress", "doctorCity", "doctorName", "doctorPhone", "doctorSuburb", "id", "nhiNumber" FROM "ReferralMedical";
DROP TABLE "ReferralMedical";
ALTER TABLE "new_ReferralMedical" RENAME TO "ReferralMedical";
CREATE UNIQUE INDEX "ReferralMedical_nhiNumber_key" ON "ReferralMedical"("nhiNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
