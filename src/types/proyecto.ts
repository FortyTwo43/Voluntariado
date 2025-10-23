export type CategoriaProyecto = 'social' | 'educativo' | 'ambiental';

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProyecto;
  fecha_inicio: string;
  fecha_fin: string;
  cupo_maximo: number;
  id_organizacion: string;
  estado?: 'activo' | 'inactivo' | 'completado';
  created_at?: string;
  updated_at?: string;
}

export interface ProyectoNuevo {
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProyecto;
  fecha_inicio: string;
  fecha_fin: string;
  cupo_maximo: number;
  id_organizacion: string;
}

export interface BorradorProyecto {
  paso: number;
  datos: Partial<ProyectoNuevo>;
  timestamp: number;
}
