-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- CreateEnum

-- DropForeignKey

-- DropForeignKey

-- DropForeignKey

-- DropForeignKey

-- DropForeignKey

-- DropForeignKey

-- DropIndex

-- AlterTable User
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"text"::"UserRole";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER'::"UserRole";

ALTER TABLE "User" ALTER COLUMN "dobAd" TYPE TIMESTAMP(3) USING "dobAd"::TIMESTAMP;


-- AlterTable Staff
ALTER TABLE "Staff" ADD COLUMN "userId" TEXT;
ALTER TABLE "Staff" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Staff" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"text"::"UserRole";
ALTER TABLE "Staff" ALTER COLUMN "role" SET DEFAULT 'STAFF'::"UserRole";

-- Insert dummy User records for Staff
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'staff_' || id || '@hondadamak.com', name, 'STAFF'::"UserRole", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Staff";

-- Link Staff to User
UPDATE "Staff" s SET "userId" = u.id FROM "User" u WHERE u.email = 'staff_' || s.id || '@hondadamak.com';

-- Make userId NOT NULL
ALTER TABLE "Staff" ALTER COLUMN "userId" SET NOT NULL;


-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "citizenshipBack",
DROP COLUMN "citizenshipFront",
DROP COLUMN "citizenshipNumber",
DROP COLUMN "citizenshipVerified",
DROP COLUMN "licenseBack",
DROP COLUMN "licenseFront",
DROP COLUMN "licenseNumber",
DROP COLUMN "licenseVerified",
DROP COLUMN "nationalIdBack",
DROP COLUMN "nationalIdFront",
DROP COLUMN "nationalIdNumber",
DROP COLUMN "nationalIdVerified";

-- AlterTable Lead
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus" USING "status"::"text"::"LeadStatus";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NEW'::"LeadStatus";


-- AlterTable VehicleInventory Add variantId
ALTER TABLE "VehicleInventory" ADD COLUMN "variantId" TEXT;

