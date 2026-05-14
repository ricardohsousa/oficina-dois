# Sistema de Controle de Voluntários — ELLP

Sistema web para gerenciamento de voluntários do projeto de extensão **ELLP (Ensino Lúdico de Lógica e Programação)**, desenvolvido na disciplina **Oficina de Integração 2**.

O sistema permite cadastrar voluntários, registrar sua atuação em oficinas, preservar histórico e gerar automaticamente o Termo de Adesão ao Trabalho Voluntário em PDF.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Validação | Zod |
| Geração de PDF | Puppeteer |
| Hash de senha | bcrypt |
| Documentação da API | Swagger/OpenAPI |
| Testes backend | Vitest + Supertest |
| Testes frontend | Vitest + React Testing Library |
| Testes E2E | Playwright |

---

## Estrutura do Repositório

```
/
├── docs/                          # Documentação do projeto
│   ├── requisitos_funcionais.md   # Requisitos funcionais e não funcionais
│   ├── arquitetura.md             # Arquitetura em alto nível
│   ├── estrategia-automacao-testes.md  # Estratégia de testes automatizados
│   ├── cronograma.md              # Cronograma do projeto
│   ├── backlog.md                 # Backlog de itens
│   └── fluxos/                   # Diagramas de fluxo
│
├── backend/                       # API Node.js + Express (a ser criado)
│   ├── prisma/
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── interfaces/
│   │   └── shared/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Aplicação React (a ser criado)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml             # Banco de dados local (a ser criado)
```

---

## Documentação de Planejamento

- [Requisitos Funcionais](docs/requisitos_funcionais.md)
- [Arquitetura em Alto Nível](docs/arquitetura.md)
- [Estratégia de Automação de Testes](docs/estrategia-automacao-testes.md)
- [Cronograma](docs/cronograma.md)
- [Backlog](docs/backlog.md)

---

## Funcionalidades

- Autenticação de usuários com e-mail e senha
- Cadastro, consulta, atualização e inativação de voluntários
- Cadastro e controle de oficinas
- Associação entre voluntários e oficinas
- Histórico de atuação por voluntário
- Geração do Termo de Adesão ao Trabalho Voluntário em PDF
- Download do termo gerado
- Controle de status da documentação
- Busca e filtros de voluntários
- Auditoria das ações realizadas no sistema

---

## Como Executar

> Instruções de instalação e execução serão adicionadas após a configuração do ambiente.

### Reparar histórico local do Prisma

Se `npm run db:migrate` falhar com erro de `shadow database` nas migrations antigas, execute no diretório `backend`:

```bash
npm run db:repair-migrations
npm run db:migrate
```

O primeiro comando atualiza os checksums das migrations legadas em `_prisma_migrations` no banco local para mantê-las compatíveis com a versão corrigida do repositório.

### Documentação da API

A documentação da API é gerada automaticamente usando Swagger/OpenAPI. Para visualizá-la, siga os passos:

1. Inicie a aplicação backend.
2. Acesse a seguinte URL no seu navegador:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---


## Equipe

Projeto desenvolvido por equipe de 5 membros na disciplina Oficina de Integração 2 — UTFPR.
