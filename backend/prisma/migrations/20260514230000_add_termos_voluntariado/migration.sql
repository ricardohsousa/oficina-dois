-- CreateTable
CREATE TABLE "termos_voluntariado" (
    "id" TEXT NOT NULL,
    "voluntario_id" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT 'application/pdf',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "termos_voluntariado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "termos_voluntariado" ADD CONSTRAINT "termos_voluntariado_voluntario_id_fkey" FOREIGN KEY ("voluntario_id") REFERENCES "voluntarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
