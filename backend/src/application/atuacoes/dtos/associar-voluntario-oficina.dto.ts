export type AssociarVoluntarioOficinaDto = {
  oficinaId: string;
  dataInicio: string;
  dataFim?: string | null;
  cargaHoraria?: number | null;
};
