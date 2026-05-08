# Estratégia de Automação de Testes - Sistema de Controle de Voluntários do ELLP

**Projeto:** Sistema de Controle de Voluntários do ELLP  
**Disciplina:** Oficina de Integração 2  
**Fase:** Planejamento  
**Etapa:** Definição da Estratégia de Automação de Testes do Sistema  

---

## 1. Objetivo da Estratégia de Testes

A estratégia de automação de testes tem como objetivo garantir a qualidade do sistema durante sua implementação, validando regras de negócio, integração entre camadas, funcionamento da API, comportamento da interface e fluxos principais da aplicação.

Os testes automatizados serão utilizados para:

- reduzir erros durante a evolução do sistema;
- validar os requisitos implementados;
- apoiar as entregas das sprints;
- garantir rastreabilidade entre requisitos, issues, commits e testes;
- medir cobertura mínima de código;
- facilitar manutenção e refatoração.

---

## 2. Abordagem Geral

O sistema seguirá uma estratégia de testes baseada em camadas, alinhada à arquitetura inspirada em DDD.

Serão considerados os seguintes níveis de teste:

1. Testes unitários;
2. Testes de integração;
3. Testes de API;
4. Testes de componentes frontend;
5. Testes end-to-end;
6. Testes de cobertura.

---

## 3. Ferramentas de Teste

| Área | Ferramenta |
|---|---|
| Testes unitários backend | Vitest |
| Testes de integração backend | Vitest + Supertest |
| Testes de API HTTP | Supertest |
| Testes frontend | Vitest + React Testing Library |
| Testes end-to-end | Playwright |
| Cobertura de testes | Vitest Coverage |
| Validação de dados | Zod |
| Banco de testes | PostgreSQL em ambiente de teste |
| ORM | Prisma ORM |
| Documentação da API | Swagger/OpenAPI |

---

## 4. Justificativa das Ferramentas

O **Vitest** será utilizado como test runner principal por funcionar bem com TypeScript, frontend e backend, além de possuir suporte a execução de testes e cobertura de código. A documentação oficial do Vitest indica suporte a execução com `vitest run` e opção de cobertura com `--coverage`. :contentReference[oaicite:0]{index=0}

A **React Testing Library** será usada nos testes de frontend porque incentiva testes baseados na forma como o usuário interage com a interface, evitando dependência excessiva de detalhes internos dos componentes. :contentReference[oaicite:1]{index=1}

O **Supertest** será usado para testar endpoints HTTP da API Express, pois é uma biblioteca voltada para testes de servidores HTTP em Node.js. :contentReference[oaicite:2]{index=2}

O **Playwright** será utilizado para testes end-to-end dos fluxos principais, pois é uma ferramenta voltada à automação e teste de aplicações web em navegadores modernos. :contentReference[oaicite:3]{index=3}

---

## 5. Estratégia de Testes por Camada

## 5.1 Camada de Domínio

A camada de domínio concentra as entidades e regras de negócio principais do sistema.

Tipo de teste:

- testes unitários.

Ferramenta:

- Vitest.

O que testar:

- criação de entidades válidas;
- validações de regras de negócio;
- impedimento de operações inválidas;
- comportamento de entidades como Voluntário, Oficina, Atuação e Termo de Voluntariado.

Exemplos de cenários:

- deve criar voluntário com dados obrigatórios;
- deve impedir inativação sem data de saída, caso essa regra esteja definida;
- deve impedir vínculo com oficina inativa;
- deve manter histórico mesmo com voluntário inativo;
- deve aceitar apenas status válidos para o termo.

---

## 5.2 Camada de Aplicação

A camada de aplicação contém os casos de uso do sistema.

Tipo de teste:

- testes unitários;
- testes de integração com repositórios mockados.

Ferramenta:

- Vitest.

O que testar:

- execução dos casos de uso;
- chamadas corretas aos repositórios;
- retorno esperado para cada operação;
- tratamento de erros esperados;
- integração entre casos de uso e regras de domínio.

Exemplos de casos de uso testados:

- cadastrar voluntário;
- atualizar voluntário;
- inativar voluntário;
- cadastrar oficina;
- associar voluntário a oficina;
- gerar termo de voluntariado;
- atualizar status do termo.

