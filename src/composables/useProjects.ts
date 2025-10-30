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
  // Construir query params (tabla correcta: proyectos)
  let query = `${SUPABASE_URL}/rest/v1/proyectos?select=*`
      
      // Aplicar filtros
      if (filters?.categoria) {
        query += `&categoria=eq.${filters.categoria}`
      }
      if (filters?.ubicacion) {
        query += `&ubicacion=eq.${filters.ubicacion}`
      }
      if (filters?.estado) {
        query += `&estado=eq.${filters.estado}`
      }
      
  // Orden opcional: omitir para maximizar compatibilidad con esquemas variados
      
      // Limitar resultados
      if (filters?.limit) {
        query += `&limit=${filters.limit}`
      }

      console.log('[useProjects] GET', query)
      const response = await fetch(query, {
        method: 'GET',
        headers: SUPABASE_HEADERS
      })
      console.log('[useProjects] status', response.status)

      if (!response.ok) {
        throw new Error(`Error al cargar proyectos: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Asignar datos tal cual; la vista pública adapta los campos para su card
      projects.value = data
      
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
      const url = `${SUPABASE_URL}/rest/v1/proyectos?id_proyecto=eq.${id}&select=*`
      console.log('[useProjects] GET by id', url)
      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: SUPABASE_HEADERS
        }
      )
      console.log('[useProjects] status (by id)', response.status)

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
