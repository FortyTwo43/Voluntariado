import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';

export interface VoluntarioMin {
  id: string;
  nombre: string;
  apellido?: string;
}

export class VoluntariosService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/voluntarios`;

  static async obtenerVoluntariosPorIds(ids: string[]): Promise<VoluntarioMin[]> {
    if (ids.length === 0) return [];
    const select = 'id:id_voluntario,nombre,apellido';
    const inList = ids.map((id) => `"${id}"`).join(',');
    const url = `${this.BASE_URL}?id_voluntario=in.(${inList})&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener voluntarios');
    }
    return res.json();
  }
}

export default VoluntariosService;
