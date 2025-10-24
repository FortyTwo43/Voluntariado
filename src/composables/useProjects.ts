import { ref, onMounted } from 'vue'
import { SUPABASE_URL, SUPABASE_HEADERS } from '@/config/supabase'

export interface Proyecto {
  id_proyecto: number
  nombre: string
  descripcion: string
  categoria?: string
  ubicacion?: string
  fecha_inicio?: string
  fecha_fin?: string
  horas_estimadas?: number
  cupos_disponibles?: number
  estado?: string
  id_organizacion?: number
  // Datos relacionados de la organización
  organizacion?: {
    nombre: string
    logo_url?: string
  }
}

export function useProjects() {
  const projects = ref<Proyecto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async (filters?: {
    categoria?: string
    ubicacion?: string
    estado?: string
    limit?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      // Construir query params
      let query = `${SUPABASE_URL}/rest/v1/id_proyecto?select=*,id_organizacion(nombre,logo_url)`
      
      // Aplicar filtros
      if (filters?.categoria) {
        query += `&categoria=eq.${filters.categoria}`
      }
      if (filters?.ubicacion) {
        query += `&ubicacion=eq.${filters.ubicacion}`
      }
      if (filters?.estado) {
        query += `&estado=eq.${filters.estado}`
      } else {
        // Por defecto solo proyectos activos
        query += `&estado=eq.activo`
      }
      
      // Ordenar por fecha de creación descendente
      query += `&order=fecha_inicio.desc`
      
      // Limitar resultados
      if (filters?.limit) {
        query += `&limit=${filters.limit}`
      }

      const response = await fetch(query, {
        method: 'GET',
        headers: SUPABASE_HEADERS
      })

      if (!response.ok) {
        throw new Error(`Error al cargar proyectos: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Transformar datos si hay organizacion anidada
      projects.value = data.map((proyecto: any) => ({
        ...proyecto,
        organizacion: proyecto.id_organizacion || null
      }))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  const getProjectById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/id_proyecto?id_proyecto=eq.${id}&select=*,id_organizacion(nombre,logo_url,descripcion)`,
        {
          method: 'GET',
          headers: SUPABASE_HEADERS
        }
      )

      if (!response.ok) {
        throw new Error(`Error al cargar proyecto: ${response.statusText}`)
      }

      const data = await response.json()
      return data[0] || null
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching project:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on mount (opcional)
  onMounted(() => {
    // No auto-fetch por defecto, llamar manualmente
  })

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProjectById
  }
}
