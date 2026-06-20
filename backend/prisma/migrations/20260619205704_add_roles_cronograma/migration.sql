/*
  Warnings:

  - Added the required column `ano` to the `oficinas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oficinas" ADD COLUMN     "ano" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'voluntario';

-- CreateTable
CREATE TABLE "professores_oficinas" (
    "id" TEXT NOT NULL,
    "professor_id" INTEGER NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professores_oficinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planejada',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades_meses" (
    "id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atividades_meses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professores_oficinas_professor_id_oficina_id_key" ON "professores_oficinas"("professor_id", "oficina_id");

-- CreateIndex
CREATE INDEX "atividades_oficina_id_idx" ON "atividades"("oficina_id");

-- CreateIndex
CREATE INDEX "atividades_meses_atividade_id_idx" ON "atividades_meses"("atividade_id");

-- CreateIndex
CREATE UNIQUE INDEX "atividades_meses_atividade_id_mes_key" ON "atividades_meses"("atividade_id", "mes");

-- AddForeignKey
ALTER TABLE "professores_oficinas" ADD CONSTRAINT "professores_oficinas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores_oficinas" ADD CONSTRAINT "professores_oficinas_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades_meses" ADD CONSTRAINT "atividades_meses_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
