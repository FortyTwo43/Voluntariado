import { SUPABASE_HEADERS, SUPABASE_URL } from '../config/supabase';
import type { IRegistroHoras } from '../types/IRegistroHoras';

export class RegistroHorasService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/registrohoras`;

  /**
   * Obtiene todos los registros de horas de una inscripción
   */
  static async obtenerRegistrosPorInscripcion(idInscripcion: string): Promise<IRegistroHoras[]> {
    const select = 'id_registro,id_inscripcion,fecha,horas_dedicadas,comentario';
    const url = `${this.BASE_URL}?id_inscripcion=eq.${idInscripcion}&select=${encodeURIComponent(select)}`;

    const res = await fetch(url, { headers: SUPABASE_HEADERS });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener registros de horas');
    }
    return res.json();
  }

  /**
   * Calcula el total de horas dedicadas de una inscripción
   */
  static async calcularTotalHoras(idInscripcion: string): Promise<number> {
    const registros = await this.obtenerRegistrosPorInscripcion(idInscripcion);
    return registros.reduce((total, registro) => total + registro.horas_dedicadas, 0);
  }

  /**
   * Crea un nuevo registro de horas
   */
  static async crearRegistro(data: Omit<IRegistroHoras, 'id_registro'>): Promise<IRegistroHoras> {
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear registro de horas');
    }

    const data_resp = await res.json();
    return Array.isArray(data_resp) ? data_resp[0] : data_resp;
  }

  /**
   * Actualiza un registro de horas existente
   */
  static async actualizarRegistro(
    idRegistro: string,
    data: Partial<Omit<IRegistroHoras, 'id_registro'>>
  ): Promise<IRegistroHoras> {
    const res = await fetch(`${this.BASE_URL}?id_registro=eq.${idRegistro}`, {
      method: 'PATCH',
      headers: { ...SUPABASE_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar registro de horas');
    }

    const data_resp = await res.json();
    return Array.isArray(data_resp) ? data_resp[0] : data_resp;
  }

  /**
   * Elimina un registro de horas
   */
  static async eliminarRegistro(idRegistro: string): Promise<void> {
    const res = await fetch(`${this.BASE_URL}?id_registro=eq.${idRegistro}`, {
      method: 'DELETE',
      headers: SUPABASE_HEADERS,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al eliminar registro de horas');
    }
  }
}
