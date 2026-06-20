import { useEffect, useState } from 'react';
import { AlertCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import type { OficinaResponseDto } from '@/services/oficinas/types';
import { ApiError } from '@/lib/http';
import { Avatar } from '@/components/common/avatar';
import { CronogramaAtividades } from '@/components/oficinas/cronograma-atividades';

export function OficinasVisualizacaoPage() {
  const [items, setItems] = useState<OficinaResponseDto[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await listarOficinas();
      setItems(data);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const counters = {
    total: items.length,
    ativas: items.filter((item) => item.status === 'ativa').length,
    inativas: items.filter((item) => item.status !== 'ativa').length
  };

  return (
    <main className="space-y-6 px-1 py-6 lg:px-2 lg:py-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
            Visualização
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">Oficinas do projeto</h1>
          <p className="text-sm leading-7 text-slate-600">
            Conheça as oficinas do ELLP, professores e atividades planejadas (apenas visualização).
          </p>
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Resumo */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total de Oficinas', value: counters.total },
          { label: 'Ativas', value: counters.ativas },
          { label: 'Finalizadas', value: counters.inativas }
        ].map((metric) => (
          <Card key={metric.label} className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-xs font-medium">{metric.label}</CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : metric.value}
                </CardTitle>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Cards de Oficinas */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-emerald-300 mb-4" />
            <p className="text-sm font-medium text-emerald-900">Nenhuma oficina encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-white/70 bg-white/80 shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-950">{item.nome}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === 'ativa'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.status === 'ativa' ? 'Ativa' : 'Finalizada'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{item.descricao}</p>
                  <div className="text-xs text-slate-500">Ano: {item.ano}</div>
                </div>
                {expandedId === item.id ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>

              {/* Expandido */}
              {expandedId === item.id && (
                <div className="border-t bg-slate-50/50 p-6 space-y-6">
                  {/* Professores */}
                  {item.professores && item.professores.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-950 mb-3">Professores Responsáveis</h4>
                      <div className="space-y-2">
                        {item.professores.map((prof) => (
                          <div key={prof.id} className="flex items-center gap-3 rounded-lg bg-white p-3 border border-slate-200">
                            <Avatar name={prof.nome} role="professor" size="sm" />
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{prof.nome}</p>
                              <p className="text-xs text-slate-600">{prof.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Voluntários */}
                  {item.voluntarios && item.voluntarios.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-950 mb-3">
                        Voluntários ({item.voluntarios.length})
                      </h4>
                      <div className="space-y-2">
                        {item.voluntarios.map((vol) => (
                          <div key={vol.id} className="flex items-center gap-3 rounded-lg bg-white p-3 border border-slate-200">
                            <Avatar name={vol.nomeCompleto} role="voluntario" size="sm" />
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{vol.nomeCompleto}</p>
                              <p className="text-xs text-slate-600">{vol.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cronograma */}
                  {item.atividades && item.atividades.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-950 mb-3">Cronograma de Atividades</h4>
                      <CronogramaAtividades atividades={item.atividades} ano={item.ano} />
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
