import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { VoluntarioResponseDto } from '@/services/voluntarios/types';

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
};

type VoluntariosTableProps = {
  items: VoluntarioResponseDto[];
  onRowClick?: (id: string) => void;
};

export function VoluntariosTable({ items, onRowClick }: VoluntariosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Data de entrada</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((voluntario) => (
          <TableRow
            key={voluntario.id}
            className={onRowClick ? 'cursor-pointer hover:bg-muted/60' : undefined}
            onClick={() => onRowClick?.(voluntario.id)}
          >
            <TableCell className="font-medium">{voluntario.nomeCompleto}</TableCell>
            <TableCell>{voluntario.email}</TableCell>
            <TableCell>{voluntario.telefone}</TableCell>
            <TableCell>{formatDate(voluntario.dataEntrada)}</TableCell>
            <TableCell>
              <Badge variant={voluntario.ativo ? 'success' : 'secondary'}>
                {voluntario.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
