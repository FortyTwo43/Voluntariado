export interface IRegistroHoras {
  id_registro: string;     // UUID
  id_inscripcion: string;  // UUID
  fecha: string;           // ISO date string (YYYY-MM-DD)
  horas_dedicadas: number; // >= 0
  comentario?: string;     // optional
}
