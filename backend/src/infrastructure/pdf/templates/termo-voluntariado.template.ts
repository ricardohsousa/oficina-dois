import type { TermoVoluntariadoPdfData } from '../../../application/termos/services/termo-pdf-generator';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderAtuacaoDescription = (descricaoAtuacao: string): string =>
  escapeHtml(descricaoAtuacao).replaceAll('\n', '<br />');

export const renderTermoVoluntariadoTemplate = (
  data: TermoVoluntariadoPdfData,
): string => `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Termo de Voluntariado</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #1f2937;
        margin: 40px;
        line-height: 1.5;
      }
      h1, h2 {
        text-align: center;
        margin: 0;
      }
      h1 {
        font-size: 20px;
        margin-bottom: 8px;
      }
      h2 {
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 24px;
      }
      p {
        margin: 10px 0;
        text-align: justify;
      }
      .section-title {
        font-weight: bold;
        margin-top: 24px;
      }
      .box {
        border: 1px solid #d1d5db;
        padding: 14px;
        border-radius: 6px;
        margin-top: 12px;
      }
      .signatures {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-top: 56px;
      }
      .signature {
        flex: 1;
        text-align: center;
      }
      .signature-line {
        border-top: 1px solid #111827;
        padding-top: 8px;
      }
      .muted {
        color: #4b5563;
      }
    </style>
  </head>
  <body>
    <h1>Termo de Adesão ao Trabalho Voluntário</h1>
    <h2>${escapeHtml(data.projetoNome)}</h2>

    <p>
      Pelo presente termo, o(a) voluntário(a) <strong>${escapeHtml(data.voluntario.nomeCompleto)}</strong>,
      CPF <strong>${escapeHtml(data.voluntario.cpf)}</strong>, nascido(a) em
      <strong>${escapeHtml(data.voluntario.dataNascimento)}</strong>, residente em
      <strong>${escapeHtml(data.voluntario.endereco)}</strong>, com e-mail
      <strong>${escapeHtml(data.voluntario.email)}</strong> e telefone
      <strong>${escapeHtml(data.voluntario.telefone)}</strong>, manifesta adesão às
      atividades voluntárias vinculadas ao projeto <strong>${escapeHtml(data.projetoNome)}</strong>.
    </p>

    <p>
      O vínculo voluntário teve início em <strong>${escapeHtml(data.voluntario.dataEntrada)}</strong>,
      sendo este termo emitido em <strong>${escapeHtml(data.dataGeracao)}</strong> para registro
      formal de participação no projeto.
    </p>

    <p class="section-title">Descrição da atuação voluntária</p>
    <div class="box">${renderAtuacaoDescription(data.descricaoAtuacao)}</div>

    <p class="section-title">Declaração</p>
    <p>
      O(a) voluntário(a) declara estar ciente de que exercerá suas atividades em caráter voluntário,
      sem vínculo empregatício, obrigação de natureza trabalhista, previdenciária ou afim, nos termos
      da legislação aplicável.
    </p>

    <div class="signatures">
      <div class="signature">
        <div class="signature-line">Assinatura do(a) voluntário(a)</div>
      </div>
      <div class="signature">
        <div class="signature-line">Responsável pelo projeto</div>
      </div>
    </div>

    <p class="muted">Documento gerado automaticamente pelo sistema em ${escapeHtml(data.dataGeracao)}.</p>
  </body>
</html>
`;
