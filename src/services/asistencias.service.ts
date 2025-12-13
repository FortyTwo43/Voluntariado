import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';
import type { IAsistencia } from '../types/IAsistencia';

export class AsistenciasService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/asistencias`;

  static async obtenerAsistencias(idHora: string, idsVoluntarios: string[]): Promise<IAsistencia[]> {
    if (!idHora || idsVoluntarios.length === 0) return [];
    const select = 'id_asistencia,id_hora,id_voluntario,presencia,actividad_realizada,fecha';
    const inList = idsVoluntarios.map((id) => `"${id}"`).join(',');
    const url = `${this.BASE_URL}?id_hora=eq.${idHora}&id_voluntario=in.(${inList})&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener asistencias');
    }
    return res.json();
  }

  /**
   * Obtiene todas las asistencias de un voluntario en un proyecto específico
   */
  static async obtenerAsistenciasPorVoluntario(
    idVoluntario: string, 
    idProyecto?: string
  ): Promise<IAsistencia[]> {
    const select = 'id_asistencia,id_hora,id_voluntario,id_proyecto,presencia,actividad_realizada,fecha';
    let url = `${this.BASE_URL}?id_voluntario=eq.${idVoluntario}&select=${encodeURIComponent(select)}`;
    
    if (idProyecto) {
      url += `&id_proyecto=eq.${idProyecto}`;
    }

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener asistencias del voluntario');
    }
    return res.json();
  }

  /**
   * Calcula las estadísticas de asistencia de un voluntario en un proyecto
   */
  static async calcularEstadisticasAsistencia(
    idVoluntario: string,
    idProyecto: string
  ): Promise<{ asistencias: number; totalSesiones: number; porcentaje: number }> {
    const asistencias = await this.obtenerAsistenciasPorVoluntario(idVoluntario, idProyecto);
    
    const asistenciasPresentes = asistencias.filter(a => a.presencia === true).length;
    const totalSesiones = asistencias.length;
    const porcentaje = totalSesiones > 0 ? Math.round((asistenciasPresentes / totalSesiones) * 100) : 0;

    return {
      asistencias: asistenciasPresentes,
      totalSesiones,
      porcentaje
    };
  }

  static async crearAsistencia(data: Omit<IAsistencia, 'id_asistencia'>): Promise<IAsistencia> {
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear asistencia');
    }
    const [row] = await res.json();
    return row as IAsistencia;
  }

  static async actualizarAsistencia(idAsistencia: string, data: Partial<IAsistencia>): Promise<IAsistencia> {
    const url = `${this.BASE_URL}?id_asistencia=eq.${idAsistencia}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar asistencia');
    }
    const [row] = await res.json();
    return row as IAsistencia;
  }

  /**
   * Upsert manual: actualiza si existe, crea si no
   */
  static async guardarAsistencias(lote: Array<{ id_hora: string; id_voluntario: string; presencia: boolean; actividad_realizada?: string }>): Promise<void> {
    for (const item of lote) {
      try {
        const existentes = await this.obtenerAsistencias(item.id_hora, [item.id_voluntario]);
        if (existentes.length > 0) {
          const existente = existentes[0];
          if (!existente) continue;
          await this.actualizarAsistencia(existente.id_asistencia, item);
        } else {
          await this.crearAsistencia(item as Omit<IAsistencia, 'id_asistencia'>);
        }
      } catch (e) {
        console.error('Error guardando asistencia individual', e);
        throw e;
      }
    }
  }
}

export default AsistenciasService;
