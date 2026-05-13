export type AuthTokenPayload = {
  sub: string;
  email: string;
  nome: string;
};

export interface TokenService {
  sign(payload: AuthTokenPayload): string;
  verify(token: string): AuthTokenPayload;
}
