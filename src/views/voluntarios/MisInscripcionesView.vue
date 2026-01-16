<template>
  <div class="mis-inscripciones-view">
    <div class="container">
      <div class="page-header">
        <h1 class="view-title">Mis Inscripciones</h1>
        <p class="view-subtitle">Revisa el estado de todas tus solicitudes de voluntariado</p>
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
            placeholder="Buscar inscripciones por proyecto..."
            class="search-input"
          />
        </div>
      </div>

      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando inscripciones...</p>
      </div>

      <div v-else-if="error" class="estado-error">
        <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Error al cargar inscripciones</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else class="inscripciones-container">
        <section v-if="inscripcionesActivas.length > 0" class="seccion-inscripciones">
          <div class="seccion-header activa">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2 class="seccion-titulo">Inscripciones Activas</h2>
            <span class="seccion-contador">{{ inscripcionesActivas.length }}</span>
          </div>
          <div class="inscripciones-grid">
            <InscripcionCard
              v-for="item in inscripcionesActivas"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-proyecto="verProyecto"
            />
          </div>
        </section>

        <section v-if="inscripcionesEspera.length > 0" class="seccion-inscripciones">
          <div class="seccion-header espera">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h2 class="seccion-titulo">En Espera de Aprobación</h2>
            <span class="seccion-contador">{{ inscripcionesEspera.length }}</span>
          </div>
          <div class="inscripciones-grid">
            <InscripcionCard
              v-for="item in inscripcionesEspera"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-proyecto="verProyecto"
            />
          </div>
        </section>

        <section v-if="inscripcionesCompletadas.length > 0" class="seccion-inscripciones">
          <div class="seccion-header completado">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2 class="seccion-titulo">Inscripciones Completadas</h2>
            <span class="seccion-contador">{{ inscripcionesCompletadas.length }}</span>
          </div>
          <div class="inscripciones-grid">
            <InscripcionCard
              v-for="item in inscripcionesCompletadas"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-proyecto="verProyecto"
            />
          </div>
        </section>

        <section v-if="inscripcionesCanceladas.length > 0" class="seccion-inscripciones">
          <div class="seccion-header cancelado">
            <svg class="seccion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 class="seccion-titulo">Inscripciones Canceladas</h2>
            <span class="seccion-contador">{{ inscripcionesCanceladas.length }}</span>
          </div>
          <div class="inscripciones-grid">
            <InscripcionCard
              v-for="item in inscripcionesCanceladas"
              :key="item.inscripcion.id_inscripcion"
              :proyecto="item.proyecto"
              :inscripcion="item.inscripcion"
              @ver-proyecto="verProyecto"
            />
          </div>
        </section>

        <div v-if="!hayInscripciones" class="sin-inscripciones">
          <svg class="icon-sin-inscripciones" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <h3>No tienes inscripciones registradas</h3>
          <p>Explora proyectos disponibles y envía tu primera inscripción</p>
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
import InscripcionCard from '@/components/proyectos/InscripcionCard.vue';
import InscripcionesService from '@/services/inscripciones.service';
import { ProyectosService } from '@/services/proyectos.service';
import type { IInscripcion } from '@/types/IInscripcion';
import type { Proyecto } from '@/types/proyecto';

const router = useRouter();

interface InscripcionConProyecto {
  proyecto: Proyecto;
  inscripcion: IInscripcion;
}

const cargando = ref(true);
const error = ref('');
const searchQuery = ref('');
const inscripcionesConProyectos = ref<InscripcionConProyecto[]>([]);

const inscripcionesFiltradas = computed(() => {
  if (!searchQuery.value.trim()) {
    return inscripcionesConProyectos.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return inscripcionesConProyectos.value.filter(item =>
    item.proyecto.nombre.toLowerCase().includes(query) ||
    item.proyecto.descripcion?.toLowerCase().includes(query)
  );
});

const inscripcionesActivas = computed(() =>
  inscripcionesFiltradas.value.filter(item => item.inscripcion.estado === 'activa')
);

const inscripcionesEspera = computed(() =>
  inscripcionesFiltradas.value.filter(item => item.inscripcion.estado === 'espera')
);

const inscripcionesCompletadas = computed(() =>
  inscripcionesFiltradas.value.filter(item => item.inscripcion.estado === 'completado')
);

const inscripcionesCanceladas = computed(() =>
  inscripcionesFiltradas.value.filter(item => item.inscripcion.estado === 'cancelado')
);

const hayInscripciones = computed(() => inscripcionesConProyectos.value.length > 0);

const cargarInscripciones = async () => {
  cargando.value = true;
  error.value = '';
  
  try {
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
      } catch (e) {
        console.error('Error cargando proyecto:', e);
        return null;
      }
    });
    
    const resultados = await Promise.all(proyectosPromises);
    inscripcionesConProyectos.value = resultados.filter((item): item is InscripcionConProyecto => item !== null);
    
  } catch (e) {
    console.error('Error al cargar inscripciones:', e);
    error.value = e instanceof Error ? e.message : 'Error desconocido';
  } finally {
    cargando.value = false;
  }
};

const verProyecto = (idProyecto: string) => {
  router.push({ name: 'proyectos-detalle-publico', params: { id: idProyecto } });
};

const explorarProyectos = () => {
  router.push({ name: 'explorar-proyectos' });
};

onMounted(() => {
  cargarInscripciones();
});
</script>

<style scoped>
.mis-inscripciones-view {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  padding: 2rem 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.view-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2E2E2E;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.view-subtitle {
  font-size: 1.125rem;
  color: #5a5a5a;
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.estado-carga,
.estado-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-error {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.inscripciones-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.seccion-inscripciones {
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
  color: #2E2E2E;
  margin: 0;
  flex: 1;
}

.seccion-contador {
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
}

.inscripciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.sin-inscripciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon-sin-inscripciones {
  width: 5rem;
  height: 5rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.sin-inscripciones h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2E2E2E;
  margin: 0 0 0.5rem;
}

.sin-inscripciones p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
  max-width: 400px;
}

.btn-explorar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-explorar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.icon-btn {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .view-title {
    font-size: 2rem;
  }

  .inscripciones-grid {
    grid-template-columns: 1fr;
  }

  .seccion-titulo {
    font-size: 1.25rem;
  }
}
</style>
