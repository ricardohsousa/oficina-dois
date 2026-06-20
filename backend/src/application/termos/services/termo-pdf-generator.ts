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
    isEstudante?: boolean;
    curso?: string;
    nacionalidade?: string;
    periodo?: string;
    ra?: string;
    cidade?: string;
    estado?: string;
  };
  coordenador?: {
    nome: string;
    cpf: string;
    departamento: string;
    telefone: string;
    email: string;
  };
  projetoNome: string;
  dataGeracao: string;
  descricaoAtuacao: string;
};

export interface TermoPdfGenerator {
  generate(data: TermoVoluntariadoPdfData): Promise<Buffer>;
}
