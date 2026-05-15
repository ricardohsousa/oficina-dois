export type TermoVoluntariadoPdfData = {
  voluntario: {
    id: string;
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    endereco: string;
    dataEntrada: string;
  };
  projetoNome: string;
  dataGeracao: string;
  descricaoAtuacao: string;
};

export interface TermoPdfGenerator {
  generate(data: TermoVoluntariadoPdfData): Promise<Buffer>;
}
