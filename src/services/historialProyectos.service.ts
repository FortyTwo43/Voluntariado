import type { Proyecto } from '../types/proyecto';

/**
 * Interfaz para un cambio individual en un campo del proyecto
 */
export interface CambioProyecto {
  campo: string;
  valorAnterior: any;
  valorNuevo: any;
}

/**
 * Interfaz para un registro completo en el historial
 */
export interface RegistroHistorial {
  id: string; // ID único del registro
  idProyecto: string;
  nombreProyecto: string;
  timestamp: number;
  fecha: string; // Fecha formateada
  usuario: string; // Nombre de la organización que hizo el cambio
  cambios: CambioProyecto[];
}

/**
 * Servicio para gestionar el historial de cambios de proyectos usando LocalStorage
 */
export class HistorialProyectosService {
  private static readonly STORAGE_KEY = 'historial_proyectos';

  /**
   * Traduce el nombre técnico del campo a un nombre legible
   */
  private static traducirCampo(campo: string): string {
    const traducciones: Record<string, string> = {
      nombre: 'Nombre del proyecto',
      descripcion: 'Descripción',
      categoria: 'Categoría',
      fecha_inicio: 'Fecha de inicio',
      fecha_fin: 'Fecha de fin',
      cupo_maximo: 'Cupo máximo',
      estado: 'Estado',
    };
    return traducciones[campo] || campo;
  }

  /**
   * Obtiene el nombre de la organización logueada
   */
  private static obtenerNombreUsuario(): string {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return 'Usuario desconocido';
      const user = JSON.parse(raw);
      return user.nombre || user.email || 'Organización';
    } catch {
      return 'Usuario desconocido';
    }
  }

  /**
   * Lee el historial completo desde LocalStorage
   */
  private static leerHistorial(): RegistroHistorial[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as RegistroHistorial[];
    } catch (error) {
      console.error('Error al leer historial:', error);
      return [];
    }
  }

  /**
   * Guarda el historial completo en LocalStorage
   */
  private static guardarHistorial(historial: RegistroHistorial[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
    } catch (error) {
      console.error('Error al guardar historial:', error);
    }
  }

  /**
   * Registra un cambio en el historial
   */
  static registrarCambio(
    proyectoAnterior: Proyecto,
    proyectoNuevo: Proyecto
  ): void {
    const cambios: CambioProyecto[] = [];

    // Comparar cada campo
    const campos: (keyof Proyecto)[] = [
      'nombre',
      'descripcion',
      'categoria',
      'fecha_inicio',
      'fecha_fin',
      'cupo_maximo',
      'estado',
    ];

    campos.forEach((campo) => {
      const valorAnterior = proyectoAnterior[campo];
      const valorNuevo = proyectoNuevo[campo];

      // Solo registrar si hubo cambio
      if (valorAnterior !== valorNuevo) {
        cambios.push({
          campo: this.traducirCampo(campo),
          valorAnterior: valorAnterior ?? 'Sin definir',
          valorNuevo: valorNuevo ?? 'Sin definir',
        });
      }
    });

    // Solo guardar si hubo cambios
    if (cambios.length === 0) return;

    const registro: RegistroHistorial = {
      id: `${proyectoNuevo.id}_${Date.now()}`,
      idProyecto: proyectoNuevo.id,
      nombreProyecto: proyectoNuevo.nombre,
      timestamp: Date.now(),
      fecha: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      usuario: this.obtenerNombreUsuario(),
      cambios,
    };

    const historial = this.leerHistorial();
    historial.unshift(registro); // Agregar al inicio

    // Limitar a los últimos 100 registros por proyecto para no llenar el storage
    const historialProyecto = historial.filter(r => r.idProyecto === proyectoNuevo.id);
    const otrosProyectos = historial.filter(r => r.idProyecto !== proyectoNuevo.id);
    const historialLimitado = [
      ...historialProyecto.slice(0, 100),
      ...otrosProyectos
    ];

    this.guardarHistorial(historialLimitado);
  }

  /**
   * Obtiene el historial de cambios de un proyecto específico
   */
  static obtenerHistorialProyecto(idProyecto: string): RegistroHistorial[] {
    const historial = this.leerHistorial();
    return historial.filter((r) => r.idProyecto === idProyecto);
  }

  /**
   * Limpia el historial de un proyecto específico
   */
  static limpiarHistorialProyecto(idProyecto: string): void {
    const historial = this.leerHistorial();
    const nuevoHistorial = historial.filter((r) => r.idProyecto !== idProyecto);
    this.guardarHistorial(nuevoHistorial);
  }

  /**
   * Limpia todo el historial
   */
  static limpiarTodoElHistorial(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default HistorialProyectosService;
