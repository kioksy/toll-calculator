-- CreateEnum
CREATE TYPE "RegisteredPriceReason" AS ENUM ('WEEKEND', 'HOLIDAY', 'FREE_MONTH', 'NEW_TICKET', 'TICKET_EXISTS', 'LAST_TICKET_TODAY', 'OUTSIDE_BILLING_HOURS', 'MAX_DAILY_BILL', 'FREE_VEHICLE_TYPE');

-- CreateTable
CREATE TABLE "vehicle_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "has_pricing" BOOLEAN NOT NULL,

    CONSTRAINT "vehicle_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "regNr" TEXT NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_registration_logs" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regiteredPrice" DOUBLE PRECISION NOT NULL,
    "registeredPriceReason" "RegisteredPriceReason" NOT NULL,

    CONSTRAINT "toll_registration_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_prices" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "from" TEXT NOT NULL,
    "until" TEXT NOT NULL,
    "valid_until" DATE NOT NULL,

    CONSTRAINT "toll_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_total_daily_price" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "from" DATE NOT NULL,
    "until" DATE NOT NULL,

    CONSTRAINT "toll_total_daily_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_types_name_key" ON "vehicle_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_regNr_key" ON "vehicles"("regNr");

-- CreateIndex
CREATE UNIQUE INDEX "toll_total_daily_price_name_key" ON "toll_total_daily_price"("name");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_date_key" ON "holidays"("date");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "vehicle_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toll_registration_logs" ADD CONSTRAINT "toll_registration_logs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
