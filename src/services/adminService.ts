import { SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabase';
import type { IOrganizacion } from '../types/IOrganizacion';
import type { Proyecto } from '../types/proyecto';
import type { IInscripcion } from '../types/IInscripcion';

/**
 * Servicio para gestionar operaciones del administrador
 */
export class AdminService {
  private static readonly BASE_URL_ORG = `${SUPABASE_URL}/rest/v1/organizaciones`;
  private static readonly BASE_URL_PROY = `${SUPABASE_URL}/rest/v1/proyectos`;
  private static readonly BASE_URL_INSC = `${SUPABASE_URL}/rest/v1/inscripciones`;
  private static readonly BASE_URL_VOL = `${SUPABASE_URL}/rest/v1/voluntarios`;

  /**
   * Obtiene todas las organizaciones
   */
  static async obtenerOrganizaciones(): Promise<IOrganizacion[]> {
    try {
      const select = 'id_organizacion,nombre,tipo,direccion,email,estado_validacion';
      const response = await fetch(`${this.BASE_URL_ORG}?select=${encodeURIComponent(select)}`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener organizaciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en obtenerOrganizaciones:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las organizaciones. Intenta nuevamente.'
      );
    }
  }

  /**
   * Actualiza el estado de validación de una organización
   */
  static async actualizarEstadoValidacion(
    idOrganizacion: string,
    estadoValidacion: boolean | string
  ): Promise<void> {
    try {
      // Convertir boolean a string según la estructura de la BD, o usar el string directamente
      const estadoString = typeof estadoValidacion === 'boolean' 
        ? (estadoValidacion ? 'aceptada' : 'pendiente')
        : estadoValidacion;
      const response = await fetch(
        `${this.BASE_URL_ORG}?id_organizacion=eq.${idOrganizacion}`,
        {
          method: 'PATCH',
          headers: {
            ...SUPABASE_HEADERS,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ estado_validacion: estadoString }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado de validación');
      }
    } catch (error) {
      console.error('Error en actualizarEstadoValidacion:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el estado de validación. Intenta nuevamente.'
      );
    }
  }

  /**
   * Obtiene todos los proyectos con información de organización
   */
  static async obtenerTodosLosProyectos(): Promise<Proyecto[]> {
    try {
      const select = 'id:id_proyecto,nombre,descripcion,categoria,fecha_inicio,fecha_fin,cupo_maximo,id_organizacion';
      const response = await fetch(`${this.BASE_URL_PROY}?select=${encodeURIComponent(select)}`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener proyectos');
      }

      const proyectos = await response.json();
      // Agregar estado por defecto 'activo' ya que la tabla no tiene esta columna
      return proyectos.map((p: any) => ({
        ...p,
        estado: 'activo' as const
      }));
    } catch (error) {
      console.error('Error en obtenerTodosLosProyectos:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los proyectos. Intenta nuevamente.'
      );
    }
  }

  /**
   * Actualiza el estado de un proyecto
   * NOTA: La tabla proyectos no tiene columna estado, esta función se mantiene por compatibilidad
   * pero no realizará cambios en la base de datos
   */
  static async actualizarEstadoProyecto(
    idProyecto: string,
    estado: 'activo' | 'inactivo' | 'completado'
  ): Promise<void> {
    // La tabla proyectos no tiene columna estado, solo registramos el intento
    console.warn('La tabla proyectos no tiene columna estado. No se puede actualizar el estado.');
    // No lanzamos error para no romper la funcionalidad, solo registramos
    return Promise.resolve();
  }

  /**
   * Obtiene las inscripciones de un proyecto
   */
  static async obtenerInscripcionesPorProyecto(idProyecto: string): Promise<IInscripcion[]> {
    try {
      const select = 'id_inscripcion,id_voluntario,id_proyecto,fecha_inscripcion,estado';
      const response = await fetch(
        `${this.BASE_URL_INSC}?id_proyecto=eq.${idProyecto}&select=${encodeURIComponent(select)}`,
        {
          method: 'GET',
          headers: SUPABASE_HEADERS,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener inscripciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en obtenerInscripcionesPorProyecto:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las inscripciones. Intenta nuevamente.'
      );
    }
  }

  /**
   * Elimina una inscripción (voluntario de un proyecto)
   */
  static async eliminarInscripcion(idInscripcion: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL_INSC}?id_inscripcion=eq.${idInscripcion}`, {
        method: 'DELETE',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la inscripción');
      }
    } catch (error) {
      console.error('Error en eliminarInscripcion:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la inscripción. Intenta nuevamente.'
      );
    }
  }

  /**
   * Obtiene estadísticas generales del sistema
   */
  static async obtenerEstadisticas(): Promise<{
    totalVoluntarios: number;
    totalOrganizaciones: number;
    totalProyectos: number;
    proyectosActivos: number;
    proyectosCompletados: number;
    totalInscripciones: number;
  }> {
    try {
      // Obtener total de voluntarios
      const resVoluntarios = await fetch(`${this.BASE_URL_VOL}?select=id_voluntario`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });
      const voluntarios = resVoluntarios.ok ? await resVoluntarios.json() : [];

      // Obtener total de organizaciones
      const resOrganizaciones = await fetch(`${this.BASE_URL_ORG}?select=id_organizacion`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });
      const organizaciones = resOrganizaciones.ok ? await resOrganizaciones.json() : [];

      // Obtener proyectos (sin estado ya que la tabla no lo tiene)
      const resProyectos = await fetch(
        `${this.BASE_URL_PROY}?select=id_proyecto`,
        {
          method: 'GET',
          headers: SUPABASE_HEADERS,
        }
      );
      const proyectos = resProyectos.ok ? await resProyectos.json() : [];

      // Obtener inscripciones
      const resInscripciones = await fetch(`${this.BASE_URL_INSC}?select=id_inscripcion`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });
      const inscripciones = resInscripciones.ok ? await resInscripciones.json() : [];

      // Como la tabla no tiene estado, todos los proyectos se consideran activos
      const proyectosActivos = proyectos.length;
      const proyectosCompletados = 0;

      return {
        totalVoluntarios: voluntarios.length,
        totalOrganizaciones: organizaciones.length,
        totalProyectos: proyectos.length,
        proyectosActivos,
        proyectosCompletados,
        totalInscripciones: inscripciones.length,
      };
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las estadísticas. Intenta nuevamente.'
      );
    }
  }
}

export default AdminService;

