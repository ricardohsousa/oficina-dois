import type { TermoVoluntariadoPdfData } from '../../../application/termos/services/termo-pdf-generator';
import { getBrasaoGovBase64, getUtfprLogoBase64 } from '../assets/image-loader';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderAtuacaoDescription = (descricaoAtuacao: string): string =>
  escapeHtml(descricaoAtuacao).replaceAll('\n', '<br />');

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '___/___/______';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

let brasaoGovBase64 = '';
let utfprLogoBase64 = '';

try {
  brasaoGovBase64 = getBrasaoGovBase64();
  utfprLogoBase64 = getUtfprLogoBase64();
} catch (error) {
  console.warn('Warning: Could not load logo images for PDF template');
}

export const renderTermoVoluntariadoTemplate = (
  data: TermoVoluntariadoPdfData,
): string => `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Termo de Adesão para Voluntário(a)</title>
    <style>
      @page {
        size: A4;
        margin: 15mm 20mm;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #000;
        font-size: 10pt;
        line-height: 1.3;
      }

      /* Cabeçalho */
      .header {
        text-align: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
      }
      .header-logos {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-bottom: 8px;
      }
      .header-logos img {
        height: 70px;
        width: auto;
      }
      .header-text {
        font-size: 9pt;
      }
      .header-text p {
        margin: 1px 0;
      }
      .header-title {
        font-size: 16pt;
        font-weight: bold;
        margin: 10px 0 5px;
        text-transform: uppercase;
      }
      .header-subtitle {
        font-size: 11pt;
        margin: 0;
      }
      .header-line {
        border-top: 2px solid #000;
        margin-top: 8px;
      }

      /* Seções */
      .section {
        margin-bottom: 12px;
      }
      .section-title {
        font-weight: bold;
        font-size: 10pt;
        margin-bottom: 6px;
        text-decoration: underline;
      }

      /* Campos */
      .field {
        margin: 4px 0;
        display: flex;
        align-items: baseline;
      }
      .field-label {
        font-weight: bold;
        min-width: 160px;
        font-size: 10pt;
      }
      .field-value {
        flex: 1;
        border-bottom: 1px solid #000;
        padding-bottom: 2px;
        min-height: 16px;
      }
      .field-inline {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      .field-inline .field {
        flex: 1;
        min-width: 200px;
      }

      /* Checkboxes */
      .checkbox-group {
        display: flex;
        gap: 15px;
        margin: 4px 0;
      }
      .checkbox {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 10pt;
      }
      .checkbox-box {
        width: 11px;
        height: 11px;
        border: 1px solid #000;
        display: inline-block;
        text-align: center;
        line-height: 11px;
        font-size: 8pt;
        font-weight: bold;
      }
      .checkbox-box.checked::after {
        content: "X";
      }

      /* Tabela de Cronograma */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 8px 0;
        font-size: 9pt;
      }
      table th, table td {
        border: 1px solid #000;
        padding: 4px 6px;
        text-align: center;
      }
      table th {
        background-color: #e5e7eb;
        font-weight: bold;
      }
      table td {
        height: 20px;
      }

      /* Lista de Atividades */
      .activities-box {
        border: 1px solid #000;
        padding: 8px;
        min-height: 60px;
        margin: 8px 0;
        font-size: 10pt;
      }

      /* Condições */
      .conditions {
        margin: 12px 0;
        font-size: 9.5pt;
      }
      .conditions ol {
        padding-left: 20px;
      }
      .conditions li {
        margin: 6px 0;
        text-align: justify;
      }
      .conditions ol ol {
        padding-left: 15px;
        margin-top: 4px;
      }
      .conditions ol ol li {
        margin: 3px 0;
      }

      /* Assinaturas */
      .signatures-section {
        margin-top: 30px;
        page-break-inside: avoid;
      }
      .signatures-title {
        font-weight: bold;
        font-size: 10pt;
        text-decoration: underline;
        margin-bottom: 8px;
      }
      .signatures-note {
        font-size: 9pt;
        font-style: italic;
        margin-bottom: 15px;
      }
      .signatures-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px 60px;
        margin-top: 20px;
      }
      .signature-box {
        text-align: center;
      }
      .signature-line {
        border-top: 1px solid #000;
        padding-top: 4px;
        margin-top: 50px;
        font-size: 9pt;
      }
      .signature-name {
        font-size: 8pt;
        color: #333;
        margin-top: 2px;
      }

      /* Local e Data */
      .local-data {
        margin-top: 20px;
        font-size: 10pt;
      }

      /* Rodapé */
      .footer {
        margin-top: 20px;
        font-size: 8pt;
        color: #666;
        text-align: center;
        border-top: 1px solid #ccc;
        padding-top: 5px;
      }

      /* Page break */
      .page-break {
        page-break-before: always;
      }
    </style>
  </head>
  <body>
    <!-- Cabeçalho com Logos -->
    <div class="header">
      <div class="header-logos">
        ${brasaoGovBase64 ? `<img src="${brasaoGovBase64}" alt="Brasão do Governo" />` : ''}
        <div class="header-text">
          <p>Ministério da Educação</p>
          <p><strong>Universidade Tecnológica Federal do Paraná</strong></p>
          <p>PR</p>
        </div>
        ${utfprLogoBase64 ? `<img src="${utfprLogoBase64}" alt="UTFPR" />` : ''}
      </div>
      <div style="margin: 5px 0;">
        <p style="font-size: 9pt;">Diretoria de Relações Empresariais e Comunitárias</p>
        <p style="font-size: 9pt;">Departamento de Extensão</p>
      </div>
      <div class="header-title">TERMO DE ADESÃO PARA VOLUNTÁRIO(A)</div>
      <div class="header-line"></div>
    </div>

    <!-- Dados da Instituição -->
    <div class="section">
      <div class="section-title">Dados da Instituição</div>
      <div class="field">
        <span class="field-label">Instituição:</span>
        <span class="field-value">Universidade Tecnológica Federal do Paraná – UTFPR</span>
      </div>
      <div class="field">
        <span class="field-label">Câmpus:</span>
        <span class="field-value">Cornélio Procópio.</span>
      </div>
    </div>

    <!-- Dados da Ação -->
    <div class="section">
      <div class="section-title">Dados da ação</div>
      <div class="field">
        <span class="field-label">Título da ação:</span>
        <span class="field-value">${escapeHtml(data.projetoNome)}</span>
      </div>
      <div class="field">
        <span class="field-label">Modalidade:</span>
        <span class="field-value">
          <div class="checkbox-group">
            <div class="checkbox">
              <span class="checkbox-box"></span> programa
            </div>
            <div class="checkbox">
              <span class="checkbox-box checked"></span> projeto
            </div>
            <div class="checkbox">
              <span class="checkbox-box"></span> evento
            </div>
            <div class="checkbox">
              <span class="checkbox-box"></span> curso
            </div>
          </div>
        </span>
      </div>
      <div class="field">
        <span class="field-label">Vigência</span>
        <span class="field-value">
          Início: ${formatDate(data.voluntario.dataEntrada)}. &nbsp;&nbsp;&nbsp; Término: ${formatDate(data.dataGeracao)}.
        </span>
      </div>
    </div>

    <!-- Dados da Coordenação -->
    <div class="section">
      <div class="section-title">Dados da coordenação da ação</div>
      <div class="field">
        <span class="field-label">Nome:</span>
        <span class="field-value">${escapeHtml(data.coordenador?.nome || 'Coordenação ELLP')}.</span>
      </div>
      <div class="field">
        <span class="field-label">CPF:</span>
        <span class="field-value">${escapeHtml(data.coordenador?.cpf || '---')}</span>
      </div>
      <div class="field">
        <span class="field-label">Departamento:</span>
        <span class="field-value">${escapeHtml(data.coordenador?.departamento || 'DIREXT-CP')}</span>
      </div>
      <div class="field">
        <span class="field-label">Fone:</span>
        <span class="field-value">${escapeHtml(data.coordenador?.telefone || '(43) 3520-XXXX')}</span>
      </div>
      <div class="field">
        <span class="field-label">E-mail:</span>
        <span class="field-value">${escapeHtml(data.coordenador?.email || 'coordenacao@utfpr.edu.br')}</span>
      </div>
    </div>

    <!-- Dados do Voluntário -->
    <div class="section">
      <div class="section-title">Dados do(a) Voluntário(a)</div>
      <div class="field">
        <span class="field-label">Nome:</span>
        <span class="field-value">${escapeHtml(data.voluntario.nomeCompleto)}</span>
      </div>
      <div class="field">
        <span class="field-label">CPF:</span>
        <span class="field-value">${escapeHtml(data.voluntario.cpf)}</span>
      </div>
      <div class="field">
        <span class="field-label">É estudante da UTFPR:</span>
        <span class="field-value">
          <div class="checkbox-group">
            <div class="checkbox">
              <span class="checkbox-box ${data.voluntario.isEstudante ? 'checked' : ''}"></span> sim
            </div>
            <div class="checkbox">
              <span class="checkbox-box ${!data.voluntario.isEstudante ? 'checked' : ''}"></span> não
            </div>
          </div>
        </span>
      </div>
      <div class="field-inline">
        <div class="field">
          <span class="field-label">Curso:</span>
          <span class="field-value">${escapeHtml(data.voluntario.curso || '________________________________')}</span>
        </div>
        <div class="field">
          <span class="field-label">Período:</span>
          <span class="field-value">${escapeHtml(data.voluntario.periodo || '______')}</span>
        </div>
      </div>
      <div class="field">
        <span class="field-label">Endereço:</span>
        <span class="field-value">${escapeHtml(data.voluntario.endereco)}</span>
      </div>
      <div class="field-inline">
        <div class="field">
          <span class="field-label">Cidade:</span>
          <span class="field-value">${escapeHtml(data.voluntario.cidade || 'Cornélio Procópio')}</span>
        </div>
        <div class="field">
          <span class="field-label">Estado:</span>
          <span class="field-value">${escapeHtml(data.voluntario.estado || 'PR')}</span>
        </div>
      </div>
      <div class="field-inline">
        <div class="field">
          <span class="field-label">Fones:</span>
          <span class="field-value">(${escapeHtml(data.voluntario.telefone?.substring(0, 2) || 'XX')}) ${escapeHtml(data.voluntario.telefone?.substring(2) || 'XXXX-XXXX')}</span>
        </div>
        <div class="field">
          <span class="field-label">Data nascimento:</span>
          <span class="field-value">${formatDate(data.voluntario.dataNascimento)}</span>
        </div>
      </div>
      <div class="field-inline">
        <div class="field">
          <span class="field-label">Nacionalidade:</span>
          <span class="field-value">${escapeHtml(data.voluntario.nacionalidade || 'Brasileira')}</span>
        </div>
        <div class="field">
          <span class="field-label">RA:</span>
          <span class="field-value">${escapeHtml(data.voluntario.ra || '____________')}</span>
        </div>
      </div>
      <div class="field">
        <span class="field-label">E-mail:</span>
        <span class="field-value">${escapeHtml(data.voluntario.email)}</span>
      </div>
    </div>

    <!-- Síntese das atividades -->
    <div class="section">
      <div class="section-title">Síntese das atividades a serem desenvolvidas pelo(a) voluntário(a)</div>
      <div class="activities-box">
        ${renderAtuacaoDescription(data.descricaoAtuacao)}
      </div>
    </div>

    <!-- Cronograma -->
    <div class="section">
      <div class="section-title">Cronograma das atividades a serem desenvolvidas pelo(a) voluntário(a)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 8%;">PERÍODO</th>
            <th style="width: 35%;">ATIVIDADES</th>
            <th style="width: 12%;">INÍCIO</th>
            <th style="width: 12%;">FIM</th>
            <th colspan="12" style="width: 33%;">MESES</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
            <th>12</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td style="text-align: left; padding-left: 8px;">${escapeHtml(data.descricaoAtuacao.split('\n')[0]?.substring(0, 50) || 'Atividade principal')}</td>
            <td>${formatDate(data.voluntario.dataEntrada)}</td>
            <td>${formatDate(data.dataGeracao)}</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
            <td>●</td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>3</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>4</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td>5</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Condições Gerais -->
    <div class="section conditions">
      <div class="section-title">Condições Gerais</div>
      <ol>
        <li>O(a) voluntário(a) compromete-se a:
          <ol type="a">
            <li>Dedicar-se às atividades acadêmicas e ações de extensão em ritmo compatível com as atividades exigidas pelo curso durante o ano letivo.</li>
            <li>Realizar suas atividades nos dias e horários previstos, podendo modificá-los, em comum acordo com a Coordenação da ação de Extensão.</li>
            <li>Ser assíduo, pontual e agir de forma ética nas ações extensionistas.</li>
            <li>Observar as determinações da coordenação alusivas ao bom desenvolvimento das ações de extensão.</li>
            <li>Solicitar por escrito, com anuência da Coordenação da ação de Extensão, junto à Diretoria de Relações Empresariais e Comunitárias – DIREC, ou órgão equivalente de seu Campus, permissão para afastamentos superiores a 15 dias consecutivos.</li>
            <li>Apresentar relatório parcial e final do trabalho desenvolvido à Coordenação da ação de Extensão.</li>
            <li>Participar das reuniões mensais para apresentar os resultados obtidos, receber orientação e alinhar suas atividades com as demais correntes.</li>
            <li>Qualquer ausência sem aviso prévio e não aprovada pela respectiva Coordenação resultará no desconto proporcional de pontos de atividade complementar, exceto reuniões onde serão descontados dois pontos fixos por falta.</li>
          </ol>
        </li>
        <li>Os trabalhos publicados em decorrência das ações de extensão apoiadas pela UTFPR deverão, necessariamente, fazer referência ao apoio recebido, com a seguinte expressão: "O presente trabalho foi realizado com o apoio da Universidade Tecnológica Federal do Paraná - UTFPR".</li>
        <li>O(a) Voluntário(a) declara ser conhecedor da Lei Federal N. 9.608, de 18 de fevereiro de 1998, especialmente de que o serviço voluntário "não gera vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou afim".</li>
        <li>O(a) Voluntário(a), estudante da UTFPR, contará com o seguro contra acidentes pessoais pago pela UTFPR, conforme dispositivo legal pertinente.</li>
        <li>A UTFPR não se responsabiliza por qualquer dano físico ou mental causado ao(à) estudante voluntário(a) na execução da ação de extensão.</li>
        <li>À coordenação da ação de extensão cabe supervisionar as atividades desenvolvidas pelo(a) voluntário(a), nos dias e horários previstos, e informar à DIREC sobre o cancelamento deste Termo, quando ocorrer, em até 03 dias.</li>
        <li>A UTFPR poderá cancelar ou suspender o vínculo com a atividade quando constatado que foram infringidas quaisquer das condições constantes deste termo e das normas aplicáveis ao Edital respectivo, sem prejuízo da aplicação dos dispositivos legais que disciplinam o ressarcimento dos recursos.</li>
        <li>O(a) voluntário(a) e a coordenação da ação de Extensão comprometem-se a cumprir as condições expressas neste instrumento e as normas que lhe são aplicáveis.</li>
      </ol>
    </div>

    <!-- Local e Data -->
    <div class="local-data">
      <span>Local: Cornélio Procópio</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span>Data: ${formatDate(data.dataGeracao)}</span>
    </div>

    <!-- ACEITE E CONCORDÂNCIA -->
    <div class="signatures-section">
      <div class="signatures-title">ACEITE E CONCORDÂNCIA</div>
      <div class="signatures-note">
        (Este documento deverá ser assinado pelo voluntário(a), pela coordenação da ação e pela Diretoria de Relações Empresariais e Comunitárias, sendo uma cópia arquivada na DIREC).
      </div>

      <div class="signatures-grid">
        <div class="signature-box">
          <div class="signature-line">Voluntário(a)</div>
          <div class="signature-name">${escapeHtml(data.voluntario.nomeCompleto)}</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Coordenação da ação</div>
          <div class="signature-name">${escapeHtml(data.coordenador?.nome || 'Coordenação ELLP')}</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Professor Orientador</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">DIREC</div>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="footer">
      Documento gerado automaticamente pelo sistema ELLP em ${formatDate(data.dataGeracao)}.
    </div>
  </body>
</html>
`;
