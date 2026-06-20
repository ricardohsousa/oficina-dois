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
| Testes backend | node:test + tsx |
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

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18+) e **npm**
- **Docker** e **Docker Compose** (para o banco de dados PostgreSQL)

Verifique as instalações:

```bash
node --version   # v18+
npm --version    # 8+
docker --version
docker-compose --version
```

---

### 1. Setup Inicial

Clone ou entre no diretório do projeto:

```bash
cd oficina-dois
```

Instale as dependências de ambas as aplicações:

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

---

### 2. Configurar o Banco de Dados

Inicie o PostgreSQL com Docker Compose (na raiz do projeto):

```bash
docker-compose up -d
```

Verifique se o banco está pronto:

```bash
docker-compose ps
```

O status deve mostrar `healthy` para o container postgres.

Configure as migrations do banco no backend:

```bash
cd backend
npm run db:migrate
cd ..
```

Isso criará as tabelas necessárias. Se houver erro de `shadow database`, execute:

```bash
cd backend
npm run db:repair-migrations
npm run db:migrate
cd ..
```

---

### 3. Iniciar o Backend

No diretório `backend/`, inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

O backend estará disponível em **http://localhost:3000**

Você saberá que está pronto quando ver:

```
[13:45:21] ✓ ready - compilado 12 módulos em 2.3s
```

**Endpoints disponíveis:**
- API REST: http://localhost:3000/api
- Swagger/OpenAPI: http://localhost:3000/api-docs

---

### 4. Iniciar o Frontend

Em outro terminal, no diretório `frontend/`, inicie a aplicação:

```bash
npm run dev
```

O frontend estará disponível em **http://localhost:5173**

Você saberá que está pronto quando ver:

```
  ➜  Local:   http://localhost:5173/
```

---

### 5. Acessar a Aplicação

Abra seu navegador e acesse:

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:3000/api-docs

Você pode fazer login com credenciais de teste (se houver seed configurado) ou criar um novo usuário.

---

### Executando Tudo Simultaneamente (Recomendado para Desenvolvimento)

Abra 3 terminais:

**Terminal 1 - Banco de dados:**
```bash
docker-compose up
```

**Terminal 2 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend && npm run dev
```

Ou use um gerenciador como `tmux`, `screen`, ou IDE com múltiplos terminais.

---

### Parar a Aplicação

Para parar tudo:

```bash
# Backend e Frontend: Ctrl+C em cada terminal

# Banco de dados:
docker-compose down
```

Para remover dados do banco (importante ao reiniciar):

```bash
docker-compose down -v
```

---

### Reparar histórico local do Prisma

Se `npm run db:migrate` falhar com erro de `shadow database` nas migrations antigas:

```bash
cd backend
npm run db:repair-migrations
npm run db:migrate
cd ..
```

O comando atualiza os checksums das migrations legadas em `_prisma_migrations` no banco local para mantê-las compatíveis com a versão corrigida do repositório.

### Documentação da API

A documentação da API é gerada automaticamente usando Swagger/OpenAPI.

**Pré-requisito:** Backend rodando em http://localhost:3000

**Como acessar:**

1. Abra [http://localhost:3000/api-docs](http://localhost:3000/api-docs) no navegador
2. Você verá uma interface interativa com todos os endpoints
3. Pode testar os endpoints diretamente de lá usando o botão "Try it out"

**Principais endpoints:**

```
Voluntários:
  POST /api/voluntarios           # Criar voluntário
  GET /api/voluntarios            # Listar voluntários
  GET /api/voluntarios/:id        # Obter voluntário específico
  PUT /api/voluntarios/:id        # Atualizar voluntário
  DELETE /api/voluntarios/:id     # Inativar voluntário

Oficinas:
  POST /api/oficinas              # Criar oficina
  GET /api/oficinas               # Listar oficinas
  PUT /api/oficinas/:id           # Atualizar oficina
  DELETE /api/oficinas/:id        # Inativar oficina

Atuações:
  POST /api/atuacoes              # Registrar atuação de voluntário em oficina
  GET /api/atuacoes               # Listar atuações

Termos (PDF):
  POST /api/voluntarios/:id/termo # Gerar termo de adesão em PDF
  GET /api/termos/:id/download    # Fazer download do termo gerado

Auditoria:
  GET /api/auditorias             # Listar ações auditadas no sistema
