import bcrypt from 'bcrypt';

import type { PasswordHashComparer } from '../../application/auth/services/password-hash-comparer';

export class BcryptPasswordHashComparer implements PasswordHashComparer {
  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
