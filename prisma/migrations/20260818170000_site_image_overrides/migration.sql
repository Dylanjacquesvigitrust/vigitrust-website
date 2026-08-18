-- CreateTable
CREATE TABLE "SiteImageOverride" (
    "slot" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteImageOverride_pkey" PRIMARY KEY ("slot")
);
