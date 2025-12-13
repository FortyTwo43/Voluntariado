export interface IAsistencia {
  id_asistencia: string;   // UUID
  id_hora: string;         // UUID
  id_voluntario: string;   // UUID
  id_proyecto: string;     // UUID
  presencia?: boolean;     // Campo legacy (mismo que asistio)
  fecha: Date;
  actividad_realizada?: string; // optional text
}
