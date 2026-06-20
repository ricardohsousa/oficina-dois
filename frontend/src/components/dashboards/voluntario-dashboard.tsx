import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import type { OficinaResponseDto } from '@/services/oficinas/types';
import { ApiError } from '@/lib/http';
import { Avatar } from '@/components/common/avatar';

export function VoluntarioDashboard() {
  const [oficinas, setOficinas] = useState<OficinaResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    listarOficinas()
      .then((data) => {
        setOficinas(data);
        setError(null);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="space-y-8 px-1 py-6 lg:px-2 lg:py-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
            Dashboard Voluntário
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">
            Suas atividades e inscrições
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Acompanhe suas oficinas inscritas, atividades e seu progresso no projeto.
          </p>
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar dados</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="animate-slideUp" style={{ animationDelay: '0s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription className="text-xs font-medium">Oficinas Inscritas</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : oficinas.length}
              </CardTitle>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </CardHeader>
        </Card>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-xs font-medium">Horas Completadas</CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : '0h'}
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-xs font-medium">Próximas Atividades</CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : '0'}
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Minhas Oficinas */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-950">Oficinas em que você participa</h2>
          <p className="text-sm text-slate-600">Consulte suas inscrições (apenas visualização)</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : oficinas.length === 0 ? (
          <Card className="border-dashed border-emerald-200 bg-emerald-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-emerald-300 mb-4" />
              <p className="text-sm font-medium text-emerald-900">Você não está inscrito em nenhuma oficina</p>
              <p className="text-xs text-emerald-700 mt-1">Contate o coordenador para se inscrever</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {oficinas.map((oficina, index) => (
              <div key={oficina.id} className="animate-slideUp list-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="border-white/70 bg-white/80 shadow-md card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{oficina.nome}</CardTitle>
                      <CardDescription>{oficina.descricao}</CardDescription>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                      {oficina.status === 'ativa' ? 'Ativa' : 'Finalizada'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professores */}
                  {oficina.professores && oficina.professores.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Professores
                      </p>
                      <div className="space-y-2">
                        {oficina.professores.map((prof) => (
                          <div key={prof.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                            <Avatar name={prof.nome} role="professor" size="sm" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{prof.nome}</p>
                              <p className="text-xs text-slate-600">{prof.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Próximas Atividades */}
                  {oficina.atividades && oficina.atividades.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Atividades Planejadas
                      </p>
                      <div className="space-y-2">
                        {oficina.atividades.slice(0, 3).map((atividade) => (
                          <div key={atividade.id} className="rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 p-3">
                            <p className="text-sm font-medium text-slate-900">{atividade.nome}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Status: {atividade.status || 'planejada'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
