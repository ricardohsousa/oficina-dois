export type VoluntarioResponseDto = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
  dataSaida: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};
