import { HttpError } from '../../shared/errors/http-error';
import type { PasswordHashComparer } from './services/password-hash-comparer';
import type { TokenService } from './services/token-service';
import type { UserAuthRepository } from './repositories/user-auth-repository';

type AuthenticateUserInput = {
  email: string;
  senha: string;
};

type AuthenticateUserResult = {
  accessToken: string;
  tokenType: 'Bearer';
  user: {
    id: number;
    nome: string;
    email: string;
  };
};

export class AuthenticateUser {
  constructor(
    private readonly userAuthRepository: UserAuthRepository,
    private readonly passwordHashComparer: PasswordHashComparer,
    private readonly tokenService: TokenService
  ) {}

  async execute({
    email,
    senha
  }: AuthenticateUserInput): Promise<AuthenticateUserResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || senha === '') {
      throw new HttpError({
        status: 400,
        title: 'Erro de validação',
        detail: 'E-mail e senha são obrigatórios para autenticação.',
        type: 'https://ellp.local/errors/validation-error'
      });
    }

    const user = await this.userAuthRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw this.createInvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHashComparer.compare(
      senha,
      user.senhaHash
    );

    if (!passwordMatches) {
      throw this.createInvalidCredentialsError();
    }

    return {
      accessToken: this.tokenService.sign({
        sub: String(user.id),
        email: user.email,
        nome: user.nome
      }),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    };
  }

  private createInvalidCredentialsError(): HttpError {
    return new HttpError({
      status: 401,
      title: 'Falha na autenticação',
      detail: 'E-mail ou senha inválidos.',
      type: 'https://ellp.local/errors/invalid-credentials'
    });
  }
}
