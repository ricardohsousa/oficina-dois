export interface PasswordHashComparer {
  compare(plainText: string, hash: string): Promise<boolean>;
}
