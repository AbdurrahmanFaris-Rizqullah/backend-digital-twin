-- CreateTable
CREATE TABLE "Parameters" (
    "id" SERIAL NOT NULL,
    "pointName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ph" DOUBLE PRECISION NOT NULL,
    "turbidity" DOUBLE PRECISION NOT NULL,
    "tds" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterFlow" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterLevel" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterLevel" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Efficiency" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dormId" INTEGER NOT NULL,
    "waterSupplied" DOUBLE PRECISION NOT NULL,
    "waterUsedEffectively" DOUBLE PRECISION NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Efficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyVsDemand" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterSupplied" DOUBLE PRECISION NOT NULL,
    "waterDemand" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "SupplyVsDemand_pkey" PRIMARY KEY ("id")
);
