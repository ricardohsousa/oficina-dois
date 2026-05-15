-- CreateTable
CREATE TABLE "registros_auditoria" (
    "id" TEXT NOT NULL,
    "usuario_id" INTEGER,
    "usuario_nome" TEXT,
    "usuario_email" TEXT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dados_anteriores" JSONB,
    "dados_novos" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registros_auditoria_acao_idx" ON "registros_auditoria"("acao");

-- CreateIndex
CREATE INDEX "registros_auditoria_entidade_idx" ON "registros_auditoria"("entidade");

-- CreateIndex
CREATE INDEX "registros_auditoria_entidade_id_idx" ON "registros_auditoria"("entidade_id");

-- CreateIndex
CREATE INDEX "registros_auditoria_usuario_id_idx" ON "registros_auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "registros_auditoria_created_at_idx" ON "registros_auditoria"("created_at");

-- AddForeignKey
ALTER TABLE "registros_auditoria" ADD CONSTRAINT "registros_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
