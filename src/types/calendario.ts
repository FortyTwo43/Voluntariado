import type { IHora } from './IHora';

export interface ActividadCalendario {
  idProyecto: string;
  nombreProyecto: string;
  dia: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado
  horaInicio: string; // formato "HH:mm:ss"
  horaFin: string; // formato "HH:mm:ss"
  hora: IHora;
}

export interface CeldaCalendario {
  hora: number; // 0-23
  dia: number; // 0-6
  actividad: ActividadCalendario | null;
}
