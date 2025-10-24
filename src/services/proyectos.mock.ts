import type { Proyecto } from '../types/proyecto';

/**
 * Datos de ejemplo para pruebas y desarrollo
 * Útil cuando no tienes conexión a Supabase o quieres ver la UI rápidamente
 */

export const proyectosEjemplo: Proyecto[] = [
  {
    id: '1',
    nombre: 'Huerto Comunitario Urbano',
    descripcion: 'Crear un huerto comunitario en el centro de la ciudad donde las familias puedan cultivar sus propias verduras y aprender sobre agricultura sostenible.',
    categoria: 'ambiental',
    fecha_inicio: '2025-11-01',
    fecha_fin: '2025-12-31',
    cupo_maximo: 25,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-15T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Taller de Lectura para Niños',
    descripcion: 'Programa de lectura semanal para niños de 6 a 12 años, promoviendo el amor por los libros y mejorando las habilidades de comprensión lectora.',
    categoria: 'educativo',
    fecha_inicio: '2025-10-25',
    fecha_fin: '2026-03-31',
    cupo_maximo: 15,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-10T14:30:00Z',
  },
  {
    id: '3',
    nombre: 'Apoyo a Adultos Mayores',
    descripcion: 'Acompañamiento y asistencia a adultos mayores en situación de vulnerabilidad, incluyendo visitas domiciliarias y actividades recreativas.',
    categoria: 'social',
    fecha_inicio: '2025-11-15',
    fecha_fin: '2026-02-15',
    cupo_maximo: 30,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-12T09:15:00Z',
  },
  {
    id: '4',
    nombre: 'Reforestación Parque Natural',
    descripcion: 'Jornada de reforestación en el Parque Natural Municipal, plantando especies nativas y limpiando senderos.',
    categoria: 'ambiental',
    fecha_inicio: '2025-11-20',
    fecha_fin: '2025-11-20',
    cupo_maximo: 50,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-18T11:00:00Z',
  },
  {
    id: '5',
    nombre: 'Clases de Inglés Gratuitas',
    descripcion: 'Clases de inglés básico para jóvenes y adultos de bajos recursos, dos veces por semana.',
    categoria: 'educativo',
    fecha_inicio: '2025-12-01',
    fecha_fin: '2026-05-31',
    cupo_maximo: 20,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-20T16:45:00Z',
  },
  {
    id: '6',
    nombre: 'Comedor Comunitario',
    descripcion: 'Preparación y distribución de almuerzos para familias en situación de vulnerabilidad socioeconómica.',
    categoria: 'social',
    fecha_inicio: '2025-10-30',
    fecha_fin: '2026-04-30',
    cupo_maximo: 40,
    id_organizacion: 'org-001',
    estado: 'activo',
    created_at: '2025-10-08T08:30:00Z',
  },
];

/**
 * Obtiene un proyecto de ejemplo por ID
 */
export const obtenerProyectoEjemplo = (id: string): Proyecto | undefined => {
  return proyectosEjemplo.find(p => p.id === id);
};

/**
 * Filtra proyectos de ejemplo por categoría
 */
export const filtrarProyectosPorCategoria = (categoria: string): Proyecto[] => {
  return proyectosEjemplo.filter(p => p.categoria === categoria);
};

/**
 * Filtra proyectos activos
 */
export const obtenerProyectosActivos = (): Proyecto[] => {
  return proyectosEjemplo.filter(p => p.estado === 'activo');
};
