<template>
  <div class="explorar-proyectos-view">
    <!-- Barra de búsqueda y filtros -->
    <BarraBusquedaProyecto
      @update:search="handleSearch"
      @update:filters="handleFilters"
    />

    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando proyectos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="estado-error">
      <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <p>{{ error }}</p>
      <button class="btn-reintentar" @click="cargarProyectos">Reintentar</button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="proyectosFiltrados.length === 0" class="estado-vacio">
      <svg class="icon-vacio" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <h3>No se encontraron proyectos</h3>
      <p>Intenta ajustar los filtros de búsqueda para ver más resultados.</p>
    </div>

    <!-- Grid de proyectos -->
    <div v-else class="contenedor-proyectos">
      <div class="grid-proyectos">
        <ProyectoCard
          v-for="proyecto in proyectosFiltrados"
          :key="proyecto.id"
          :proyecto="proyecto"
          @ver-detalles="verDetalles"
          @inscribirse="inscribirse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ProyectosService } from '../../services/proyectos.service';
import type { Proyecto } from '../../types/proyecto';
import BarraBusquedaProyecto from '../../components/proyectos/BarraBusquedaProyecto.vue';
import ProyectoCard from '../../components/proyectos/ProyectoCard.vue';

const router = useRouter();

// Estado
const proyectos = ref<Proyecto[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);

// Filtros
const busqueda = ref('');
const filtros = ref({
  tab: 'nuevos',
  categoria: '',
  duracion: '',
  cupo: '',
  fechaInicio: '',
});

/**
 * Cargar todos los proyectos activos desde la BD
 */
const cargarProyectos = async () => {
  cargando.value = true;
  error.value = null;
  
  try {
    // Obtener todos los proyectos activos
    const todosLosProyectos = await ProyectosService.obtenerProyectos();
    // Filtrar solo activos (opcional si la BD ya lo hace)
    proyectos.value = todosLosProyectos.filter(p => !p.estado || p.estado === 'activo');
  } catch (e) {
    console.error('Error al cargar proyectos:', e);
    error.value = 'No se pudieron cargar los proyectos. Por favor, intenta nuevamente.';
  } finally {
    cargando.value = false;
  }
};

/**
 * Proyectos filtrados según búsqueda y filtros seleccionados
 */
const proyectosFiltrados = computed(() => {
  let resultado = [...proyectos.value];

  // Filtro por búsqueda (nombre o descripción)
  if (busqueda.value.trim()) {
    const query = busqueda.value.toLowerCase();
    resultado = resultado.filter(
      p =>
        p.nombre.toLowerCase().includes(query) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(query))
    );
  }

  // Filtro por categoría
  if (filtros.value.categoria) {
    resultado = resultado.filter(p => p.categoria === filtros.value.categoria);
  }

  // Filtro por duración (diferencia entre fecha_inicio y fecha_fin)
  if (filtros.value.duracion) {
    resultado = resultado.filter(p => {
      if (!p.fecha_inicio || !p.fecha_fin) return false;
      const inicio = new Date(p.fecha_inicio);
      const fin = new Date(p.fecha_fin);
      const diffMs = fin.getTime() - inicio.getTime();
      const diffDias = diffMs / (1000 * 60 * 60 * 24);
      const diffMeses = diffDias / 30;

      switch (filtros.value.duracion) {
        case '1-mes':
          return diffMeses <= 1;
        case '2-3-meses':
          return diffMeses > 1 && diffMeses <= 3;
        case 'mas-3-meses':
          return diffMeses > 3;
        default:
          return true;
      }
    });
  }

  // Filtro por cupo máximo
  if (filtros.value.cupo) {
    resultado = resultado.filter(p => {
      const cupo = p.cupo_maximo;
      if (!cupo) return false;
      switch (filtros.value.cupo) {
        case '1-25':
          return cupo >= 1 && cupo <= 25;
        case '26-50':
          return cupo >= 26 && cupo <= 50;
        case '51-100':
          return cupo >= 51 && cupo <= 100;
        case 'mas-100':
          return cupo > 100;
        default:
          return true;
      }
    });
  }

  // Filtro por fecha de inicio
  if (filtros.value.fechaInicio) {
    const ahora = new Date();
    resultado = resultado.filter(p => {
      if (!p.fecha_inicio) return false;
      const inicio = new Date(p.fecha_inicio);
      const diffMs = inicio.getTime() - ahora.getTime();
      const diffDias = diffMs / (1000 * 60 * 60 * 24);

      switch (filtros.value.fechaInicio) {
        case 'esta-semana':
          return diffDias >= 0 && diffDias <= 7;
        case 'este-mes':
          return diffDias >= 0 && diffDias <= 30;
        case 'proximo-mes':
          return diffDias > 30 && diffDias <= 60;
        default:
          return true;
      }
    });
  }

  // Ordenamiento por tab seleccionado
  if (filtros.value.tab === 'nuevos') {
    // Ordenar por fecha de inicio más reciente
    resultado.sort((a, b) => {
      if (!a.fecha_inicio) return 1;
      if (!b.fecha_inicio) return -1;
      return new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime();
    });
  } else if (filtros.value.tab === 'populares') {
    // Ordenar por cupo máximo (más popular = más cupos)
    resultado.sort((a, b) => (b.cupo_maximo || 0) - (a.cupo_maximo || 0));
  }

  return resultado;
});

/**
 * Maneja cambios en la búsqueda
 */
const handleSearch = (query: string) => {
  busqueda.value = query;
};

/**
 * Maneja cambios en los filtros
 */
const handleFilters = (nuevosFiltros: typeof filtros.value) => {
  filtros.value = nuevosFiltros;
};

/**
 * Ver detalles de un proyecto
 */
const verDetalles = (id: string) => {
  router.push({ name: 'proyectos-detalle', params: { id } });
};

/**
 * Inscribirse a un proyecto
 */
const inscribirse = (id: string) => {
  // TODO: Implementar lógica de inscripción
  alert(`Te has inscrito al proyecto con ID: ${id}`);
};

// Cargar proyectos al montar el componente
onMounted(() => {
  cargarProyectos();
});
</script>

<style scoped>
.explorar-proyectos-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Estados */
.estado-carga,
.estado-error,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 400px;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #4B0082;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.estado-carga p {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
}

.icon-error,
.icon-vacio {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
}

.icon-vacio {
  color: #9ca3af;
}

.estado-error p,
.estado-vacio p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
}

.estado-vacio h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2E2E2E;
  margin: 0;
}

.btn-reintentar {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #4B0082;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reintentar:hover {
  background: #3a0066;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 0, 130, 0.3);
}

/* Contenedor y grid */
.contenedor-proyectos {
  margin-top: 2rem;
}

.grid-proyectos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .explorar-proyectos-view {
    padding: 1rem;
  }

  .grid-proyectos {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
