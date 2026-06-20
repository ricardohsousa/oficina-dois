import { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, AlertCircle, Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import type { OficinaResponseDto } from '@/services/oficinas/types';
import { ApiError } from '@/lib/http';

export function ProfessorDashboard() {
  const [minhasOficinas, setMinhasOficinas] = useState<OficinaResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    listarOficinas()
      .then((oficinas) => {
        setMinhasOficinas(oficinas);
        setError(null);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const totalVoluntarios = minhasOficinas.reduce((acc, o) => acc + (o.voluntarios?.length || 0), 0);
  const atividadesTotal = minhasOficinas.reduce((acc, o) => acc + (o.atividades?.length || 0), 0);

  return (
    <main className="space-y-8 px-1 py-6 lg:px-2 lg:py-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-purple-700">
            Dashboard Professor
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">
            Suas oficinas e voluntários
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Acompanhe suas oficinas, voluntários inscritos e próximas atividades.
          </p>
        </div>
      </section>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Novo: Gestão de Voluntários</AlertTitle>
        <AlertDescription className="text-blue-800">
          Agora você pode acessar e gerenciar os voluntários das suas oficinas. Veja a seção "Voluntários" no menu.
        </AlertDescription>
      </Alert>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar dados</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Quick Metrics */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="animate-slideUp" style={{ animationDelay: '0s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription className="text-xs font-medium">Minhas Oficinas</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : minhasOficinas.length}
              </CardTitle>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-xs font-medium">Total de Voluntários</CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : totalVoluntarios}
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-xs font-medium">Atividades Planejadas</CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : atividadesTotal}
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Minhas Oficinas */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-950">Minhas Oficinas</h2>
          <p className="text-sm text-slate-600">Gerencie suas oficinas e voluntários</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : minhasOficinas.length === 0 ? (
          <Card className="border-dashed border-purple-200 bg-purple-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-purple-300 mb-4" />
              <p className="text-sm font-medium text-purple-900">Nenhuma oficina encontrada</p>
              <p className="text-xs text-purple-700 mt-1">Você não está vinculado a nenhuma oficina</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {minhasOficinas.map((oficina, index) => (
              <div key={oficina.id} className="animate-slideUp list-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="border-white/70 bg-white/80 shadow-md card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{oficina.nome}</CardTitle>
                      <CardDescription>{oficina.descricao}</CardDescription>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                      {oficina.ano}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Voluntários Inscritos
                      </p>
                      <p className="text-2xl font-bold text-slate-900">{oficina.voluntarios?.length || 0}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Atividades
                      </p>
                      <p className="text-2xl font-bold text-slate-900">{oficina.atividades?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
