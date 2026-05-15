-- CreateTable
CREATE TABLE "prisma_bootstrap" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prisma_bootstrap_pkey" PRIMARY KEY ("id")
);
