<template>
  <div class="barra-busqueda">
    <!-- Título y Subtítulo -->
    <div class="header-seccion">
      <h1 class="titulo-principal">{{ t.exploreProjects }}</h1>
      <p class="subtitulo">{{ t.projectsSubtitle }}</p>
    </div>

    <!-- Buscador -->
    <div class="search-wrapper">
      <svg class="icon-search" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        @input="emitSearch"
        :placeholder="t.searchPlaceholder"
        class="search-input"
      />
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <!-- Tabs Nuevos / Más Populares -->
      <div class="tabs-section">
        <button
          :class="['tab-btn', { 'active': selectedTab === 'nuevos' }]"
          @click="selectTab('nuevos')"
        >
          {{ t.newestTab }}
        </button>
        <button
          :class="['tab-btn', { 'active': selectedTab === 'populares' }]"
          @click="selectTab('populares')"
        >
          {{ t.mostPopularTab }}
        </button>
      </div>

      <!-- Filtros principales -->
      <div class="filter-group">
        <label class="filter-label">{{ t.category }}</label>
        <select v-model="selectedCategoria" @change="emitFilters" class="filter-select">
          <option value="">{{ t.all }}</option>
          <option value="social">{{ t.categorySocial }}</option>
          <option value="educativo">{{ t.categoryEducational }}</option>
          <option value="ambiental">{{ t.categoryEnvironmental }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.duration }}</label>
        <select v-model="selectedDuracion" @change="emitFilters" class="filter-select">
          <option value="">{{ t.all }}</option>
          <option value="1-mes">{{ t.durationOneMonth }}</option>
          <option value="2-3-meses">{{ t.durationTwoToThreeMonths }}</option>
          <option value="mas-3-meses">{{ t.durationMoreThanThreeMonths }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.maxCapacity }}</label>
        <select v-model="selectedCupo" @change="emitFilters" class="filter-select">
          <option value="">{{ t.all }}</option>
          <option value="1-25">1-25</option>
          <option value="26-50">26-50</option>
          <option value="51-100">51-100</option>
          <option value="mas-100">{{ t.moreThan100 }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.startDate }}</label>
        <select v-model="selectedFechaInicio" @change="emitFilters" class="filter-select">
          <option value="">{{ t.all }}</option>
          <option value="esta-semana">{{ t.thisWeek }}</option>
          <option value="este-mes">{{ t.thisMonth }}</option>
          <option value="proximo-mes">{{ t.nextMonth }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLanguage } from '@/composables/useLanguage';

// Props y emits
const emit = defineEmits<{
  'update:search': [value: string];
  'update:filters': [filters: {
    tab: string;
    categoria: string;
    duracion: string;
    cupo: string;
    fechaInicio: string;
  }];
}>();

// Estado de los filtros
const searchQuery = ref('');
const selectedTab = ref('nuevos');
const selectedCategoria = ref('');
const selectedDuracion = ref('');
const selectedCupo = ref('');
const selectedFechaInicio = ref('');
const { t } = useLanguage();

/**
 * Emite el valor del buscador
 */
const emitSearch = () => {
  emit('update:search', searchQuery.value);
};

/**
 * Selecciona el tab activo
 */
const selectTab = (tab: string) => {
  selectedTab.value = tab;
  emitFilters();
};

/**
 * Emite todos los filtros seleccionados
 */
const emitFilters = () => {
  emit('update:filters', {
    tab: selectedTab.value,
    categoria: selectedCategoria.value,
    duracion: selectedDuracion.value,
    cupo: selectedCupo.value,
    fechaInicio: selectedFechaInicio.value,
  });
};
</script>

<style scoped>
.barra-busqueda {
  background: #F7F5F0;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.header-seccion {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo-principal {
  font-size: 1.875rem;
  font-weight: 800;
  color: #2E2E2E;
  margin: 0 0 0.5rem;
  letter-spacing: -0.5px;
}

.subtitulo {
  font-size: 1rem;
  color: #5a5a5a;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Buscador */
.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.icon-search {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4B0082;
  box-shadow: 0 0 0 3px rgba(75, 0, 130, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Tabs y Filtros */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.tabs-section {
  display: flex;
  gap: 0.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
  border: 2px solid #e5e7eb;
}

.tab-btn {
  padding: 0.625rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #4B0082;
  background: #f9fafb;
}

.tab-btn.active {
  color: white;
  background: #4B0082;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 150px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-select {
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
  color: #2E2E2E;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: #9ca3af;
}

.filter-select:focus {
  outline: none;
  border-color: #4B0082;
  box-shadow: 0 0 0 3px rgba(75, 0, 130, 0.1);
}

.barra-busqueda {
  padding: clamp(1rem, 4vw, 2.5rem) clamp(1rem, 5vw, 2rem);
}

.titulo-principal {
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
}

.subtitulo {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

.search-input {
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(0.75rem, 2vw, 1rem) clamp(0.625rem, 2vw, 0.875rem) clamp(2.25rem, 5vw, 3rem);
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.icon-search {
  left: clamp(0.75rem, 2vw, 1rem);
  width: clamp(1rem, 2.5vw, 1.25rem);
  height: clamp(1rem, 2.5vw, 1.25rem);
}

.tab-btn {
  padding: clamp(0.5rem, 1vw, 0.625rem) clamp(1rem, 2vw, 1.5rem);
  font-size: clamp(0.8rem, 2vw, 0.9375rem);
}

.filter-group {
  min-width: clamp(140px, 20vw, 200px);
}

.filter-label {
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  margin-bottom: clamp(0.25rem, 0.5vw, 0.375rem);
}

.filter-select {
  padding: clamp(0.5rem, 1vw, 0.625rem) clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.8rem, 2vw, 0.9375rem);
}

/* Responsive */
@media (max-width: 1200px) {
  .filters-container {
    gap: clamp(0.75rem, 2vw, 1rem);
  }
}

@media (max-width: 1024px) {
  .titulo-principal {
    font-size: 1.625rem;
  }

  .filters-container {
    gap: 0.75rem;
  }

  .filter-group {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .barra-busqueda {
    padding: 1.25rem 1rem;
  }

  .titulo-principal {
    font-size: 1.375rem;
  }

  .subtitulo {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .search-wrapper {
    margin-bottom: 1.5rem;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .tabs-section {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .filter-group {
    width: 100%;
    min-width: auto;
  }

  .filter-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .barra-busqueda {
    padding: 1rem 0.875rem;
  }

  .titulo-principal {
    font-size: 1.25rem;
  }

  .subtitulo {
    font-size: 0.8125rem;
  }

  .search-input {
    font-size: 0.9375rem;
    padding: 0.65rem 0.75rem 0.65rem 2.75rem;
  }

  .icon-search {
    left: 0.75rem;
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 480px) {
  .barra-busqueda {
    padding: 0.875rem 0.75rem;
  }

  .titulo-principal {
    font-size: 1.125rem;
  }

  .subtitulo {
    font-size: 0.75rem;
  }

  .filters-container {
    gap: 0.75rem;
  }

  .tabs-section {
    padding: 0.2rem;
  }

  .tab-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }

  .filter-group {
    width: 100%;
  }

  .filter-label {
    font-size: 0.75rem;
  }

  .filter-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
