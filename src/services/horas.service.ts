import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';
import type { IHora } from '../types/IHora';

export class HorasService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/horas`;

  static async obtenerHorasPorHorarios(idsHorarios: string[]): Promise<IHora[]> {
    if (idsHorarios.length === 0) return [];
    const select = 'id_hora,id_horario,hora_inicio,hora_fin,dia';
    const inList = idsHorarios.map((id) => `"${id}"`).join(',');
    const url = `${this.BASE_URL}?id_horario=in.(${inList})&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener horas');
    }
    return res.json();
  }

  /**
   * Obtiene todas las horas de un horario específico
   * @param idHorario - UUID del horario
   * @returns Promesa con array de horas ordenadas por día
   */
  static async obtenerHorasPorHorario(idHorario: string): Promise<IHora[]> {
    try {
      const horas = await this.obtenerHorasPorHorarios([idHorario]);
      
      // Ordenar por día de la semana
      const ordenDias: Record<string, number> = {
        'lunes': 1,
        'martes': 2,
        'miercoles': 3,
        'miércoles': 3,
        'jueves': 4,
        'viernes': 5,
        'sabado': 6,
        'sábado': 6,
        'domingo': 7,
      };

      return horas.sort((a, b) => {
        const ordenA = ordenDias[a.dia.toLowerCase()] || 999;
        const ordenB = ordenDias[b.dia.toLowerCase()] || 999;
        if (ordenA !== ordenB) return ordenA - ordenB;
        // Si es el mismo día, ordenar por hora de inicio
        return a.hora_inicio.localeCompare(b.hora_inicio);
      });
    } catch (error) {
      console.error('Error en obtenerHorasPorHorario:', error);
      throw error;
    }
  }

    /**
     * Obtiene horas por sus IDs (id_hora) - útil para consultas por asistencias
     */
    static async obtenerHorasPorIds(idsHoras: string[]): Promise<IHora[]> {
      if (idsHoras.length === 0) return [];
      const select = 'id_hora,id_horario,hora_inicio,hora_fin,dia';
      const inList = idsHoras.map((id) => `"${id}"`).join(',');
      const url = `${this.BASE_URL}?id_hora=in.(${inList})&select=${encodeURIComponent(select)}`;

      const res = await fetch(url, { headers: SUPABASE_HEADERS });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al obtener horas por IDs');
      }
      return res.json();
    }

  /**
   * Agrupa las horas por día de la semana
   * @param horas - Array de horas
   * @returns Objeto con horas agrupadas por día
   */
  static agruparHorasPorDia(horas: IHora[]): Record<string, IHora[]> {
    const agrupado: Record<string, IHora[]> = {
      'lunes': [],
      'martes': [],
      'miércoles': [],
      'jueves': [],
      'viernes': [],
      'sábado': [],
      'domingo': [],
    };

    horas.forEach(hora => {
      const diaKey = hora.dia.toLowerCase();
      const diaMatch = Object.keys(agrupado).find(
        key => key.toLowerCase() === diaKey || key === diaKey
      );
      
      if (diaMatch && agrupado[diaMatch]) {
        agrupado[diaMatch].push(hora);
      }
    });

    return agrupado;
  }
}

export default HorasService;
