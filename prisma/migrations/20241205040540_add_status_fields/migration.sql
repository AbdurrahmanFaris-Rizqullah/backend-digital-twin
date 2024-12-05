/*
  Warnings:

  - Added the required column `efficiencyStatus` to the `monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplyStatus` to the `monitoring` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monitoring" ADD COLUMN     "efficiencyStatus" TEXT NOT NULL,
ADD COLUMN     "supplyStatus" TEXT NOT NULL;
