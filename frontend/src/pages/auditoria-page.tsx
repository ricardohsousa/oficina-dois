import { useEffect, useState } from 'react';
import { AlertCircle, Search } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError } from '@/lib/http';
import { listarRegistrosAuditoria } from '@/services/auditoria/listar-registros-auditoria';
import type { ListarRegistrosAuditoriaDto, RegistroAuditoriaResponseDto } from '@/services/auditoria/types';

type FilterState = {
  acao: string;
  entidade: string;
  entidadeId: string;
  usuarioId: string;
};

const emptyFilters: FilterState = {
  acao: '',
  entidade: '',
  entidadeId: '',
  usuarioId: ''
};

const toDto = (filters: FilterState): ListarRegistrosAuditoriaDto => ({
  ...(filters.acao.trim() ? { acao: filters.acao.trim() } : {}),
  ...(filters.entidade.trim() ? { entidade: filters.entidade.trim() } : {}),
  ...(filters.entidadeId.trim() ? { entidadeId: filters.entidadeId.trim() } : {}),
  ...(filters.usuarioId.trim() ? { usuarioId: Number(filters.usuarioId) } : {})
});

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));

export function AuditoriaPage() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [items, setItems] = useState<RegistroAuditoriaResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = async (nextFilters: ListarRegistrosAuditoriaDto = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listarRegistrosAuditoria(nextFilters);
      setItems(data);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="space-y-6 px-1 py-6 lg:px-2 lg:py-8">
      <section className="rounded-[32px] border border-white/70 bg-white/85 px-6 py-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Auditoria</p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">Consulta de auditoria</h1>
        </div>
      </section>

      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="text-xl">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              void load(toDto(filters));
            }}
          >
            {[
              ['acao', 'Ação'],
              ['entidade', 'Entidade'],
              ['entidadeId', 'ID da entidade'],
              ['usuarioId', 'ID do usuário']
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="text-sm font-medium">
                  {label}
                </label>
                <Input
                  id={key}
                  value={filters[key as keyof FilterState]}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </div>
            ))}

            <div className="flex items-end gap-3 xl:col-span-4 xl:justify-end">
              <Button type="button" variant="outline" onClick={() => {
                setFilters(emptyFilters);
                void load();
              }}>
                Limpar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao consultar auditoria</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="text-xl">Registros encontrados</CardTitle>
          <CardDescription>{items.length} item(ns) retornado(s).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando trilha de auditoria...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.acao}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.entidade}</p>
                        <p className="text-xs text-muted-foreground">{item.entidadeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.usuarioNome ?? 'Sistema'}</p>
                        <p className="text-xs text-muted-foreground">{item.usuarioEmail ?? 'Sem usuário vinculado'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-lg text-sm text-slate-600">{item.descricao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
