-- CreateTable
CREATE TABLE "CmsEntry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsEntry_kind_slug_key" ON "CmsEntry"("kind", "slug");

-- CreateIndex
CREATE INDEX "CmsEntry_kind_status_idx" ON "CmsEntry"("kind", "status");
