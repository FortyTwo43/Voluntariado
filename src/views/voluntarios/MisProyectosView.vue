<template>
  <div class="mis-proyectos-view">
    <div class="container">
      <div class="page-header">
        <h1 class="view-title">Mis Proyectos</h1>
        <p class="view-subtitle">Gestiona todos tus proyectos de voluntariado</p>
      </div>

      <div class="search-section">
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar proyectos por nombre..."
            class="search-input"
          />
        </div>
      </div>

      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando proyectos...</p>
      </div>

      <div v-else-if="error" class="estado-error">
        <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Error al cargar proyectos</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else class="proyectos-container">
        <section v-if="proyectosActivos.length > 0" class="seccion-proyectos">
          <div class="seccion-header activa">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2 class="seccion-titulo">Proyectos Activos</h2>
            <span class="seccion-contador">{{ proyectosActivos.length }}</span>
          </div>
          <div class="proyectos-grid">
            <ProyectoInscritoCard
              v-for="item in proyectosActivos"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-detalles="verDetalles"
            />
          </div>
        </section>

        <section v-if="proyectosEspera.length > 0" class="seccion-proyectos">
          <div class="seccion-header espera">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h2 class="seccion-titulo">En Espera de Aprobación</h2>
            <span class="seccion-contador">{{ proyectosEspera.length }}</span>
          </div>
          <div class="proyectos-grid">
            <ProyectoInscritoCard
              v-for="item in proyectosEspera"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-detalles="verDetalles"
            />
          </div>
        </section>

        <section v-if="proyectosCompletados.length > 0" class="seccion-proyectos">
          <div class="seccion-header completado">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2 class="seccion-titulo">Proyectos Completados</h2>
            <span class="seccion-contador">{{ proyectosCompletados.length }}</span>
          </div>
          <div class="proyectos-grid">
            <ProyectoInscritoCard
              v-for="item in proyectosCompletados"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-detalles="verDetalles"
            />
          </div>
        </section>

        <section v-if="proyectosCancelados.length > 0" class="seccion-proyectos">
          <div class="seccion-header cancelado">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 class="seccion-titulo">Proyectos Cancelados</h2>
            <span class="seccion-contador">{{ proyectosCancelados.length }}</span>
          </div>
          <div class="proyectos-grid">
            <ProyectoInscritoCard
              v-for="item in proyectosCancelados"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-detalles="verDetalles"
            />
          </div>
        </section>

        <div v-if="!hayProyectos" class="sin-proyectos">
          <svg class="icon-sin-proyectos" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>No tienes proyectos inscritos</h3>
          <p>Explora proyectos disponibles y comienza tu experiencia de voluntariado</p>
          <button @click="explorarProyectos" class="btn-explorar">
            <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Explorar Proyectos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProyectoInscritoCard from '@/components/proyectos/ProyectoInscritoCard.vue';
import InscripcionesService from '@/services/inscripciones.service';
import { ProyectosService } from '@/services/proyectos.service';
import type { IInscripcion, EstadoInscripcion } from '@/types/IInscripcion';
import type { Proyecto } from '@/types/proyecto';

const router = useRouter();

interface ProyectoConInscripcion {
  proyecto: Proyecto;
  inscripcion: IInscripcion;
}

const cargando = ref(true);
const error = ref('');
const searchQuery = ref('');
const proyectosConInscripciones = ref<ProyectoConInscripcion[]>([]);

