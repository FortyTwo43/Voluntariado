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

    <!-- Projects grid (using unified card in non-interactive mode) -->
    <div v-else class="projects-grid">
      <ProyectoCard
        v-for="ap in paginatedAdapted"
        :key="ap.id"
        :proyecto="ap"
        :show-actions="false"
      />
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
import ProyectoCard from '@/components/proyectos/ProyectoCard.vue'
import type { Proyecto as ProyectoCardType, CategoriaProyecto } from '@/types/proyecto'

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

// Adaptador: mapear proyecto del listado a tipo requerido por la card pública
const mapCategoria = (c?: string): CategoriaProyecto => {
  const raw = (c || '').toLowerCase()
  if (raw.includes('medio') || raw.includes('ambient')) return 'ambiental'
  if (raw.includes('educ')) return 'educativo'
  return 'social'
}

const adaptProject = (p: any): ProyectoCardType => ({
  id: String(p.id ?? p.id_proyecto ?? ''),
  nombre: p.nombre ?? '',
  descripcion: p.descripcion ?? '',
  categoria: mapCategoria(p.categoria),
  fecha_inicio: p.fecha_inicio ?? new Date().toISOString(),
  fecha_fin: p.fecha_fin ?? p.fecha_inicio ?? new Date().toISOString(),
  cupo_maximo: Number(p.cupos_disponibles ?? p.cupo_maximo ?? 0),
  id_organizacion: String((p.id_organizacion && (p.id_organizacion.id ?? p.id_organizacion)) ?? ''),
  estado: (p.estado === 'activo' || p.estado === 'inactivo' || p.estado === 'completado') ? p.estado : undefined,
})

// Proyectos paginados adaptados para la card
const paginatedAdapted = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end).map(adaptProject)
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

// (Se eliminaron utilidades no usadas: truncateText, formatDate, isNewProject)

// Nota: esta vista pública es solo informativa; se eliminan acciones
</script>

<style scoped>
.projects-view {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.projects-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: clamp(0.875rem, 3vw, 1rem);
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
  padding: 3rem 1.5rem;
  text-align: center;
}

.loading-icon {
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: #ef4444;
}

.error-state p {
  color: #991b1b;
  font-weight: 500;
  font-size: 1rem;
}

.empty-icon {
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: var(--color-text-secondary);
}

.empty-state h3 {
  font-size: clamp(1.125rem, 4vw, 1.5rem);
  font-weight: 600;
  margin: 0;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

/* Filters Section */
.filters-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  width: 100%;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  width: 100%;
}

.filter-group label .material-symbols-outlined {
  position: absolute;
  left: 0.75rem;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  font-size: 0.9375rem;
  box-sizing: border-box;
}

.filter-select {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  cursor: pointer;
  font-size: 0.9375rem;
  box-sizing: border-box;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 0;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  white-space: nowrap;
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
  gap: 0.375rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  min-width: 2.5rem;
  font-size: 0.875rem;
}

.pagination-number:hover {
  background-color: var(--color-background);
}

.pagination-number.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Tablet: 2 columnas */
@media (max-width: 1024px) {
  .projects-view {
    padding: 0 1rem;
  }

  .filters-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-group:first-child {
    grid-column: 1 / -1;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* Móvil: 1 columna */
@media (max-width: 640px) {
  .projects-view {
    padding: 0 0.75rem;
  }

  .projects-header {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .filters-section {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .filter-input,
  .filter-select {
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    font-size: 1rem;
  }

  .filter-select {
    padding-left: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem 1rem;
  }

  .pagination {
    gap: 0.5rem;
    padding: 1.5rem 0;
  }

  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  .pagination-numbers {
    gap: 0.25rem;
  }

  .pagination-number {
    padding: 0.4rem 0.6rem;
    min-width: 2rem;
    font-size: 0.8125rem;
  }
}

/* Móvil pequeño */
@media (max-width: 400px) {
  .projects-view {
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .pagination-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.75rem;
  }

  .pagination-number {
    padding: 0.35rem 0.5rem;
    min-width: 1.75rem;
    font-size: 0.75rem;
  }
}
</style>
