/*
  Warnings:

  - You are about to drop the `Efficiency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplyVsDemand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaterFlow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaterLevel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Efficiency";

-- DropTable
DROP TABLE "SupplyVsDemand";

-- DropTable
DROP TABLE "WaterFlow";

-- DropTable
DROP TABLE "WaterLevel";

-- CreateTable
CREATE TABLE "monitoring" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterflow" DOUBLE PRECISION NOT NULL,
    "waterlevel" DOUBLE PRECISION NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "watersupply" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "monitoring_pkey" PRIMARY KEY ("id")
);
