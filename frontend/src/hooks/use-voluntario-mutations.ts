import { useCallback, useState } from 'react';

import { ApiError } from '@/lib/http';
import { atualizarVoluntario } from '@/services/voluntarios/atualizar-voluntario';
import { criarVoluntario } from '@/services/voluntarios/criar-voluntario';
import { inativarVoluntario } from '@/services/voluntarios/inativar-voluntario';
import { obterVoluntario } from '@/services/voluntarios/obter-voluntario';
import type {
  AtualizarVoluntarioDto,
  CriarVoluntarioDto,
  InativarVoluntarioDto,
  VoluntarioResponseDto
} from '@/services/voluntarios/types';

// ── useObterVoluntario ────────────────────────────────────────────────────────

export function useObterVoluntario() {
  const [voluntario, setVoluntario] = useState<VoluntarioResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetch = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await obterVoluntario(id);
      setVoluntario(data);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      setVoluntario(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { voluntario, isLoading, error, fetch };
}

// ── useCriarVoluntario ────────────────────────────────────────────────────────

type MutationState = {
  isLoading: boolean;
  error: ApiError | null;
};

export function useCriarVoluntario(onSuccess?: (v: VoluntarioResponseDto) => void) {
  const [state, setState] = useState<MutationState>({ isLoading: false, error: null });

  const execute = useCallback(
    async (data: CriarVoluntarioDto) => {
      setState({ isLoading: true, error: null });

      try {
        const result = await criarVoluntario(data);
        setState({ isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (caughtError) {
        const apiError = caughtError instanceof ApiError ? caughtError : new ApiError(0);
        setState({ isLoading: false, error: apiError });
        throw apiError;
      }
    },
    [onSuccess]
  );

  return { ...state, execute };
}

// ── useAtualizarVoluntario ────────────────────────────────────────────────────

export function useAtualizarVoluntario(onSuccess?: (v: VoluntarioResponseDto) => void) {
  const [state, setState] = useState<MutationState>({ isLoading: false, error: null });

  const execute = useCallback(
    async (id: string, data: AtualizarVoluntarioDto) => {
      setState({ isLoading: true, error: null });

      try {
        const result = await atualizarVoluntario(id, data);
        setState({ isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (caughtError) {
        const apiError = caughtError instanceof ApiError ? caughtError : new ApiError(0);
        setState({ isLoading: false, error: apiError });
        throw apiError;
      }
    },
    [onSuccess]
  );

  return { ...state, execute };
}

// ── useInativarVoluntario ─────────────────────────────────────────────────────

export function useInativarVoluntario(onSuccess?: (v: VoluntarioResponseDto) => void) {
  const [state, setState] = useState<MutationState>({ isLoading: false, error: null });

  const execute = useCallback(
    async (id: string, data: InativarVoluntarioDto) => {
      setState({ isLoading: true, error: null });

      try {
        const result = await inativarVoluntario(id, data);
        setState({ isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (caughtError) {
        const apiError = caughtError instanceof ApiError ? caughtError : new ApiError(0);
        setState({ isLoading: false, error: apiError });
        throw apiError;
      }
    },
    [onSuccess]
  );

  return { ...state, execute };
}
