# Documento de Requisitos Consolidados

**Projeto:** Sistema de Controle de Voluntários do ELLP  
**Disciplina:** Oficina de Integração 2  
**Fase:** Planejamento  
**Equipe:** 5 membros  

---

## 1. Objetivo do Sistema

O sistema tem como objetivo apoiar o projeto de extensão **ELLP - Ensino Lúdico de Lógica e Programação** no controle de voluntários, permitindo o cadastro de voluntários, registro de datas de entrada e saída, controle de atuação em oficinas, preservação de histórico e geração automatizada do Termo de Adesão ao Trabalho Voluntário em formato PDF.

---

## 2. Escopo do Sistema

O sistema será utilizado por usuários internos autorizados do projeto ELLP para gerenciar informações de voluntários e oficinas.

Nesta versão, o sistema contemplará:

- cadastro, consulta e atualização de voluntários;
- inativação lógica de voluntários;
- controle de data de entrada e data de saída;
- cadastro e controle de oficinas;
- associação entre voluntários e oficinas;
- histórico de atuação dos voluntários;
- geração do Termo de Adesão ao Trabalho Voluntário;
- download do termo em PDF;
- controle do status da documentação;
- busca e filtros de voluntários;
- autenticação simples de usuários.

---

## 3. Decisão de Escopo: Perfis de Usuário

O sistema **não terá perfis de usuário diferentes** nesta versão.

Todos os usuários autenticados terão as mesmas permissões dentro do sistema.

Dessa forma, não serão implementados perfis como Administrador, Coordenador ou Voluntário. O acesso será controlado apenas por autenticação com e-mail e senha.

---

## 4. Requisitos Funcionais

### RF01 - Cadastro de Voluntários

O sistema deve permitir cadastrar, consultar e atualizar voluntários, contendo pelo menos os seguintes dados:

- nome completo;
- CPF;
- data de nascimento;
- e-mail;
- telefone;
- endereço.

### RF02 - Controle de Vínculo do Voluntário

O sistema deve registrar a data de entrada do voluntário no projeto.

### RF03 - Desligamento e Inativação de Voluntários

O sistema deve permitir registrar a data de saída do voluntário e inativar seu cadastro por meio de exclusão lógica, preservando seus dados e histórico de atuação.

**Regra de negócio:**  
O sistema não deve excluir permanentemente voluntários com histórico associado. A remoção de voluntário deve ocorrer por inativação lógica.

### RF04 - Gestão de Oficinas

O sistema deve permitir cadastrar, listar, atualizar e inativar oficinas do projeto, contendo pelo menos:

- nome;
- descrição;
- status;
- período de realização.

### RF05 - Associação entre Voluntários e Oficinas

O sistema deve permitir vincular um voluntário a uma ou mais oficinas ativas do projeto.

### RF06 - Histórico de Atuação

O sistema deve manter e exibir o histórico completo das oficinas em que o voluntário já trabalhou, incluindo:

- oficina;
- período de participação;
- carga horária dedicada, quando aplicável.

### RF07 - Geração do Termo de Voluntariado

O sistema deve gerar automaticamente o **Termo de Adesão ao Trabalho Voluntário** a partir de um modelo padrão do projeto, preenchendo os dados cadastrais do voluntário.

O termo deve conter, no mínimo:

- nome completo do voluntário;
- CPF;
- data de nascimento;
- endereço;
- e-mail;
- telefone;
- data de entrada no projeto;
- identificação do projeto ELLP;
- campo para descrição da atuação voluntária;
- campos para assinatura do voluntário e responsável pelo projeto.

### RF08 - Download do Termo

O sistema deve permitir o download do termo gerado em formato PDF para posterior assinatura.

### RF09 - Status de Documentação

O sistema deve permitir marcar o status do termo de voluntariado com os seguintes valores:

- Pendente de Assinatura;
- Assinado;
- Arquivado.

### RF10 - Busca e Filtros

O sistema deve possuir uma tela de listagem de voluntários com filtros por:

- nome;
- status;
- data de entrada;
- oficina.

### RF11 - Autenticação de Usuários

O sistema deve permitir que usuários autorizados acessem o sistema por meio de autenticação com e-mail e senha.

Todos os usuários autenticados terão acesso às mesmas funcionalidades do sistema.

---

## 5. Requisitos Não Funcionais

