<template>
  <section class="projects-view">
    <div class="projects-header">
      <h1 class="page-title">Explorar Proyectos</h1>
      <p class="page-subtitle">Encuentra proyectos de voluntariado que se ajusten a tus intereses</p>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label>
          <span class="material-symbols-outlined">search</span>
          <input 
            type="search" 
            placeholder="Buscar proyectos..." 
            class="filter-input"
            v-model="searchQuery"
            @input="applyFilters"
          />
        </label>
      </div>
      
      <div class="filter-group">
        <select class="filter-select" v-model="selectedCategoria" @change="applyFilters">
          <option value="">Todas las categorías</option>
          <option value="Educación">Educación</option>
          <option value="Medio Ambiente">Medio Ambiente</option>
          <option value="Salud">Salud</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Social">Social</option>
          <option value="Cultura">Cultura</option>
        </select>
      </div>
      
      <div class="filter-group">
        <select class="filter-select" v-model="selectedUbicacion" @change="applyFilters">
          <option value="">Todas las ubicaciones</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Valencia">Valencia</option>
          <option value="Sevilla">Sevilla</option>
          <option value="Remoto">Remoto</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined loading-icon">progress_activity</span>
      <p>Cargando proyectos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined error-icon">error</span>
      <p>{{ error }}</p>
      <button class="btn-primary" @click="loadProjects">Reintentar</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <span class="material-symbols-outlined empty-icon">search_off</span>
      <h3>No se encontraron proyectos</h3>
      <p>Intenta ajustar los filtros de búsqueda</p>
    </div>

    <!-- Projects grid -->
    <div v-else class="projects-grid">
      <article class="project-card" v-for="project in paginatedProjects" :key="project.id_proyecto">
        <div class="project-header">
          <div class="project-image">
            <span class="material-symbols-outlined">volunteer_activism</span>
          </div>
          <span class="project-badge" v-if="isNewProject(project.fecha_inicio)">Nuevo</span>
        </div>
        
        <div class="project-body">
          <h3 class="project-title">{{ project.nombre }}</h3>
          <p class="project-organization" v-if="project.organizacion">
            <span class="material-symbols-outlined">groups</span>
            {{ project.organizacion.nombre }}
          </p>
          
          <p class="project-description">
            {{ truncateText(project.descripcion, 120) }}
          </p>
          
          <div class="project-tags" v-if="project.categoria">
            <span class="tag">{{ project.categoria }}</span>
            <span class="tag" v-if="project.cupos_disponibles">
              {{ project.cupos_disponibles }} cupos
            </span>
          </div>
          
          <div class="project-meta">
            <div class="meta-item" v-if="project.ubicacion">
              <span class="material-symbols-outlined">location_on</span>
              <span>{{ project.ubicacion }}</span>
            </div>
            <div class="meta-item" v-if="project.fecha_inicio">
              <span class="material-symbols-outlined">calendar_today</span>
              <span>{{ formatDate(project.fecha_inicio) }}</span>
            </div>
            <div class="meta-item" v-if="project.horas_estimadas">
              <span class="material-symbols-outlined">schedule</span>
              <span>{{ project.horas_estimadas }}h</span>
            </div>
          </div>
        </div>
        
        <div class="project-footer">
          <button class="btn-outline" @click="viewProject(project.id_proyecto)">Ver más</button>
          <button class="btn-primary" @click="applyToProject(project.id_proyecto)">Postularme</button>
        </div>
      </article>
    </div>

    <div v-if="!loading && filteredProjects.length > 0" class="pagination">
      <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
      <div class="pagination-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page" 
          class="pagination-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">Siguiente</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects'

const { projects, loading, error, fetchProjects } = useProjects()

// Filtros
const searchQuery = ref('')
const selectedCategoria = ref('')
const selectedUbicacion = ref('')

// Paginación
const currentPage = ref(1)
const itemsPerPage = 9

// Cargar proyectos al montar
onMounted(async () => {
  await loadProjects()
})

const loadProjects = async () => {
  await fetchProjects({
    estado: 'activo',
    limit: 100 // Cargar más para filtrar localmente
  })
}

// Filtrar proyectos
const filteredProjects = computed(() => {
  let filtered = projects.value

  // Filtro de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query)
    )
  }

  // Filtro de categoría
  if (selectedCategoria.value) {
    filtered = filtered.filter(p => p.categoria === selectedCategoria.value)
  }

  // Filtro de ubicación
  if (selectedUbicacion.value) {
    filtered = filtered.filter(p => p.ubicacion === selectedUbicacion.value)
  }

  return filtered
})

// Proyectos paginados
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredProjects.value.length / itemsPerPage)
)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const applyFilters = () => {
  currentPage.value = 1 // Reset a primera página al filtrar
}

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Utilidades
const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

const isNewProject = (fechaInicio: string | undefined) => {
  if (!fechaInicio) return false
  const fecha = new Date(fechaInicio)
  const ahora = new Date()
  const diff = ahora.getTime() - fecha.getTime()
  const days = diff / (1000 * 3600 * 24)
  return days <= 30 // Nuevo si tiene menos de 30 días
}

const viewProject = (id: number) => {
  // TODO: Navegar a detalle del proyecto
  console.log('Ver proyecto:', id)
}

const applyToProject = (id: number) => {
  // TODO: Aplicar al proyecto
  console.log('Aplicar a proyecto:', id)
}
</script>

<style scoped>
.projects-view {
  max-width: 80rem;
  margin: 0 auto;
}

.projects-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
}

/* Loading, Error & Empty States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-icon {
  font-size: 4rem;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
}

.error-state p {
  color: #991b1b;
  font-weight: 500;
  font-size: 1.125rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-text-secondary);
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.filter-group label .material-symbols-outlined {
  position: absolute;
  left: 0.75rem;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.filter-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.project-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-header {
  position: relative;
}

.project-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.project-image .material-symbols-outlined {
  font-size: 5rem;
  color: white;
  opacity: 0.9;
}

.project-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-secondary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.project-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.project-organization {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.project-organization .material-symbols-outlined {
  font-size: 1rem;
}

.project-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-background);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item .material-symbols-outlined {
  font-size: 1rem;
}

.project-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.btn-outline {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background-color: transparent;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-outline:hover {
  background-color: rgba(79, 70, 229, 0.05);
}

.btn-primary {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--color-background);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  min-width: 2.5rem;
}

.pagination-number:hover {
  background-color: var(--color-background);
}

.pagination-number.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>
