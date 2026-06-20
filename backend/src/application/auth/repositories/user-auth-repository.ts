export type UserCredentials = {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  role: string;
};

export interface UserAuthRepository {
  findByEmail(email: string): Promise<UserCredentials | null>;
}
