export type AuthenticatedUser = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

export type LoginRequestDto = {
  email: string;
  senha: string;
};

export type LoginResponseDto = {
  accessToken: string;
  tokenType: string;
  user: AuthenticatedUser;
};
