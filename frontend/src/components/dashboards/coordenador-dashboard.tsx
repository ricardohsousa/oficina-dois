import { useEffect, useState } from 'react';
import { Activity, FileStack, School, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarRegistrosAuditoria } from '@/services/auditoria/listar-registros-auditoria';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import { listarVoluntarios } from '@/services/voluntarios/listar-voluntarios';
import { ApiError } from '@/lib/http';

const metrics = [
  { key: 'voluntariosAtivos', label: 'Voluntários ativos', icon: Users },
  { key: 'voluntariosInativos', label: 'Voluntários inativos', icon: Users },
  { key: 'oficinasAtivas', label: 'Oficinas ativas', icon: School },
  { key: 'auditoriasRecentes', label: 'Ações auditadas', icon: Activity }
] as const;

type DashboardState = Record<(typeof metrics)[number]['key'], number>;

export function CoordenadorDashboard() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    Promise.all([listarVoluntarios(), listarOficinas(), listarRegistrosAuditoria()])
      .then(([voluntarios, oficinas, auditorias]) => {
        setState({
          voluntariosAtivos: voluntarios.filter((item) => item.ativo).length,
          voluntariosInativos: voluntarios.filter((item) => !item.ativo).length,
          oficinasAtivas: oficinas.filter((item) => item.status === 'ativa').length,
          auditoriasRecentes: auditorias.length
        });
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
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
            Dashboard Coordenador
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">
            Visão geral do sistema
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Acompanhe todas as métricas do sistema, voluntários, oficinas e ações executadas.
          </p>
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <FileStack className="h-4 w-4" />
          <AlertTitle>Falha ao carregar painel</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Metrics Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.key}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md card-hover h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardDescription className="text-xs font-medium">{metric.label}</CardDescription>
                    <CardTitle className="text-3xl font-bold">
                      {isLoading || !state ? <Skeleton className="h-8 w-16" /> : state[metric.key]}
                    </CardTitle>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-50">
                    <Icon className="h-6 w-6 text-amber-600" />
                  </div>
                </CardHeader>
              </Card>
            </div>
          );
        })}
      </section>

      {/* System Status */}
      <section className="grid gap-6 md:grid-cols-2 animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <Card className="border-white/70 bg-white/80 shadow-md card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Status do Sistema</CardTitle>
            <CardDescription>Informações gerenciais importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <span className="font-medium text-slate-700">Sistema</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
              <span className="font-medium text-slate-700">Banco de Dados</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Conectado
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>Acesso direto às funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 hover:bg-amber-100 transition">
              + Novo Voluntário
            </button>
            <button className="w-full rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-900 hover:bg-purple-100 transition">
              + Nova Oficina
            </button>
            <button className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100 transition">
              Ver Auditoria
            </button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
