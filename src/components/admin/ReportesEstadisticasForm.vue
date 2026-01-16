<template>
  <div class="reportes-estadisticas-form">
    <div class="form-header">
      <h1 class="form-title">Reportes y Estadísticas</h1>
      <p class="form-subtitle">Métricas y estadísticas del sistema</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="estado-error">
      <p>{{ error }}</p>
      <button @click="cargarEstadisticas" class="btn-reintentar">Reintentar</button>
    </div>

    <!-- Estadísticas -->
    <div v-else class="estadisticas-container">
      <div class="grid-estadisticas">
        <div class="card-estadistica">
          <div class="icono-estadistica icono-voluntarios">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Voluntarios Registrados</h3>
            <p class="valor-estadistica">{{ estadisticas.totalVoluntarios }}</p>
          </div>
        </div>

        <div class="card-estadistica">
          <div class="icono-estadistica icono-organizaciones">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Organizaciones</h3>
            <p class="valor-estadistica">{{ estadisticas.totalOrganizaciones }}</p>
          </div>
        </div>

        <div class="card-estadistica">
          <div class="icono-estadistica icono-proyectos">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Total Proyectos</h3>
            <p class="valor-estadistica">{{ estadisticas.totalProyectos }}</p>
          </div>
        </div>

        <div class="card-estadistica">
          <div class="icono-estadistica icono-activos">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Proyectos Activos</h3>
            <p class="valor-estadistica">{{ estadisticas.proyectosActivos }}</p>
          </div>
        </div>

        <div class="card-estadistica">
          <div class="icono-estadistica icono-completados">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Proyectos Completados</h3>
            <p class="valor-estadistica">{{ estadisticas.proyectosCompletados }}</p>
          </div>
        </div>

        <div class="card-estadistica">
          <div class="icono-estadistica icono-inscripciones">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
          <div class="contenido-estadistica">
            <h3 class="titulo-estadistica">Total Inscripciones</h3>
            <p class="valor-estadistica">{{ estadisticas.totalInscripciones }}</p>
          </div>
        </div>
      </div>

      <div class="acciones-container">
        <button @click="exportarReporte" class="btn-exportar" :disabled="cargando">
          Exportar Reporte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AdminService } from '../../services/adminService';
import { useAlert } from '../../composables/useAlert';

const { showError } = useAlert();

// Estado
const estadisticas = ref({
  totalVoluntarios: 0,
  totalOrganizaciones: 0,
  totalProyectos: 0,
  proyectosActivos: 0,
  proyectosCompletados: 0,
  totalInscripciones: 0,
});
const cargando = ref(true);
const error = ref('');

/**
 * Carga las estadísticas desde el servicio
 */
const cargarEstadisticas = async () => {
  cargando.value = true;
  error.value = '';

  try {
    estadisticas.value = await AdminService.obtenerEstadisticas();
  } catch (err) {
    console.error('Error al cargar estadísticas:', err);
    error.value =
      err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas';
  } finally {
    cargando.value = false;
  }
};

/**
 * Exporta un reporte en formato CSV
 */
const exportarReporte = () => {
  try {
    const datos = [
      ['Métrica', 'Valor'],
      ['Voluntarios Registrados', estadisticas.value.totalVoluntarios],
      ['Organizaciones', estadisticas.value.totalOrganizaciones],
      ['Total Proyectos', estadisticas.value.totalProyectos],
      ['Proyectos Activos', estadisticas.value.proyectosActivos],
      ['Proyectos Completados', estadisticas.value.proyectosCompletados],
      ['Total Inscripciones', estadisticas.value.totalInscripciones],
    ];

    const csv = datos.map((fila) => fila.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `reporte-estadisticas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error al exportar reporte:', err);
    showError('Error', 'No se pudo exportar el reporte');
  }
};

// Cargar estadísticas al montar
onMounted(() => {
  cargarEstadisticas();
});
</script>

<style scoped>
.reportes-estadisticas-form {
  background: white;
  padding: clamp(1rem, 4vw, 2rem);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #6b7280;
  margin: 0;
}

.estado-carga,
.estado-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-reintentar {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.btn-reintentar:hover {
  background: #4338ca;
}

.estadisticas-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-estadisticas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card-estadistica {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s ease;
}

.card-estadistica:hover {
  border-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.icono-estadistica {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icono-estadistica svg {
  width: 2rem;
  height: 2rem;
  color: white;
}

.icono-voluntarios {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icono-organizaciones {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.icono-proyectos {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.icono-activos {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.icono-completados {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.icono-inscripciones {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.contenido-estadistica {
  flex: 1;
  min-width: 0;
}

.titulo-estadistica {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.valor-estadistica {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.acciones-container {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.btn-exportar {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-exportar:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-exportar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .grid-estadisticas {
    grid-template-columns: 1fr;
  }

  .card-estadistica {
    padding: 1rem;
  }

  .icono-estadistica {
    width: 3rem;
    height: 3rem;
  }

  .icono-estadistica svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .valor-estadistica {
    font-size: 1.5rem;
  }
}
</style>

