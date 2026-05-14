-- Guarantee dependencies during shadow database reconstruction.
CREATE TABLE IF NOT EXISTS "voluntarios" (
    "id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL,
    "data_saida" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voluntarios_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "voluntarios_cpf_key" ON "voluntarios"("cpf");
CREATE UNIQUE INDEX IF NOT EXISTS "voluntarios_email_key" ON "voluntarios"("email");

CREATE TABLE IF NOT EXISTS "oficinas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oficinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "atuacoes" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "atuacoes_voluntario_id_oficina_id_key" ON "atuacoes"("voluntario_id", "oficina_id");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'atuacoes_voluntario_id_fkey'
    ) THEN
        ALTER TABLE "atuacoes"
        ADD CONSTRAINT "atuacoes_voluntario_id_fkey"
        FOREIGN KEY ("voluntario_id")
        REFERENCES "voluntarios"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'atuacoes_oficina_id_fkey'
    ) THEN
        ALTER TABLE "atuacoes"
        ADD CONSTRAINT "atuacoes_oficina_id_fkey"
        FOREIGN KEY ("oficina_id")
        REFERENCES "oficinas"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
    END IF;
END $$;
