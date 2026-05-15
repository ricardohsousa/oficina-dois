import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { VoluntariosFiltersForm } from '@/services/voluntarios/types';

type VoluntariosFiltersProps = {
  values: VoluntariosFiltersForm;
  disabled?: boolean;
  onChange: (values: VoluntariosFiltersForm) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export function VoluntariosFilters({
  values,
  disabled = false,
  onChange,
  onSubmit,
  onClear
}: VoluntariosFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
      <div className="space-y-2">
        <label htmlFor="nome" className="text-sm font-medium text-foreground">
          Nome
        </label>
        <Input
          id="nome"
          placeholder="Busque por nome completo"
          value={values.nome}
          disabled={disabled}
          onChange={(event) => onChange({ ...values, nome: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSubmit();
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-foreground">
          Status
        </label>
        <Select
          value={values.status}
          disabled={disabled}
          onValueChange={(status) =>
            onChange({
              ...values,
              status: status as VoluntariosFiltersForm['status']
            })
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativos">Ativos</SelectItem>
            <SelectItem value="inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
        <Button type="button" onClick={onSubmit} disabled={disabled}>
          Buscar
        </Button>
        <Button type="button" variant="outline" onClick={onClear} disabled={disabled}>
          Limpar
        </Button>
      </div>
    </div>
  );
}
