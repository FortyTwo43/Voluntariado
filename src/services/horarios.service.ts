import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';
import type { IHorario } from '../types/IHorario';

export class HorariosService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/horarios`;

  static async obtenerHorariosPorProyecto(idProyecto: string): Promise<IHorario[]> {
    const select = 'id_horario,id_proyecto';
    const url = `${this.BASE_URL}?id_proyecto=eq.${idProyecto}&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener horarios');
    }
    return res.json();
  }

  /**
   * Obtiene el primer horario de un proyecto específico
   * @param idProyecto - UUID del proyecto
   * @returns Promesa con el horario del proyecto o null si no existe
   */
  static async obtenerHorarioPorProyecto(idProyecto: string): Promise<IHorario | null> {
    try {
      const horarios = await this.obtenerHorariosPorProyecto(idProyecto);
      return horarios.length > 0 ? horarios[0]! : null;
    } catch (error) {
      console.error('Error en obtenerHorarioPorProyecto:', error);
      throw error;
    }
  }
}

export default HorariosService;
