import { useEffect, useState } from 'react';
import { AlertCircle, Users, Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import type { OficinaResponseDto } from '@/services/oficinas/types';
import { ApiError } from '@/lib/http';
import { Avatar } from '@/components/common/avatar';
import { useAuth } from '@/contexts/auth-context';

interface VoluntarioItem {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  oficinasParticipante: string[];
}

export function VoluntariosProFessorPage() {
  const { user } = useAuth();
  const [voluntarios, setVoluntarios] = useState<VoluntarioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const oficinas = await listarOficinas();

        const volMap = new Map<string, VoluntarioItem>();

        oficinas.forEach((oficina) => {
          oficina.voluntarios?.forEach((vol) => {
            if (!volMap.has(vol.id)) {
              volMap.set(vol.id, {
                id: vol.id,
                nomeCompleto: vol.nomeCompleto,
                email: vol.email,
                telefone: vol.telefone,
                oficinasParticipante: [oficina.nome]
              });
            } else {
              const existing = volMap.get(vol.id)!;
              existing.oficinasParticipante.push(oficina.nome);
            }
          });
        });

        setVoluntarios(Array.from(volMap.values()));
        setError(null);
      } catch (caughtError) {
        setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = voluntarios.filter((item) =>
    item.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="space-y-6 px-1 py-6 lg:px-2 lg:py-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-purple-700">
            Gestão
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">Voluntários</h1>
          <p className="text-sm leading-7 text-slate-600">
            Visualize e gerencie os voluntários das suas oficinas.
          </p>
        </div>
      </section>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Visualização Filtrada</AlertTitle>
        <AlertDescription className="text-blue-800">
          Você está vendo apenas os voluntários das suas oficinas. Para gerenciar todas as categorias,
          contacte o coordenador.
        </AlertDescription>
      </Alert>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Resumo */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription className="text-xs font-medium">Total de Voluntários</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : filtered.length}
              </CardTitle>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/70 bg-gradient-to-br from-white/90 to-white/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardDescription className="text-xs font-medium">Tuas Oficinas</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : '--'}
              </CardTitle>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-50">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Filtro */}
      <section>
        <div className="rounded-lg border border-white/70 bg-white/80 p-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </section>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-purple-200 bg-purple-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-purple-300 mb-4" />
            <p className="text-sm font-medium text-purple-900">Nenhum voluntário encontrado</p>
            <p className="text-xs text-purple-700 mt-1">
              Os voluntários das suas oficinas aparecerão aqui
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((voluntario) => (
            <Card
              key={voluntario.id}
              className="border-white/70 bg-white/80 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar name={voluntario.nomeCompleto} role="voluntario" size="md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-950 mb-2">{voluntario.nomeCompleto}</h3>
                    <p className="text-sm text-slate-600 mb-3">{voluntario.email}</p>
                    <div className="grid gap-2 md:grid-cols-2 text-xs text-slate-600 mb-3">
                      <div>
                        <span className="font-medium text-slate-700">Telefone:</span> {voluntario.telefone}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">Participa das Oficinas:</p>
                      <div className="flex flex-wrap gap-2">
                        {voluntario.oficinasParticipante.map((oficina) => (
                          <span
                            key={oficina}
                            className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
                          >
                            {oficina}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
