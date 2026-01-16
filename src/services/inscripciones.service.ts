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

  /**
   * Verifica si un voluntario está inscrito en un proyecto específico
   */
  static async verificarInscripcionVoluntario(
    idProyecto: string, 
    idVoluntario: string
  ): Promise<IInscripcion | null> {
    const select = 'id_inscripcion,id_voluntario,id_proyecto,fecha_inscripcion,estado';
    const url = `${this.BASE_URL}?id_proyecto=eq.${idProyecto}&id_voluntario=eq.${idVoluntario}&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al verificar inscripción');
    }
    
    const inscripciones = await res.json();
    return inscripciones.length > 0 ? inscripciones[0] : null;
  }

  /**
   * Obtiene todas las inscripciones de un voluntario con los datos del proyecto
   */
  static async obtenerInscripcionesPorVoluntario(idVoluntario: string): Promise<IInscripcion[]> {
    const select = 'id_inscripcion,id_voluntario,id_proyecto,fecha_inscripcion,estado';
    const url = `${this.BASE_URL}?id_voluntario=eq.${idVoluntario}&select=${encodeURIComponent(select)}&order=fecha_inscripcion.desc`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener inscripciones del voluntario');
    }
    return res.json();
  }

  /**
   * Crea una nueva inscripción de voluntario a un proyecto
   */
  static async crearInscripcion(
    inscripcion: Omit<IInscripcion, 'id_inscripcion'>
  ): Promise<IInscripcion> {
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        ...SUPABASE_HEADERS,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(inscripcion)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear inscripción');
    }

    const [inscripcionCreada] = await res.json();
    return inscripcionCreada;
  }
}

export default InscripcionesService;
