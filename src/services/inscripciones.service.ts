import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';
import type { IInscripcion } from '../types/IInscripcion';

export class InscripcionesService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/inscripciones`;

  /**
   * Obtiene inscripciones activas por proyecto
   */
  static async obtenerInscripcionesPorProyecto(idProyecto: string): Promise<IInscripcion[]> {
    const select = 'id_inscripcion,id_voluntario,id_proyecto,fecha_inscripcion,estado';
    const url = `${this.BASE_URL}?id_proyecto=eq.${idProyecto}&estado=eq.activa&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener inscripciones');
    }
    return res.json();
  }
}

export default InscripcionesService;
