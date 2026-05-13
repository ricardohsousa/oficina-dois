import type { PrismaClient } from '@prisma/client';

import type {
  UserAuthRepository,
  UserCredentials
} from '../../../../application/auth/repositories/user-auth-repository';

export class PrismaUserAuthRepository implements UserAuthRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const user = await this.prismaClient.usuario.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      senhaHash: user.senhaHash
    };
  }
}