```

Para detalhes completos, acesse a documentação interativa Swagger.

---

## Testes

O backend utiliza o runner nativo do Node.js (`node:test`) com TypeScript via `tsx`. Os testes são unitários com mocks inline — sem dependências externas de test framework.

### Estrutura

```
backend/tests/
├── atuacoes/        # Testes de vinculação voluntário-oficina
├── auditoria/       # Testes do módulo de auditoria
├── oficinas/        # Testes de criação, atualização e inativação de oficinas
├── termos/          # Testes de geração e download do termo PDF
└── voluntarios/     # Testes de cadastro, edição e inativação de voluntários
```

### Rodar Testes

Entre no diretório `backend/` e execute:

```bash
# Rodar todos os testes
npm test

# Rodar testes com relatório de cobertura (experimentação)
npm run test:coverage

# Rodar testes em modo watch (com --watch, se disponível)
npm test -- --watch
```

### Meta de cobertura

| Camada | Meta mínima |
|--------|------------|
| `domain` e `application` | 80% |
| Backend global | 70% |

### Exemplo de saída esperada

```
✓ tests/voluntarios/criar.test.ts (5 testes) 234ms
✓ tests/oficinas/criar.test.ts (3 testes) 156ms
✓ tests/auditoria/registrar.test.ts (2 testes) 89ms
---
Testes: 10 passaram, 0 falharam
```

---

## Troubleshooting

### ❌ "Connection refused" ao iniciar backend

**Causa:** Banco de dados não está rodando ou não está pronto.

**Solução:**
```bash
# Verifique se Docker está rodando
docker ps

# Inicie o Docker Compose
docker-compose up -d

# Aguarde 10-15 segundos e tente conectar novamente
npm run dev
```

---

### ❌ Porta 5432 já está em uso

**Causa:** Outro PostgreSQL já está rodando naquela porta.

**Solução - Opção 1:** Use outra porta
```bash
# Modifique docker-compose.yml
# Mude a linha de ports para:
#   - '5433:5432'

# E atualize backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/oficina_dois_dev?schema=public"
```

**Solução - Opção 2:** Pare o serviço anterior
```bash
# No Linux/Mac
lsof -i :5432
kill -9 <PID>

# No Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

---

### ❌ Erro ao rodar migrations: "shadow database error"

**Causa:** Histórico de migrations corrompido.

**Solução:**
```bash
cd backend
npm run db:repair-migrations
npm run db:migrate
```

Se persistir:
```bash
# Limpe o banco completamente
docker-compose down -v
docker-compose up -d

# Aguarde o banco ficar pronto (15 segundos)
sleep 15

npm run db:migrate
```

---

### ❌ "Cannot find module" ao rodar backend

**Causa:** Dependências não foram instaladas ou estão desatualizadas.

**Solução:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ Frontend não consegue conectar à API

**Causa:** API backend não está rodando ou tem CORS desabilitado.

**Solução:**

1. Verifique se o backend está rodando:
```bash
curl http://localhost:3000/api-docs
```

2. Verifique a URL base no frontend (geralmente em `src/services/api.ts` ou similar):
```typescript
// Deve estar apontando para:
const API_BASE_URL = 'http://localhost:3000/api';
```

3. Se aparecer erro de CORS no console do navegador:
   - Verifique se o backend tem `cors` configurado
   - Verifique se o frontend está fazendo requisições para `http://localhost:3000`

---

### ❌ Testes do backend falhando

**Causa comum 1:** Banco de dados em estado inconsistente

**Solução:**
```bash
cd backend

# Resetar migrações
npm run db:repair-migrations

# Refazer migrations
npm run db:migrate

# Rodar testes
npm test
```

**Causa comum 2:** Dependências desatualizadas

**Solução:**
```bash
cd backend
npm install
npm test
```

---

### ❌ Porta 3000 ou 5173 já está em uso

```bash
# Encontre o processo usando a porta (Linux/Mac)
lsof -i :3000
lsof -i :5173

# Ou use outra porta
# Backend: edite src/server.ts
# Frontend: execute "npm run dev -- --port 5174"
```

---

### ❌ Velocidade lenta no desenvolvimento (especialmente com WSL2)

**Causa:** Acesso a arquivos entre Windows e WSL é lento.

**Solução:** Clone o projeto dentro do WSL

```bash
# Em vez de C:\Users\...\projeto
# Use: /home/usuario/projeto
```

---

### 💡 Limpeza Completa (Nuclear Option)

Se nada funcionar, comece do zero:

```bash
# 1. Limpe containers e volumes Docker
docker-compose down -v

# 2. Remova node_modules
rm -rf backend/node_modules frontend/node_modules

# 3. Comece de novo
docker-compose up -d
sleep 15

cd backend
npm install
npm run db:migrate
npm run dev

# Em outro terminal
cd frontend
npm install
npm run dev
```

---

## Recursos Úteis

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Equipe

Projeto desenvolvido por equipe de 5 membros na disciplina Oficina de Integração 2 — UTFPR.
