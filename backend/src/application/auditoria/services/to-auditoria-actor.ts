import type { AuthTokenPayload } from '../../auth/services/token-service';
import type { AuditoriaActor } from './auditoria-context';

export const toAuditoriaActor = (auth?: AuthTokenPayload): AuditoriaActor | null => {
  if (!auth) {
    return null;
  }

  const usuarioId = Number(auth.sub);

  return {
    usuarioId: Number.isNaN(usuarioId) ? null : usuarioId,
    usuarioNome: auth.nome,
    usuarioEmail: auth.email,
  };
};