-- Create missing VehicleMasters and VehicleVariants
-- Note: We rely on the fact that existing data might be grouped
WITH new_masters AS (
    INSERT INTO "VehicleMaster" (id, name, category, "basePrice", "imageUrl", "createdAt", "updatedAt")
    SELECT gen_random_uuid(), "modelName", 'MOTORCYCLE'::"VehicleCategory", 0, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM (SELECT DISTINCT "modelName" FROM "VehicleInventory") sub
    RETURNING id, name
)
INSERT INTO "VehicleVariant" (id, "vehicleMasterId", "variantName", "exShowroomPriceNPR", "onRoadPriceNPR", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Standard', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM new_masters;

-- Update variantId on VehicleInventory
UPDATE "VehicleInventory" vi SET "variantId" = vv.id
FROM "VehicleVariant" vv
JOIN "VehicleMaster" vm ON vv."vehicleMasterId" = vm.id
WHERE vm.name = vi."modelName";

-- Cleanup and NOT NULL
ALTER TABLE "VehicleInventory" ALTER COLUMN "variantId" SET NOT NULL;
ALTER TABLE "VehicleInventory" DROP COLUMN "category", DROP COLUMN "cc", DROP COLUMN "modelName";


-- AlterTable
ALTER TABLE "PurchaseInvoice" DROP COLUMN "invoiceDate",
ADD COLUMN     "invoiceDate" TIMESTAMP(3);

-- AlterTable SalesTransaction
ALTER TABLE "SalesTransaction" ALTER COLUMN "saleType" TYPE "SaleType" USING "saleType"::"text"::"SaleType";
ALTER TABLE "SalesTransaction" ALTER COLUMN "saleType" SET DEFAULT 'RETAIL'::"SaleType";


-- AlterTable ServiceBooking
ALTER TABLE "ServiceBooking" ALTER COLUMN "status" TYPE "BookingStatus" USING "status"::"text"::"BookingStatus";
ALTER TABLE "ServiceBooking" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";


-- AlterTable VehicleColor
ALTER TABLE "VehicleColor" ADD COLUMN "vehicleMasterId" TEXT;
-- We don't have a direct map for vehicleId since Vehicle is dropped, so we link to a random VehicleMaster
UPDATE "VehicleColor" SET "vehicleMasterId" = (SELECT id FROM "VehicleMaster" LIMIT 1);
ALTER TABLE "VehicleColor" ALTER COLUMN "vehicleMasterId" SET NOT NULL;
ALTER TABLE "VehicleColor" DROP COLUMN "vehicleId";


-- AlterTable
ALTER TABLE "ValuationLog" ALTER COLUMN "valuationMin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "valuationMax" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceCharge" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable FinancePlan Add variantId
ALTER TABLE "FinancePlan" ADD COLUMN "variantId" TEXT;

-- We already created masters for inventory, but we should create any missing for FinancePlan
WITH missing_models AS (
    SELECT DISTINCT fp."modelName" FROM "FinancePlan" fp
    LEFT JOIN "VehicleMaster" vm ON fp."modelName" = vm.name
    WHERE vm.id IS NULL
),
new_masters AS (
    INSERT INTO "VehicleMaster" (id, name, category, "basePrice", "imageUrl", "createdAt", "updatedAt")
    SELECT gen_random_uuid(), "modelName", 'MOTORCYCLE'::"VehicleCategory", 0, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM missing_models
    RETURNING id, name
)
INSERT INTO "VehicleVariant" (id, "vehicleMasterId", "variantName", "exShowroomPriceNPR", "onRoadPriceNPR", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Standard', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM new_masters;

-- Update variantId on FinancePlan
UPDATE "FinancePlan" fp SET "variantId" = vv.id
FROM "VehicleVariant" vv
JOIN "VehicleMaster" vm ON vv."vehicleMasterId" = vm.id
WHERE vm.name = fp."modelName";

-- Give arbitrary variantIds to any remaining nulls (safety fallback)
UPDATE "FinancePlan" SET "variantId" = (SELECT id FROM "VehicleVariant" LIMIT 1) WHERE "variantId" IS NULL;

-- Cleanup and NOT NULL
ALTER TABLE "FinancePlan" ALTER COLUMN "variantId" SET NOT NULL;
ALTER TABLE "FinancePlan" DROP COLUMN "category", DROP COLUMN "cc", DROP COLUMN "modelName", DROP COLUMN "vehiclePrice";


-- AlterTable Accessory
ALTER TABLE "Accessory" ALTER COLUMN "stockStatus" TYPE "StockStatus" USING "stockStatus"::"text"::"StockStatus";
ALTER TABLE "Accessory" ALTER COLUMN "stockStatus" SET DEFAULT 'IN_STOCK'::"StockStatus";


-- AlterTable TestRideBooking
ALTER TABLE "TestRideBooking" ALTER COLUMN "status" TYPE "BookingStatus" USING "status"::"text"::"BookingStatus";
ALTER TABLE "TestRideBooking" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";


-- AlterTable StockTransferLog
ALTER TABLE "StockTransferLog" ALTER COLUMN "status" TYPE "TransferStatus" USING "status"::"text"::"TransferStatus";
ALTER TABLE "StockTransferLog" ALTER COLUMN "status" SET DEFAULT 'COMPLETED'::"TransferStatus";


-- AlterTable ServiceReminder
ALTER TABLE "ServiceReminder" ALTER COLUMN "status" TYPE "ReminderStatus" USING "status"::"text"::"ReminderStatus";
ALTER TABLE "ServiceReminder" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"ReminderStatus";


-- AlterTable AmcBooking
ALTER TABLE "AmcBooking" ALTER COLUMN "status" TYPE "BookingStatus" USING "status"::"text"::"BookingStatus";
ALTER TABLE "AmcBooking" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";


-- AlterTable
ALTER TABLE "AdminNotification" ALTER COLUMN "type" TYPE "NotificationType" USING "type"::"text"::"NotificationType";

-- DropTable

-- DropTable

-- DropTable

-- DropTable

-- DropTable

-- DropTable

-- DropTable

-- CreateTable
CREATE TABLE "CustomerDocument" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "docNumber" TEXT,
    "frontUrl" TEXT,
    "backUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "VehicleCategory" NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "specifications" JSONB,
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleVariant" (
    "id" TEXT NOT NULL,
    "vehicleMasterId" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "exShowroomPriceNPR" DOUBLE PRECISION NOT NULL,
    "onRoadPriceNPR" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerDocument_customerId_idx" ON "CustomerDocument"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerDocument_customerId_docType_key" ON "CustomerDocument"("customerId", "docType");

-- CreateIndex
CREATE INDEX "VehicleVariant_vehicleMasterId_idx" ON "VehicleVariant"("vehicleMasterId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleVariant_vehicleMasterId_variantName_key" ON "VehicleVariant"("vehicleMasterId", "variantName");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE INDEX "Lead_customerId_idx" ON "Lead"("customerId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "VehicleInventory_variantId_idx" ON "VehicleInventory"("variantId");

-- CreateIndex
CREATE INDEX "VehicleInventory_status_idx" ON "VehicleInventory"("status");

-- CreateIndex
CREATE INDEX "VehicleInventory_purchaseInvoiceId_idx" ON "VehicleInventory"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "VehicleInventory_branchId_idx" ON "VehicleInventory"("branchId");

-- CreateIndex
CREATE INDEX "SalesTransaction_customerId_idx" ON "SalesTransaction"("customerId");

-- CreateIndex
CREATE INDEX "SalesTransaction_createdAt_idx" ON "SalesTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentReceipt_transactionId_idx" ON "PaymentReceipt"("transactionId");

-- CreateIndex
CREATE INDEX "ServiceRecord_vehicleId_idx" ON "ServiceRecord"("vehicleId");

-- CreateIndex
CREATE INDEX "ServiceRecord_customerId_idx" ON "ServiceRecord"("customerId");

-- CreateIndex
CREATE INDEX "ServiceBooking_customerId_idx" ON "ServiceBooking"("customerId");

-- CreateIndex
CREATE INDEX "VehicleColor_vehicleMasterId_idx" ON "VehicleColor"("vehicleMasterId");

-- CreateIndex
CREATE INDEX "FinancePlan_variantId_idx" ON "FinancePlan"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancePlan_variantId_tenureMonths_downPaymentPct_key" ON "FinancePlan"("variantId", "tenureMonths", "downPaymentPct");

-- CreateIndex
CREATE INDEX "TestRideBooking_customerId_idx" ON "TestRideBooking"("customerId");

-- CreateIndex
CREATE INDEX "TestRideBooking_branchId_idx" ON "TestRideBooking"("branchId");

-- CreateIndex
CREATE INDEX "StockTransferLog_vehicleId_idx" ON "StockTransferLog"("vehicleId");

-- CreateIndex
CREATE INDEX "StockTransferLog_fromBranchId_idx" ON "StockTransferLog"("fromBranchId");

-- CreateIndex
CREATE INDEX "StockTransferLog_toBranchId_idx" ON "StockTransferLog"("toBranchId");

-- CreateIndex
CREATE INDEX "ServiceReminder_vehicleId_idx" ON "ServiceReminder"("vehicleId");

-- CreateIndex
CREATE INDEX "ServiceReminder_customerId_idx" ON "ServiceReminder"("customerId");

-- CreateIndex
CREATE INDEX "AdminNotification_isRead_idx" ON "AdminNotification"("isRead");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDocument" ADD CONSTRAINT "CustomerDocument_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleVariant" ADD CONSTRAINT "VehicleVariant_vehicleMasterId_fkey" FOREIGN KEY ("vehicleMasterId") REFERENCES "VehicleMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleColor" ADD CONSTRAINT "VehicleColor_vehicleMasterId_fkey" FOREIGN KEY ("vehicleMasterId") REFERENCES "VehicleMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInventory" ADD CONSTRAINT "VehicleInventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancePlan" ADD CONSTRAINT "FinancePlan_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

