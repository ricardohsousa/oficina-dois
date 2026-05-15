import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AtualizarVoluntarioDto, CriarVoluntarioDto } from '@/services/voluntarios/types';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type VoluntarioFormValues = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
};

export const emptyVoluntarioForm: VoluntarioFormValues = {
  nomeCompleto: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  endereco: '',
  dataEntrada: ''
};

export const toCriarVoluntarioDto = (values: VoluntarioFormValues): CriarVoluntarioDto => ({
  nomeCompleto: values.nomeCompleto,
  cpf: values.cpf,
  dataNascimento: values.dataNascimento,
  email: values.email,
  telefone: values.telefone,
  endereco: values.endereco,
  dataEntrada: values.dataEntrada
});

export const toAtualizarVoluntarioDto = (
  values: VoluntarioFormValues
): AtualizarVoluntarioDto => ({
  nomeCompleto: values.nomeCompleto,
  dataNascimento: values.dataNascimento,
  email: values.email,
  telefone: values.telefone,
  endereco: values.endereco,
  dataEntrada: values.dataEntrada
});

// ── Componente ────────────────────────────────────────────────────────────────

type VoluntarioFormProps = {
  values: VoluntarioFormValues;
  isEditing?: boolean;
  disabled?: boolean;
  onChange: (values: VoluntarioFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

type FieldConfig = {
  id: keyof VoluntarioFormValues;
  label: string;
  type: string;
  placeholder: string;
  /** CPF está disponível apenas na criação */
  onlyOnCreate?: boolean;
};

const fields: FieldConfig[] = [
  {
    id: 'nomeCompleto',
    label: 'Nome completo',
    type: 'text',
    placeholder: 'Ex: João da Silva'
  },
  {
    id: 'cpf',
    label: 'CPF',
    type: 'text',
    placeholder: '000.000.000-00',
    onlyOnCreate: true
  },
  {
    id: 'dataNascimento',
    label: 'Data de nascimento',
    type: 'date',
    placeholder: ''
  },
  {
    id: 'email',
    label: 'E-mail',
    type: 'email',
    placeholder: 'exemplo@email.com'
  },
  {
    id: 'telefone',
    label: 'Telefone',
    type: 'text',
    placeholder: '(00) 00000-0000'
  },
  {
    id: 'endereco',
    label: 'Endereço',
    type: 'text',
    placeholder: 'Rua, número, bairro, cidade'
  },
  {
    id: 'dataEntrada',
    label: 'Data de entrada',
    type: 'date',
    placeholder: ''
  }
];

export function VoluntarioForm({
  values,
  isEditing = false,
  disabled = false,
  onChange,
  onSubmit,
  onCancel
}: VoluntarioFormProps) {
  const visibleFields = fields.filter((f) => !(isEditing && f.onlyOnCreate));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleFields.map((field) => (
          <div key={field.id} className={field.id === 'endereco' ? 'sm:col-span-2' : undefined}>
            <div className="space-y-2">
              <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.id]}
                disabled={disabled}
                onChange={(e) => onChange({ ...values, [field.id]: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
          Cancelar
        </Button>
        <Button type="submit" disabled={disabled}>
          {disabled ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar voluntário'}
        </Button>
      </div>
    </form>
  );
}
