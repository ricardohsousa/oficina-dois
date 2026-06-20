import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (apenas em desenvolvimento)
  await prisma.registroAuditoria.deleteMany();
  await prisma.termoVoluntariado.deleteMany();
  await prisma.atuacao.deleteMany();
  await prisma.voluntario.deleteMany();
  await prisma.oficina.deleteMany();
  await prisma.usuario.deleteMany();

  // Criar usuários com diferentes roles
  const senhaHash = await bcrypt.hash("Test123!", 10);

  const coordenador = await prisma.usuario.create({
    data: {
      nome: "Coordenador Geral",
      email: "coordenador@ellp.com",
      senhaHash: senhaHash,
      role: "coordenador_geral",
    },
  });

  const professor = await prisma.usuario.create({
    data: {
      nome: "Professor Teste",
      email: "professor@ellp.com",
      senhaHash: senhaHash,
      role: "professor",
    },
  });

  const voluntario = await prisma.usuario.create({
    data: {
      nome: "Voluntário Teste",
      email: "voluntario@ellp.com",
      senhaHash: senhaHash,
      role: "voluntario",
    },
  });

  console.log("✅ Usuários criados:");
  console.log(`   📋 Coordenador: ${coordenador.email} (role: coordenador_geral)`);
  console.log(`   👨‍🏫 Professor: ${professor.email} (role: professor)`);
  console.log(`   🤝 Voluntário: ${voluntario.email} (role: voluntario)`);

  // Criar oficinas de teste com cronograma anual
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const primeiroJaneiro = new Date(anoAtual, 0, 1);
  const ultimoDezembro = new Date(anoAtual, 11, 31);

  const oficina1 = await prisma.oficina.create({
    data: {
      nome: "Introdução à Lógica de Programação",
      descricao:
        "Workshop introdutório sobre conceitos básicos de lógica e programação",
      ano: anoAtual,
      status: "ativa",
      dataInicio: primeiroJaneiro,
      dataFim: ultimoDezembro,
    },
  });

  const oficina2 = await prisma.oficina.create({
    data: {
      nome: "Python para Iniciantes",
      descricao:
        "Oficina prática de Python com exercícios hands-on para novatos",
      ano: anoAtual,
      status: "ativa",
      dataInicio: new Date(anoAtual, 0, 15),
      dataFim: new Date(anoAtual, 11, 31),
    },
  });

  console.log("✅ Oficinas criadas:", [oficina1.nome, oficina2.nome]);

  // Criar atividades para oficina 1 (Lógica)
  const atividade1_1 = await prisma.atividade.create({
    data: {
      oficinaId: oficina1.id,
      nome: "Conceitos Fundamentais",
      descricao: "Introdução a variáveis, tipos de dados e operadores",
      status: "planejada",
      meses: {
        create: [
          { mes: 1, descricao: "Variáveis e tipos primitivos" },
          { mes: 2, descricao: "Operadores aritméticos e lógicos" },
        ],
      },
    },
  });

  const atividade1_2 = await prisma.atividade.create({
    data: {
      oficinaId: oficina1.id,
      nome: "Estruturas de Controle",
      descricao: "If, else, switch, loops",
      status: "planejada",
      meses: {
        create: [
          { mes: 3, descricao: "Condicionais (if/else)" },
          { mes: 4, descricao: "Loops (for/while)" },
          { mes: 5, descricao: "Exercícios práticos" },
        ],
      },
    },
  });

  const atividade1_3 = await prisma.atividade.create({
    data: {
      oficinaId: oficina1.id,
      nome: "Funções e Modularização",
      descricao: "Criando funções reutilizáveis",
      status: "planejada",
      meses: {
        create: [
          { mes: 6, descricao: "Definição de funções" },
          { mes: 7, descricao: "Escopo e parâmetros" },
          { mes: 8, descricao: "Projeto integrador" },
        ],
      },
    },
  });

  const atividade1_4 = await prisma.atividade.create({
    data: {
      oficinaId: oficina1.id,
      nome: "Estruturas de Dados",
      descricao: "Arrays, listas, matrizes",
      status: "planejada",
      meses: {
        create: [
          { mes: 9, descricao: "Arrays e listas" },
          { mes: 10, descricao: "Matrizes e busca" },
          { mes: 11, descricao: "Ordenação" },
          { mes: 12, descricao: "Revisão e avaliação final" },
        ],
      },
    },
  });

  console.log("✅ Atividades criadas para oficina 1:", [
    atividade1_1.nome,
    atividade1_2.nome,
    atividade1_3.nome,
    atividade1_4.nome,
  ]);

  // Criar atividades para oficina 2 (Python)
  const atividade2_1 = await prisma.atividade.create({
    data: {
      oficinaId: oficina2.id,
      nome: "Setup e Primeiros Passos",
      descricao: "Instalação do Python e primeiro programa",
      status: "planejada",
      meses: {
        create: [
          {
            mes: 1,
            descricao:
              "Instalação Python, IDE (VS Code/PyCharm), Hello World",
          },
        ],
      },
    },
  });

  const atividade2_2 = await prisma.atividade.create({
    data: {
      oficinaId: oficina2.id,
      nome: "Aplicações Web com Flask",
      descricao: "Desenvolvimento de aplicações web simples",
      status: "planejada",
      meses: {
        create: [
          { mes: 6, descricao: "Introdução ao Flask" },
          { mes: 7, descricao: "Rotas e templates" },
          { mes: 8, descricao: "Banco de dados com SQLite" },
          { mes: 9, descricao: "Projeto final" },
        ],
      },
    },
  });

  console.log("✅ Atividades criadas para oficina 2:", [
    atividade2_1.nome,
    atividade2_2.nome,
  ]);

  // Criar voluntários de teste
  const voluntario1 = await prisma.voluntario.create({
    data: {
      nomeCompleto: "João Silva Santos",
      cpf: "12345678901",
      email: "joao.silva@example.com",
      dataNascimento: new Date("1995-05-15"),
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      dataEntrada: new Date("2025-01-01"),
      ativo: true,
    },
  });

  const voluntario2 = await prisma.voluntario.create({
    data: {
      nomeCompleto: "Maria Oliveira Costa",
      cpf: "98765432109",
      email: "maria.oliveira@example.com",
      dataNascimento: new Date("1998-08-22"),
      telefone: "(11) 99876-5432",
      endereco: "Avenida Paulista, 456 - São Paulo, SP",
      dataEntrada: new Date("2025-02-01"),
      ativo: true,
    },
  });

  console.log("✅ Voluntários criados:", [
    voluntario1.nomeCompleto,
    voluntario2.nomeCompleto,
  ]);

  // Criar atuações de teste
  await prisma.atuacao.create({
    data: {
      voluntarioId: voluntario1.id,
      oficinaId: oficina1.id,
      dataInicio: hoje,
      cargaHoraria: 40,
    },
  });

  await prisma.atuacao.create({
    data: {
      voluntarioId: voluntario2.id,
      oficinaId: oficina2.id,
      dataInicio: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000),
      cargaHoraria: 20,
    },
  });

  console.log("✅ Atuações criadas");

  // Criar registro de auditoria de exemplo
  await prisma.registroAuditoria.create({
    data: {
      usuarioId: coordenador.id,
      usuarioNome: coordenador.nome,
      usuarioEmail: coordenador.email,
      acao: "CRIAR",
      entidade: "Voluntario",
      entidadeId: voluntario1.id,
      descricao: "Voluntário criado durante seed inicial",
    },
  });

  // Associar professor a uma oficina
  await prisma.professorOficina.create({
    data: {
      professorId: professor.id,
      oficinaId: oficina1.id,
    },
  });

  console.log("✅ Registro de auditoria criado");
  console.log("✅ Professor associado à oficina");

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📝 Credenciais de teste:");
  console.log(`   Coordenador Geral: coordenador@ellp.com / Test123!`);
  console.log(`   Professor: professor@ellp.com / Test123!`);
  console.log(`   Voluntário: voluntario@ellp.com / Test123!`);
  console.log("\n📊 Dados criados:");
  console.log(`   Usuários: 3 (coordenador, professor, voluntário)`);
  console.log(`   Oficinas: 2`);
  console.log(`   Voluntários: 2`);
  console.log(`   Atuações: 2`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
