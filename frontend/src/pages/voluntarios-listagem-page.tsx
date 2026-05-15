import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { VoluntariosEmptyState } from '@/components/voluntarios/voluntarios-empty-state';
import { VoluntariosFilters } from '@/components/voluntarios/voluntarios-filters';
import { VoluntariosTable } from '@/components/voluntarios/voluntarios-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVoluntarios } from '@/hooks/use-voluntarios';
import { ApiError } from '@/lib/http';
import { toListarVoluntariosDto } from '@/services/voluntarios/listar-voluntarios';
import type { VoluntariosFiltersForm } from '@/services/voluntarios/types';

const hasActiveFilters = (filters: VoluntariosFiltersForm) =>
  filters.nome.trim().length > 0 || filters.status !== 'todos';

const getErrorMessage = (error: ApiError | null) => {
  if (!error) {
    return 'Não foi possível carregar voluntários.';
  }

  if (error.problem?.errors?.length) {
    return error.problem.errors.map((item) => `${item.field}: ${item.message}`).join(' ');
  }

  return error.problem?.detail ?? error.message;
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

export function VoluntariosListagemPage() {
  const { items, isLoading, isRefreshing, error, defaultFilters, fetchVoluntarios, refetch } =
    useVoluntarios();
  const [filters, setFilters] = useState<VoluntariosFiltersForm>(defaultFilters);

  const hasFiltersApplied = useMemo(() => hasActiveFilters(filters), [filters]);
  const errorMessage = getErrorMessage(error);
  const showFullErrorState = error && !items.length && !isLoading;
  const showInlineError = error && items.length > 0;

  const handleSubmit = async () => {
    await fetchVoluntarios(toListarVoluntariosDto(filters), {
      keepData: items.length > 0
    });
  };

  const handleClear = async () => {
    setFilters(defaultFilters);
    await fetchVoluntarios({}, { keepData: items.length > 0 });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Voluntários</h1>
          <p className="text-sm text-muted-foreground">
            Consulte os voluntários cadastrados e filtre os registros por nome e status.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Filtros</CardTitle>
            <CardDescription>Use os filtros para refinar a listagem de voluntários.</CardDescription>
          </CardHeader>
          <CardContent>
            <VoluntariosFilters
              values={filters}
              disabled={isLoading || isRefreshing}
              onChange={setFilters}
              onSubmit={() => {
                void handleSubmit();
              }}
              onClear={() => {
                void handleClear();
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Listagem</CardTitle>
              <CardDescription>
                {isRefreshing ? 'Atualizando resultados...' : `${items.length} voluntário(s) encontrado(s).`}
              </CardDescription>
            </div>
            {!isLoading && (
              <Button type="button" variant="outline" onClick={() => void refetch()} disabled={isRefreshing}>
                Atualizar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {showInlineError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não foi possível atualizar a lista</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {showFullErrorState ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não foi possível carregar voluntários</AlertTitle>
                <AlertDescription className="space-y-4">
                  <p>{errorMessage}</p>
                  <Button type="button" variant="outline" onClick={() => void refetch()}>
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {isLoading ? <TableSkeleton /> : null}

            {!isLoading && !showFullErrorState && !items.length ? (
              <VoluntariosEmptyState hasFilters={hasFiltersApplied} />
            ) : null}

            {!isLoading && items.length > 0 ? <VoluntariosTable items={items} /> : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
