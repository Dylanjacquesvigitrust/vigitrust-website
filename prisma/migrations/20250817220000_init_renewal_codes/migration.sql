-- CreateEnum
CREATE TYPE "RenewalCodeStatus" AS ENUM ('unused', 'used', 'expired');

-- CreateTable
CREATE TABLE "RenewalCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "status" "RenewalCodeStatus" NOT NULL DEFAULT 'unused',
    "externalReferenceId" TEXT,
    "productType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RenewalCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RenewalCode_code_key" ON "RenewalCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RenewalCode_stripeCheckoutSessionId_key" ON "RenewalCode"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "RenewalCode_stripePaymentIntentId_key" ON "RenewalCode"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "RenewalCode_customerEmail_idx" ON "RenewalCode"("customerEmail");

-- CreateIndex
CREATE INDEX "RenewalCode_code_idx" ON "RenewalCode"("code");

-- CreateIndex
CREATE INDEX "RenewalCode_externalReferenceId_idx" ON "RenewalCode"("externalReferenceId");

-- CreateIndex
CREATE INDEX "RenewalCode_status_idx" ON "RenewalCode"("status");

-- CreateIndex
CREATE INDEX "RenewalCode_createdAt_idx" ON "RenewalCode"("createdAt");
