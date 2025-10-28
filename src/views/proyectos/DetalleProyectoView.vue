<template>
  <div class="detalle-proyecto-view">
    <!-- Contenedor principal -->
    <div class="container">
      <div class="page-header">
        <button 
          type="button" 
          class="btn-volver"
          @click="volver"
        >
          <svg class="icon-arrow-left" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Volver
        </button>
        <h1 class="view-title">Detalle del Proyecto</h1>
      </div>
      <!-- Estado: Cargando -->
      <div v-if="cargando" class="estado-carga">
        <div class="spinner-grande"></div>
        <p>Cargando proyecto...</p>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="error" class="estado-error">
        <svg class="icon-error-grande" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3>Error al cargar proyecto</h3>
        <p>{{ error }}</p>
        <button class="btn-volver" @click="volver">
          Volver a la Lista
        </button>
      </div>

      <!-- Contenido del proyecto -->
      <div v-else-if="proyecto" class="proyecto-detalle">
        <div class="detalle-card">
          <div class="card-header">
            <span :class="['categoria-badge', `badge-${proyecto.categoria}`]">
              {{ getCategoriaLabel(proyecto.categoria) }}
            </span>
          </div>

          <div class="card-body">
            <h2 class="proyecto-nombre">{{ proyecto.nombre }}</h2>
            
            <p v-if="proyecto.descripcion" class="proyecto-descripcion">
              {{ proyecto.descripcion }}
            </p>

            <div class="proyecto-detalles">
              <div class="detalle-item">
                <div class="detalle-label">Fecha de Inicio</div>
                <div class="detalle-valor">{{ formatearFecha(proyecto.fecha_inicio) }}</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Fecha de Fin</div>
                <div class="detalle-valor">{{ formatearFecha(proyecto.fecha_fin) }}</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Capacidad Máxima</div>
                <div class="detalle-valor">{{ proyecto.cupo_maximo }} voluntarios</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Organización</div>
                <div class="detalle-valor">{{ proyecto.id_organizacion }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Horas y Asistencia -->
        <div class="horas-asistencia-container">
          <!-- Mis Horas -->
          <div class="horas-card">
            <div class="horas-header">
              <svg class="icon-horas" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <h3 class="horas-titulo">Mis Horas</h3>
            </div>
            <div class="horas-contenido">
              <div class="horas-numero">{{ horasRegistradas }}</div>
              <div class="horas-texto">horas registradas</div>
            </div>
            <button class="btn-registrar-horas" @click="registrarHoras">
              Registrar Horas
            </button>
          </div>

          <!-- Asistencia -->
          <div class="asistencia-card">
            <div class="asistencia-header">
              <svg class="icon-asistencia" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <h3 class="asistencia-titulo">Asistencia</h3>
            </div>
            <div class="asistencia-contenido">
              <div class="asistencia-stats">
                <div class="stat-item">
                  <span class="stat-numero">{{ asistenciasRegistradas }}</span>
                  <span class="stat-label">asistencias</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-numero">{{ totalSesiones }}</span>
                  <span class="stat-label">total sesiones</span>
                </div>
              </div>
              <div class="asistencia-porcentaje">
                <div class="porcentaje-barra">
                  <div class="porcentaje-progreso" :style="{ width: porcentajeAsistencia + '%' }"></div>
                </div>
                <span class="porcentaje-texto">{{ porcentajeAsistencia }}% de asistencia</span>
              </div>
            </div>
            <button class="btn-ver-asistencia" @click="verAsistencia">
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Proyecto } from '../../types/proyecto';
import { ProyectosService } from '../../services/proyectos.service';

const router = useRouter();
const route = useRoute();

// Estado
const proyecto = ref<Proyecto | null>(null);
const cargando = ref(true);
const error = ref('');
let orgId: string | null = null;

// Estado de horas y asistencia (datos de ejemplo)
const horasRegistradas = ref(12);
const asistenciasRegistradas = ref(8);
const totalSesiones = ref(10);
const porcentajeAsistencia = ref(80);

/**
 * Carga el proyecto por ID
 */