const proyectosFiltrados = computed(() => {
  if (!searchQuery.value.trim()) {
    return proyectosConInscripciones.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return proyectosConInscripciones.value.filter(item =>
    item.proyecto.nombre.toLowerCase().includes(query) ||
    item.proyecto.descripcion?.toLowerCase().includes(query)
  );
});

const proyectosActivos = computed(() =>
  proyectosFiltrados.value.filter(item => item.inscripcion.estado === 'activa')
);

const proyectosEspera = computed(() =>
  proyectosFiltrados.value.filter(item => item.inscripcion.estado === 'espera')
);

const proyectosCompletados = computed(() =>
  proyectosFiltrados.value.filter(item => item.inscripcion.estado === 'completado')
);

const proyectosCancelados = computed(() =>
  proyectosFiltrados.value.filter(item => item.inscripcion.estado === 'cancelado')
);

const hayProyectos = computed(() => proyectosConInscripciones.value.length > 0);

const cargarProyectos = async () => {
  try {
    cargando.value = true;
    error.value = '';

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }

    const user = JSON.parse(userStr);
    const idVoluntario = user.id;

    const inscripciones = await InscripcionesService.obtenerInscripcionesPorVoluntario(idVoluntario);

    const proyectosPromises = inscripciones.map(async (inscripcion) => {
      try {
        const proyecto = await ProyectosService.obtenerProyectoPorId(inscripcion.id_proyecto);
        return { proyecto, inscripcion };
      } catch {
        return null;
      }
    });

    const resultados = await Promise.all(proyectosPromises);
    proyectosConInscripciones.value = resultados.filter(
      (item): item is ProyectoConInscripcion => item !== null
    );
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    cargando.value = false;
  }
};

const verDetalles = (idProyecto: string, estado: EstadoInscripcion) => {
  router.push({
    name: 'proyectos-detalle-publico',
    params: { id: idProyecto },
    query: { estado }
  });
};

const explorarProyectos = () => {
  router.push('/explorar-proyectos');
};

onMounted(() => {
  cargarProyectos();
});
</script>

<style scoped>
.mis-proyectos-view {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.view-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.view-subtitle {
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #a0aec0;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.estado-carga,
.estado-error {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.estado-carga p {
  font-size: 1.125rem;
  color: #718096;
}

.icon-error {
  width: 4rem;
  height: 4rem;
  color: #e53e3e;
  margin: 0 auto 1rem;
}

.estado-error h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.estado-error p {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}


.proyectos-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Estilos iguales a MisInscripcionesView para encabezados de sección */
.seccion-proyectos {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.seccion-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid;
}

.seccion-header.activa {
  border-color: #10b981;
}

.seccion-header.espera {
  border-color: #f59e0b;
}

.seccion-header.completado {
  border-color: #3b82f6;
}

.seccion-header.cancelado {
  border-color: #ef4444;
}

.seccion-icon {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.seccion-header.activa .seccion-icon {
  color: #10b981;
}

.seccion-header.espera .seccion-icon {
  color: #f59e0b;
}

.seccion-header.completado .seccion-icon {
  color: #3b82f6;
}

.seccion-header.cancelado .seccion-icon {
  color: #ef4444;
}

.seccion-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex: 1;
}

.seccion-contador {
  background: white;
  color: #2d3748;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  min-width: 2.5rem;
  text-align: center;
}

.proyectos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.sin-proyectos {
  text-align: center;
  padding: 4rem 2rem;
}

.icon-sin-proyectos {
  width: 5rem;
  height: 5rem;
  color: #cbd5e0;
  margin: 0 auto 1.5rem;
}

.sin-proyectos h3 {
  font-size: 1.75rem;
  color: #2d3748;
  margin: 0 0 0.75rem 0;
}

.sin-proyectos p {
  font-size: 1.125rem;
  color: #718096;
  margin: 0 0 2rem 0;
}

.btn-explorar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-explorar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.icon-btn {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .mis-proyectos-view {
    padding: 1.5rem 1rem;
  }

  .view-title {
    font-size: 2rem;
  }

  .view-subtitle {
    font-size: 1rem;
  }

  .proyectos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .seccion-header {
    padding: 0.875rem 1rem;
    flex-wrap: wrap;
  }

  .seccion-titulo {
    font-size: 1.25rem;
  }

  .seccion-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .proyectos-container {
    gap: 2rem;
  }
}
</style>
