-- CreateEnum
CREATE TYPE "ManagerAccountStatus" AS ENUM ('pending', 'active');

-- CreateEnum
CREATE TYPE "ProvisioningStatus" AS ENUM ('pending', 'provisioning', 'provisioned', 'failed');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('reserved', 'assigned', 'failed', 'released');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "billingEmail" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerAccount" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "inviteToken" TEXT,
    "inviteExpiresAt" TIMESTAMP(3),
    "status" "ManagerAccountStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPurchase" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amountTotal" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "purchaserEmail" TEXT NOT NULL,
    "purchaserFirstName" TEXT,
    "purchaserLastName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLicenceAllocation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "reachCourseId" TEXT NOT NULL,
    "reachGroupId" TEXT,
    "reachGroupName" TEXT,
    "quantityPurchased" INTEGER NOT NULL,
    "quantityAssigned" INTEGER NOT NULL DEFAULT 0,
    "provisioningStatus" "ProvisioningStatus" NOT NULL DEFAULT 'pending',
    "provisioningError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseLicenceAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReachGroupMapping" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "reachGroupId" TEXT NOT NULL,
    "reachGroupName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReachGroupMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reachUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingAssignment" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "allocationId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "reachInvitationId" TEXT,
    "reachUserId" TEXT,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'reserved',
    "trainingStatus" "TrainingStatus" NOT NULL DEFAULT 'not_started',
    "progressPercent" INTEGER,
    "completedAt" TIMESTAMP(3),
    "provisioningError" TEXT,
    "assignedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_billingEmail_idx" ON "Customer"("billingEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerAccount_email_key" ON "ManagerAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerAccount_inviteToken_key" ON "ManagerAccount"("inviteToken");

-- CreateIndex
CREATE INDEX "ManagerAccount_customerId_idx" ON "ManagerAccount"("customerId");

-- CreateIndex
CREATE INDEX "ManagerAccount_inviteToken_idx" ON "ManagerAccount"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPurchase_stripeCheckoutSessionId_key" ON "TrainingPurchase"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPurchase_stripePaymentIntentId_key" ON "TrainingPurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "TrainingPurchase_customerId_idx" ON "TrainingPurchase"("customerId");

-- CreateIndex
CREATE INDEX "TrainingPurchase_purchasedAt_idx" ON "TrainingPurchase"("purchasedAt");

-- CreateIndex
CREATE INDEX "CourseLicenceAllocation_customerId_courseSlug_idx" ON "CourseLicenceAllocation"("customerId", "courseSlug");

-- CreateIndex
CREATE INDEX "CourseLicenceAllocation_purchaseId_idx" ON "CourseLicenceAllocation"("purchaseId");

-- CreateIndex
CREATE INDEX "CourseLicenceAllocation_reachGroupId_idx" ON "CourseLicenceAllocation"("reachGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ReachGroupMapping_customerId_courseSlug_key" ON "ReachGroupMapping"("customerId", "courseSlug");

-- CreateIndex
CREATE INDEX "ReachGroupMapping_reachGroupId_idx" ON "ReachGroupMapping"("reachGroupId");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_reachUserId_idx" ON "Employee"("reachUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_customerId_email_key" ON "Employee"("customerId", "email");

-- CreateIndex
CREATE INDEX "TrainingAssignment_employeeId_idx" ON "TrainingAssignment"("employeeId");

-- CreateIndex
CREATE INDEX "TrainingAssignment_allocationId_idx" ON "TrainingAssignment"("allocationId");

-- CreateIndex
CREATE INDEX "TrainingAssignment_courseSlug_idx" ON "TrainingAssignment"("courseSlug");

-- CreateIndex
CREATE INDEX "TrainingAssignment_customerId_idx" ON "TrainingAssignment"("customerId");

-- AddForeignKey
ALTER TABLE "ManagerAccount" ADD CONSTRAINT "ManagerAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPurchase" ADD CONSTRAINT "TrainingPurchase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLicenceAllocation" ADD CONSTRAINT "CourseLicenceAllocation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLicenceAllocation" ADD CONSTRAINT "CourseLicenceAllocation_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "TrainingPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReachGroupMapping" ADD CONSTRAINT "ReachGroupMapping_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignment" ADD CONSTRAINT "TrainingAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignment" ADD CONSTRAINT "TrainingAssignment_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "CourseLicenceAllocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
