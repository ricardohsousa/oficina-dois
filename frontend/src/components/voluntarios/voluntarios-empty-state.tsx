type VoluntariosEmptyStateProps = {
  hasFilters: boolean;
};

export function VoluntariosEmptyState({ hasFilters }: VoluntariosEmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
      <h3 className="text-lg font-semibold">Nenhum voluntário encontrado</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {hasFilters
          ? 'Nenhum voluntário corresponde aos filtros informados.'
          : 'Ainda não há voluntários cadastrados para exibição.'}
      </p>
    </div>
  );
}
