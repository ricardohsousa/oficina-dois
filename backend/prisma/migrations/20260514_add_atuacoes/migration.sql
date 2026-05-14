-- CreateTable
CREATE TABLE "atuacoes" (
    "id" TEXT NOT NULL,
    "voluntario_id" TEXT NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "carga_horaria" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atuacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "atuacoes_voluntario_id_oficina_id_key" ON "atuacoes"("voluntario_id", "oficina_id");

-- AddForeignKey
ALTER TABLE "atuacoes" ADD CONSTRAINT "atuacoes_voluntario_id_fkey" FOREIGN KEY ("voluntario_id") REFERENCES "voluntarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atuacoes" ADD CONSTRAINT "atuacoes_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "oficinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
