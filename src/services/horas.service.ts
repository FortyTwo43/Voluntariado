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
}

export default HorasService;
