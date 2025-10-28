export interface IAsistencia {
  id_asistencia: string;   // UUID
  id_hora: string;         // UUID
  id_voluntario: string;   // UUID
  presencia: boolean;      // default false
  actividad_realizada?: string; // optional text
}