### RNF01 - Proteção de Dados Pessoais

O sistema deve adotar medidas de proteção para os dados pessoais dos voluntários, especialmente CPF, endereço, telefone e e-mail, considerando boas práticas de segurança e privacidade alinhadas à LGPD.

### RNF02 - Controle de Acesso

O sistema deve restringir o acesso às funcionalidades apenas a usuários autenticados.

Não haverá diferenciação de permissões por perfil de usuário nesta versão do sistema.

### RNF03 - Auditabilidade

O sistema deve registrar logs das principais ações realizadas, incluindo:

- cadastro de voluntário;
- atualização de voluntário;
- inativação de voluntário;
- registro de desligamento;
- geração de termo.

Cada log deve armazenar:

- usuário responsável pela ação;
- tipo da ação realizada;
- data e hora;
- registro afetado.

### RNF04 - Desempenho

A geração e o download do Termo de Voluntariado em PDF devem ocorrer em até 3 segundos em condições normais de uso.

### RNF05 - Usabilidade e Responsividade

A interface de cadastro e consulta de voluntários deve ser intuitiva e responsiva, funcionando adequadamente em computadores, tablets e smartphones.

### RNF06 - Formato de Exportação

Os documentos gerados pelo sistema devem ser disponibilizados exclusivamente em formato PDF.

### RNF07 - Preservação de Histórico

O sistema deve preservar o histórico de atuação dos voluntários, mesmo após sua inativação.

---

## 6. Regras de Negócio Consolidadas

### RN01 - Exclusão Lógica

Voluntários com histórico associado não devem ser excluídos permanentemente do banco de dados. Nesses casos, o sistema deve realizar apenas a inativação lógica do cadastro.

### RN02 - Data de Entrada

Todo voluntário cadastrado deve possuir uma data de entrada no projeto.

### RN03 - Data de Saída

A data de saída deve ser registrada apenas quando o voluntário for desligado ou inativado.

### RN04 - Associação com Oficinas Ativas

Um voluntário só poderá ser vinculado a oficinas que estejam ativas no sistema.

### RN05 - Status do Termo

O status do termo de voluntariado deve ser limitado aos seguintes valores:

- Pendente de Assinatura;
- Assinado;
- Arquivado.

### RN06 - Acesso ao Sistema

Apenas usuários autenticados poderão acessar as funcionalidades do sistema.

---

## 7. Priorização Inicial por Sprint

### Sprint 1 - Base do Sistema

Funcionalidades previstas:

- RF01 - Cadastro de Voluntários;
- RF02 - Controle de Vínculo do Voluntário;
- RF03 - Desligamento e Inativação de Voluntários;
- RF04 - Gestão de Oficinas;
- RF10 - Busca e Filtros;
- RF11 - Autenticação de Usuários.

**Objetivo da Sprint 1:**  
Entregar a base do sistema, permitindo autenticação, cadastro de voluntários, controle de vínculo, gestão de oficinas e consulta de registros.

### Sprint 2 - Histórico e Documentação

Funcionalidades previstas:

- RF05 - Associação entre Voluntários e Oficinas;
- RF06 - Histórico de Atuação;
- RF07 - Geração do Termo de Voluntariado;
- RF08 - Download do Termo;
- RF09 - Status de Documentação.

**Objetivo da Sprint 2:**  
Entregar as funcionalidades ligadas ao acompanhamento da atuação dos voluntários e à geração do termo de voluntariado.

---

## 8. Observações para Implementação

Os requisitos definidos neste documento devem ser transformados em issues no GitHub, com critérios de aceite e testes automatizados associados.

Cada funcionalidade implementada deve possuir commits vinculados à respectiva issue, permitindo rastreabilidade entre planejamento, implementação e entrega.

O gerenciamento das tarefas deve ser realizado com Kanban, organizando as atividades em colunas como:

- Backlog;
- A Fazer;
- Em Desenvolvimento;
- Em Revisão;
- Concluído.

---

## 9. Conclusão

Os requisitos consolidados estão aderentes ao objetivo do projeto ELLP e ao escopo acadêmico da disciplina Oficina de Integração 2.

O sistema prioriza funcionalidades essenciais para o controle de voluntários, preservação de histórico, organização de oficinas e geração do termo de voluntariado, mantendo o escopo viável para desenvolvimento em duas sprints.

