export type AuthTokenPayload = {
  sub: string;
  email: string;
  nome: string;
  role: string;
};

export interface TokenService {
  sign(payload: AuthTokenPayload): string;
  verify(token: string): AuthTokenPayload;
}
