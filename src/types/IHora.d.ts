export type DiaSemana = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';

export interface IHora {
  id_hora: string;       // UUID
  id_horario: string;    // UUID
  hora_inicio: string;   // HH:MM:SS
  hora_fin: string;      // HH:MM:SS
  dia: DiaSemana;
}
