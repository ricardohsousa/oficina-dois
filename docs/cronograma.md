# Cronograma do Projeto - Sistema de Controle de Voluntários do ELLP

**Projeto:** Sistema de Controle de Voluntários do ELLP  
**Disciplina:** Oficina de Integração 2  
**Fase:** Planejamento  
**Equipe:** 5 membros  

---

## 1. Objetivo do Cronograma

Este cronograma tem como objetivo organizar as atividades do projeto ao longo de duas semanas, contemplando planejamento, configuração do ambiente, implementação das funcionalidades em duas sprints, criação de testes automatizados e as entregas previstas.

O desenvolvimento seguirá uma abordagem incremental, utilizando Scrum durante a implementação, com acompanhamento das tarefas por Kanban no Trello e registro das funcionalidades como issues no GitHub.

---

## 2. Organização Geral

O projeto será dividido em dois momentos principais:

1. Semana 1 — Planejamento, organização, configuração técnica e Sprint 1;
2. Semana 2 — Sprint 2, ajustes finais e entrega.

---

## 3. Cronograma por Etapas

| Etapa | Período | Atividades principais | Entregáveis |
|---|---|---|---|
| Planejamento e organização | Semana 1 — Dias 1 e 2 | Definir escopo, requisitos, arquitetura, estratégia de testes, criar repositório e quadro Kanban | Documentos de planejamento, repositório e Kanban |
| Configuração técnica | Semana 1 — Dia 3 | Configurar backend, frontend, banco de dados, Prisma, Swagger e ambiente de testes | Ambiente inicial funcionando |
| Sprint 1 | Semana 1 — Dias 4 a 7 | Implementar base do sistema: autenticação, voluntários, oficinas, filtros e testes | Funcionalidades da Sprint 1 entregues |
| Sprint Review 1 | Semana 1 — Dia 7 | Apresentar funcionalidades entregues, testes e pendências | Revisão da Sprint 1 |
| Sprint 2 | Semana 2 — Dias 8 a 11 | Implementar associação, histórico, geração/download do termo, status e auditoria | Funcionalidades da Sprint 2 entregues |
| Sprint Review 2 | Semana 2 — Dia 11 | Apresentar funcionalidades finais, testes e evidências no GitHub | Revisão da Sprint 2 |
| Ajustes finais e entrega | Semana 2 — Dias 12 a 14 | Corrigir pendências, revisar documentação, executar testes e preparar entrega final | Projeto final revisado e pronto para avaliação |

---

## 4. Cronograma Detalhado

## Semana 1, Dias 1 e 2 — Planejamento e Organização

Atividades:

- definir o escopo do sistema;
- consolidar requisitos funcionais;
- consolidar requisitos não funcionais;
- definir regras de negócio;
- definir tecnologias utilizadas;
- definir arquitetura em alto nível;
- definir estratégia de automação de testes;
- definir cronograma;
- criar repositório público no GitHub;
- criar README inicial;
- organizar pasta `docs/`;
- criar quadro Kanban no Trello;
- cadastrar cards do backlog;
- criar issues iniciais no GitHub;
- definir padrão de branches e commits.

Responsáveis:

- todos os membros da equipe.

Entregáveis:

- `docs/requisitos.md`;
- `docs/arquitetura.md`;
- `docs/testes.md`;
- `docs/cronograma.md`;
- repositório público criado;
- README inicial;
- quadro Kanban configurado;
- backlog inicial no Trello;
- issues iniciais no GitHub.

---

## Semana 1, Dia 3 — Configuração Técnica

Atividades:

- configurar backend com Node.js, Express e TypeScript;
- configurar estrutura em camadas inspirada em DDD;
- configurar frontend com React e shadcn/ui;
- configurar PostgreSQL;
- configurar Prisma ORM;
- configurar Swagger/OpenAPI;
- configurar ambiente de testes com Vitest, Supertest, React Testing Library e Playwright;
- configurar `.env`, `.gitignore` e scripts principais.

Entregáveis:

- backend executando localmente;
- frontend executando localmente;
- conexão com banco funcionando;
- Prisma configurado;
- Swagger acessível;
- testes iniciais funcionando.

---

## Semana 1, Dias 4 a 6 — Sprint 1: Implementação

Funcionalidades previstas:

- autenticação com JWT;
- cadastro de voluntários;
- controle de data de entrada;
- listagem e consulta de voluntários;
- atualização de voluntários;
- inativação de voluntários;
- cadastro, atualização e inativação de oficinas;
- busca e filtros de voluntários.

Atividades técnicas:

