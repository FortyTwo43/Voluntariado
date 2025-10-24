import { SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabase';
import type { Proyecto, ProyectoNuevo } from '../types/proyecto';

/**
 * Servicio para gestionar proyectos de voluntariado
 */
export class ProyectosService {
  private static readonly BASE_URL = `${SUPABASE_URL}/rest/v1/proyectos`;

  /**
   * Crea un nuevo proyecto en la base de datos
   * @param data - Datos del proyecto nuevo
   * @returns Promesa con el proyecto creado
   * @throws Error si la creación falla
   */
  static async crearProyecto(data: ProyectoNuevo): Promise<Proyecto> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el proyecto');
      }

      const [proyecto] = await response.json() as Proyecto[];
      
      if (!proyecto) {
        throw new Error('No se pudo crear el proyecto');
      }
      
      return proyecto;
    } catch (error) {
      console.error('Error en crearProyecto:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudo crear el proyecto. Intenta nuevamente.'
      );
    }
  }

  /**
   * Obtiene todos los proyectos de la base de datos
   * @returns Promesa con array de proyectos
   * @throws Error si la consulta falla
   */
  static async obtenerProyectos(): Promise<Proyecto[]> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener proyectos');
      }

      const proyectos = await response.json() as Proyecto[];
      return proyectos;
    } catch (error) {
      console.error('Error en obtenerProyectos:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudieron cargar los proyectos. Intenta nuevamente.'
      );
    }
  }

  /**
   * Obtiene un proyecto específico por ID
   * @param id - ID del proyecto
   * @returns Promesa con el proyecto encontrado
   * @throws Error si la consulta falla
   */
  static async obtenerProyectoPorId(id: string): Promise<Proyecto> {
    try {
      const response = await fetch(`${this.BASE_URL}?id=eq.${id}`, {
        method: 'GET',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el proyecto');
      }

      const [proyecto] = await response.json() as Proyecto[];
      
      if (!proyecto) {
        throw new Error('Proyecto no encontrado');
      }

      return proyecto;
    } catch (error) {
      console.error('Error en obtenerProyectoPorId:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudo cargar el proyecto. Intenta nuevamente.'
      );
    }
  }

  /**
   * Actualiza un proyecto existente
   * @param id - ID del proyecto a actualizar
   * @param data - Datos parciales del proyecto para actualizar
   * @returns Promesa con el proyecto actualizado
   * @throws Error si la actualización falla
   */
  static async actualizarProyecto(id: string, data: Partial<ProyectoNuevo>): Promise<Proyecto> {
    try {
      const response = await fetch(`${this.BASE_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el proyecto');
      }

      const [proyecto] = await response.json() as Proyecto[];
      
      if (!proyecto) {
        throw new Error('No se pudo actualizar el proyecto');
      }
      
      return proyecto;
    } catch (error) {
      console.error('Error en actualizarProyecto:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudo actualizar el proyecto. Intenta nuevamente.'
      );
    }
  }

  /**
   * Elimina un proyecto por ID
   * @param id - ID del proyecto a eliminar
   * @throws Error si la eliminación falla
   */
  static async eliminarProyecto(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: SUPABASE_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error en eliminarProyecto:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudo eliminar el proyecto. Intenta nuevamente.'
      );
    }
  }
}

export default ProyectosService;