---

## 5.3 Camada de Infraestrutura e Dados

A camada de infraestrutura contém detalhes técnicos como banco de dados, Prisma ORM, JWT, bcrypt, Puppeteer e geração de PDF.

Tipo de teste:

- testes de integração.

Ferramentas:

- Vitest;
- Prisma;
- PostgreSQL em ambiente de teste.

O que testar:

- persistência de dados com Prisma;
- criação e consulta de registros;
- relacionamento entre voluntários e oficinas;
- gravação de histórico;
- gravação de referência do PDF;
- gravação de logs de auditoria.

Estratégia:

- utilizar um banco PostgreSQL separado para testes;
- limpar os dados antes ou depois de cada conjunto de testes;
- evitar usar o banco de desenvolvimento para testes automatizados;
- executar migrations no ambiente de teste antes dos testes de integração.

---

## 5.4 Camada de API

A camada de API será testada para validar os endpoints HTTP expostos pelo backend.

Tipo de teste:

- testes de integração de API.

Ferramentas:

- Vitest;
- Supertest.

O que testar:

- códigos HTTP retornados;
- formato das respostas;
- autenticação via JWT;
- validação de entrada com Zod;
- padrão de erro baseado em Problem Details;
- integração entre controller, caso de uso e banco de dados.

Exemplos de cenários:

- `POST /login` deve autenticar usuário válido;
- `POST /voluntarios` deve cadastrar voluntário autenticado;
- `POST /voluntarios` deve retornar erro 400 para dados inválidos;
- `GET /voluntarios` deve listar voluntários;
- `PATCH /voluntarios/{id}/inativar` deve inativar voluntário;
- `POST /voluntarios/{id}/termo` deve gerar termo;
- `GET /termos/{id}/download` deve retornar arquivo PDF.

---

## 5.5 Camada de Frontend

A camada frontend será testada para validar componentes, formulários e comportamentos visíveis ao usuário.

Tipo de teste:

- testes de componentes;
- testes de interação.

Ferramentas:

- Vitest;
- React Testing Library.

O que testar:

- renderização de telas;
- campos obrigatórios;
- mensagens de erro;
- envio de formulários;
- listagens e filtros;
- comportamento de botões;
- consumo simulado da API.

Exemplos de cenários:

- tela de login deve renderizar campos de e-mail e senha;
- formulário de voluntário deve exibir campos obrigatórios;
- listagem deve exibir voluntários retornados pela API;
- filtro por nome deve atualizar a listagem;
- botão de gerar termo deve chamar a ação esperada.

---

## 5.6 Testes End-to-End

Os testes end-to-end validam fluxos completos do sistema, simulando o comportamento real do usuário.

Tipo de teste:

- testes E2E.

Ferramenta:

- Playwright.

Fluxos recomendados:

1. autenticação de usuário;
2. cadastro de voluntário;
3. cadastro de oficina;
4. associação de voluntário a oficina;
5. geração e download do termo de voluntariado;
6. inativação de voluntário.

Esses testes devem ser usados com moderação, cobrindo apenas os fluxos mais importantes, pois são mais lentos e dependem da aplicação completa em execução.

---

## 6. Estratégia de Cobertura

A cobertura de testes será acompanhada com Vitest Coverage.

Meta inicial de cobertura:

| Camada | Cobertura mínima recomendada |
|---|---:|
| Domínio | 80% |
| Aplicação | 80% |
| API/backend geral | 70% |
| Frontend | 60% |
| Cobertura global mínima | 70% |

A equipe deverá priorizar cobertura nas regras de negócio e casos de uso principais, evitando buscar 100% de cobertura apenas por métrica.

Arquivos que podem ser excluídos da cobertura:

- arquivos de configuração;
- arquivos de inicialização do servidor;
- arquivos de tipagem pura;
- arquivos gerados automaticamente;
- migrations do Prisma;
- documentação Swagger/OpenAPI.

---

## 7. Estratégia de Banco de Dados para Testes

Será utilizado um banco PostgreSQL separado para testes automatizados.

Ambientes previstos:

```txt
Banco de desenvolvimento: ellp_dev
Banco de testes: ellp_test