- criar issues da Sprint 1;
- criar branches por issue;
- implementar endpoints;
- criar validações com Zod;
- documentar endpoints no Swagger;
- criar testes unitários e de API;
- revisar pull requests;
- verificar cobertura mínima.

Entregáveis:

- login funcional;
- cadastro, listagem, atualização e inativação de voluntários;
- cadastro, atualização e inativação de oficinas;
- busca e filtros funcionando;
- endpoints documentados;
- testes da Sprint 1 criados e executados.

---

## Semana 1, Dia 7 — Sprint Review 1

Atividades:

- apresentar funcionalidades entregues;
- validar testes automatizados;
- registrar pendências;
- fechar issues da Sprint 1.

Entregáveis:

- Sprint 1 concluída;
- issues da Sprint 1 fechadas;
- apresentação da Sprint Review 1.

---

## Semana 2, Dias 8 a 10 — Sprint 2: Implementação

Funcionalidades previstas:

- associação entre voluntários e oficinas;
- histórico de atuação;
- geração do termo de voluntariado em PDF;
- download do termo;
- status do termo;
- auditoria de ações relevantes;
- testes E2E dos fluxos principais.

Atividades técnicas:

- criar issues da Sprint 2;
- criar branches por issue;
- implementar relacionamento entre voluntários e oficinas;
- implementar consulta de histórico;
- criar template HTML do termo;
- gerar PDF com Puppeteer;
- salvar referência do PDF no banco;
- implementar download e status do termo;
- implementar logs de auditoria;
- criar testes de integração e E2E;
- revisar pull requests.

Entregáveis:

- associação voluntário-oficina funcional;
- histórico de atuação funcional;
- geração e download de termo funcionando;
- status do termo implementado;
- auditoria implementada;
- testes da Sprint 2 criados e executados.

---

## Semana 2, Dia 11 — Sprint Review 2

Atividades:

- apresentar funcionalidades finais;
- validar testes automatizados e E2E;
- registrar evidências no GitHub;
- fechar issues da Sprint 2.

Entregáveis:

- Sprint 2 concluída;
- issues da Sprint 2 fechadas;
- apresentação da Sprint Review 2.

---

## Semana 2, Dias 12 a 14 — Ajustes Finais e Entrega

Atividades:

- revisar documentação final;
- revisar README;
- validar instruções de instalação e execução;
- executar todos os testes;
- corrigir pendências identificadas nas reviews;
- garantir que issues, commits e pull requests estejam vinculados;
- preparar entrega final do projeto.

Entregáveis:

- README final atualizado;
- documentação final revisada;
- testes passando;
- repositório organizado;
- evidências de issues, commits e pull requests;
- projeto pronto para avaliação.

---

## 5. Distribuição Inicial de Responsabilidades

| Membro | Responsabilidade principal |
|---|---|
| Membro 1 | Backend: voluntários, autenticação e inativação |
| Membro 2 | Backend: oficinas, associação e histórico |
| Membro 3 | Frontend: telas, formulários, listagens e filtros |
| Membro 4 | PDF, Swagger/OpenAPI, documentação da API e integração |
| Membro 5 | Testes automatizados, cobertura, revisão e documentação |

Observação: a divisão pode ser ajustada durante as sprints conforme disponibilidade da equipe e complexidade das tarefas.

---

## 6. Relação com Scrum e Kanban

Durante a implementação, o projeto seguirá Scrum com duas sprints.

Cada sprint deverá conter:

- planejamento da sprint;
- seleção das issues a serem implementadas;
- acompanhamento das tarefas no Trello;
- desenvolvimento em branches específicas;
- commits vinculados às issues;
- pull requests para revisão;
- testes automatizados;
- sprint review ao final.

O Kanban no Trello será organizado com as seguintes colunas:

- Backlog;
- Sprint Atual / A Fazer;
- Em Desenvolvimento;
- Em Revisão;
- Em Testes;
- Concluído;
- Bloqueado.

---

## 7. Critérios de Conclusão das Atividades

Uma atividade será considerada concluída quando:

- os critérios de aceite forem atendidos;
- os testes necessários forem criados ou atualizados;
- os testes executarem com sucesso;
- a documentação for atualizada, quando necessário;
- a issue correspondente estiver vinculada aos commits;
- o pull request for revisado e integrado à branch principal;
- o card correspondente no Trello for movido para Concluído.

---

## 8. Conclusão

O cronograma proposto organiza o desenvolvimento do sistema em duas semanas, de forma incremental e intensiva. A Semana 1 concentra planejamento, configuração técnica e a primeira sprint. A Semana 2 cobre a segunda sprint, os ajustes finais e a entrega.

A divisão permite acompanhar o progresso com clareza, mantendo rastreabilidade entre requisitos, issues, commits, testes e entregas.