const cargarProyecto = async () => {
  cargando.value = true;
  error.value = '';

  try {
    const id = route.params.id as string;
    // Obtener organización logueada
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.tipo === 'organizacion') {
          orgId = user.id || user.id_organizacion || null;
        }
      }
    } catch {}

    proyecto.value = await ProyectosService.obtenerProyectoPorId(id);

    // Verificar que el proyecto pertenezca a la organización
    if (orgId && proyecto.value.id_organizacion !== orgId) {
      throw new Error('No estás autorizado para ver este proyecto');
    }
  } catch (err) {
    console.error('Error al cargar proyecto:', err);
    error.value = err instanceof Error 
      ? err.message 
      : 'No se pudo cargar el proyecto';
  } finally {
    cargando.value = false;
  }
};

/**
 * Vuelve a la lista de proyectos
 */
const volver = () => {
  router.push({ name: 'proyectos' });
};

/**
 * Obtiene el label de la categoría
 */
const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    social: 'Social',
    educativo: 'Educativo',
    ambiental: 'Ambiental',
  };
  return labels[categoria] || categoria;
};

/**
 * Formatea una fecha
 */
const formatearFecha = (fecha: string): string => {
  if (!fecha) return '-';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return fecha;
  }
};

/**
 * Registrar horas de voluntariado
 */
const registrarHoras = () => {
  router.push({ name: 'proyectos-horas' });
};

/**
 * Ver historial de asistencia
 */
const verAsistencia = () => {
  if (proyecto.value) {
    router.push({ name: 'proyectos-asistencia', params: { id: proyecto.value.id } });
  }
};

// Cargar proyecto al montar
onMounted(() => {
  cargarProyecto();
});
</script>

<style scoped>
.detalle-proyecto-view {
  background: #F7F5F0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: 2px solid #79C99E;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.btn-volver:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.icon-arrow-left {
  width: 1.125rem;
  height: 1.125rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
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

.spinner-grande {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-error-grande {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.estado-error h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
}

.estado-error p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.5rem 0 1.5rem;
}

.detalle-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  padding: 1.5rem;
  background: #f3eeff;
  border-bottom: 2px solid #79C99E;
}

.categoria-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
}

.badge-social {
  background: #dbeafe;
  color: #1e40af;
}

.badge-educativo {
  background: #fef3c7;
  color: #92400e;
}

.badge-ambiental {
  background: #d1fae5;
  color: #065f46;
}

.card-body {
  padding: 2rem;
}

.proyecto-nombre {
  font-size: 2.25rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.proyecto-descripcion {
  font-size: 1rem;
  color: #5a5a5a;
  line-height: 1.7;
  margin: 0;
}

.proyecto-detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detalle-item {
  padding: 1.25rem;
  background: #e8f5ed;
  border-radius: 6px;
  border: 2px solid #79C99E;
}

.detalle-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #5a5a5a;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalle-valor {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2E2E2E;
}

/* Horas y Asistencia */
.horas-asistencia-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.horas-card,
.asistencia-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.horas-header,
.asistencia-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8f5ed;
}

.icon-horas,
.icon-asistencia {
  width: 2rem;
  height: 2rem;
  color: #4B0082;
}

.horas-titulo,
.asistencia-titulo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.horas-contenido {
  text-align: center;
  padding: 1.5rem 0;
}

.horas-numero {
  font-size: 4rem;
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.horas-texto {
  font-size: 1rem;
  color: #5a5a5a;
  font-weight: 600;
}

.btn-registrar-horas,
.btn-ver-asistencia {
  width: 100%;
  padding: 0.875rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-registrar-horas:hover,
.btn-ver-asistencia:hover {
  background: #66b388;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.asistencia-contenido {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.asistencia-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  background: #f3eeff;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-numero {
  font-size: 2.5rem;
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #5a5a5a;
  font-weight: 600;
}

.stat-divider {
  width: 2px;
  height: 3rem;
  background: #79C99E;
}

.asistencia-porcentaje {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.porcentaje-barra {
  width: 100%;
  height: 1.5rem;
  background: #e8f5ed;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #79C99E;
}

.porcentaje-progreso {
  height: 100%;
  background: linear-gradient(90deg, #79C99E 0%, #4B0082 100%);
  transition: width 0.3s ease;
}

.porcentaje-texto {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4B0082;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .proyecto-nombre {
    font-size: 1.5rem;
  }

  .proyecto-detalles {
    grid-template-columns: 1fr;
  }

  .horas-asistencia-container {
    grid-template-columns: 1fr;
  }

  .horas-numero {
    font-size: 3rem;
  }

  .stat-numero {
    font-size: 2rem;
  }
}
</style>
