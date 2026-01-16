export type EstadoInscripcion = 'activa' | 'espera' | 'completado' | 'cancelado';

export interface IInscripcion {
  id_inscripcion: string; // UUID
  id_voluntario: string;  // UUID
  id_proyecto: string;    // UUID
  fecha_inscripcion: string; // ISO date string (YYYY-MM-DD)
  estado: EstadoInscripcion;
}
