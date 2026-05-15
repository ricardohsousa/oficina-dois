import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '@/lib/http';
import { listarVoluntarios } from '@/services/voluntarios/listar-voluntarios';
import type {
  ListarVoluntariosDto,
  VoluntarioResponseDto,
  VoluntariosFiltersForm
} from '@/services/voluntarios/types';

const defaultFilters: VoluntariosFiltersForm = {
  nome: '',
  status: 'todos'
};

export function useVoluntarios() {
  const [items, setItems] = useState<VoluntarioResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<ListarVoluntariosDto>({});

  const fetchVoluntarios = useCallback(
    async (filters: ListarVoluntariosDto = {}, options?: { keepData?: boolean }) => {
      const keepData = options?.keepData ?? false;

      if (keepData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await listarVoluntarios(filters);
        setItems(response.items);
        setAppliedFilters(filters);
      } catch (caughtError) {
        setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));

        if (!keepData) {
          setItems([]);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchVoluntarios(appliedFilters, { keepData: items.length > 0 });
  }, [appliedFilters, fetchVoluntarios, items.length]);

  useEffect(() => {
    void fetchVoluntarios();
  }, [fetchVoluntarios]);

  return {
    items,
    isLoading,
    isRefreshing,
    error,
    appliedFilters,
    defaultFilters,
    fetchVoluntarios,
    refetch
  };
}
