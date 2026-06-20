import { useEffect, useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { listarVoluntarios } from '@/services/voluntarios/listar-voluntarios';
import type { VoluntarioResponseDto } from '@/services/voluntarios/types';
import { ApiError } from '@/lib/http';
import { Avatar } from '@/components/common/avatar';

interface AdicionarVoluntarioModalProps {
  oficinaId: string;
  oficinaNome: string;
  voluntariosAtuais: { id: string }[];
  onAdd: (voluntarioId: string) => Promise<void>;
  onClose: () => void;
}

export function AdicionarVoluntarioModal({
  oficinaId,
  oficinaNome,
  voluntariosAtuais,
  onAdd,
  onClose
}: AdicionarVoluntarioModalProps) {
  const [voluntarios, setVoluntarios] = useState<VoluntarioResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await listarVoluntarios();
        // Filtrar apenas ativos e que não estão na oficina
        const idsAtuais = new Set(voluntariosAtuais.map((v) => v.id));
        const disponiveis = data.filter((v) => v.ativo && !idsAtuais.has(v.id));
        setVoluntarios(disponiveis);
        setError(null);
      } catch (caughtError) {
        setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [voluntariosAtuais]);

  const filtered = voluntarios.filter((v) =>
    v.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selectedId) return;

    setIsAdding(true);
    setError(null);

    try {
      await onAdd(selectedId);
      onClose();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Adicionar Voluntário</h2>
            <p className="text-sm text-slate-600">à oficina: {oficinaNome}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
            </Alert>
          ) : null}

          {/* Search */}
          <Input
            placeholder="Buscar voluntário por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Lista */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-slate-50 p-8 text-center">
              <UserPlus className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Nenhum voluntário disponível</p>
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {filtered.map((voluntario) => (
                <button
                  key={voluntario.id}
                  onClick={() => setSelectedId(voluntario.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selectedId === voluntario.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={voluntario.nomeCompleto} role="voluntario" size="sm" />
                    <div>
                      <p className="font-medium text-slate-900">{voluntario.nomeCompleto}</p>
                      <p className="text-xs text-slate-600">{voluntario.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isAdding}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedId || isAdding}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isAdding ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
