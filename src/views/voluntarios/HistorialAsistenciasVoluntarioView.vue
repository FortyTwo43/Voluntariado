<template>
  <div class="historial-asistencias-view">
    <div class="container">
      <!-- Header -->
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
        <div class="header-content">
          <h1 class="view-title">Historial de Asistencias</h1>
          <p class="view-subtitle">Consulta tu registro de asistencias e inasistencias</p>
        </div>
        <button 
          class="btn-exportar"
          @click="openExportModal"
          :disabled="asistencias.length === 0"
        >
          <svg class="icon-pdf" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
          </svg>
          Exportar PDF
        </button>
      </div>

      <!-- Estado: Cargando -->
      <div v-if="cargando" class="estado-carga">
        <div class="spinner-grande"></div>
        <p>Cargando historial...</p>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="error" class="estado-error">
        <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3>Error al cargar historial</h3>
        <p>{{ error }}</p>
      </div>

      <!-- Resumen de estadísticas -->
      <div v-else-if="asistencias.length > 0" class="contenido">
        <div class="resumen-card">
          <h2 class="resumen-titulo">Resumen</h2>
          <div class="estadisticas">
            <div class="stat-box stat-asistencias">
              <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div class="stat-info">
                <span class="stat-numero">{{ totalAsistencias }}</span>
                <span class="stat-label">Asistencias</span>
              </div>
            </div>
            
            <div class="stat-box stat-inasistencias">
              <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="stat-info">
                <span class="stat-numero">{{ totalInasistencias }}</span>
                <span class="stat-label">Inasistencias</span>
              </div>
            </div>

            <div class="stat-box stat-porcentaje">
              <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <div class="stat-info">
                <span class="stat-numero">{{ porcentajeAsistencia }}%</span>
                <span class="stat-label">Asistencia</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de asistencias -->
        <div class="tabla-card">
          <h2 class="tabla-titulo">Detalle de Asistencias</h2>
          
          <div class="tabla-container">
            <table class="tabla-asistencias">
              <thead>
                <tr>
                  <th>ID Asistencia</th>
                  <th>ID Hora</th>
                  <th>Estado</th>
                  <th>Actividad</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="asistencia in asistencias" 
                  :key="asistencia.id_asistencia"
                  :class="{ 'fila-inasistencia': asistencia.presencia === false }"
                >
                  <td class="columna-fecha">{{ asistencia.id_asistencia.substring(0, 8) }}...</td>
                  <td class="columna-dia">{{ asistencia.id_hora.substring(0, 8) }}...</td>
                  <td class="columna-estado">
                    <span 
                      :class="['badge-estado', asistencia.presencia === true ? 'badge-asistio' : 'badge-falta']"
                    >
                      {{ asistencia.presencia === true ? 'Asistió' : 'Falta' }}
                    </span>
                  </td>
                  <td class="columna-proyecto">{{ asistencia.actividad_realizada || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ExportAsistenciasModal
          v-if="showExportModal"
          :show-projects="false"
          @close="showExportModal=false"
          @export="handleExportEmit"
        />
      </div>

      <!-- Estado: Sin asistencias -->
      <div v-else class="estado-vacio">
        <svg class="icon-vacio" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        <h3>No hay asistencias registradas</h3>
        <p>Aún no tienes asistencias registradas en tus proyectos.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { IAsistencia } from '../../types/IAsistencia';
import AsistenciasService from '../../services/asistencias.service';
import ExportAsistenciasModal from '@/components/modals/ExportAsistenciasModal.vue'

const router = useRouter();
const route = useRoute();

// Estado
const asistencias = ref<(IAsistencia & { nombreProyecto?: string; hora?: string })[]>([]);
const cargando = ref(true);
const error = ref('');
const idVoluntario = ref<string | null>(null);

/**
 * Estadísticas computadas
 */
const totalAsistencias = computed(() => 
  asistencias.value.filter(a => a.presencia === true).length
);

const totalInasistencias = computed(() => 
  asistencias.value.filter(a => a.presencia === false).length
);

const porcentajeAsistencia = computed(() => {
  const total = asistencias.value.length;
  if (total === 0) return 0;
  return Math.round((totalAsistencias.value / total) * 100);
});

/**
 * Volver a la página anterior
 */
const volver = () => {
  router.back();
};

/**
 * Carga las asistencias del voluntario
 */
const cargarAsistencias = async () => {
  cargando.value = true;
  error.value = '';

  try {
    // Obtener ID del voluntario
    const raw = localStorage.getItem('user');
    if (raw) {
      const user = JSON.parse(raw);
      idVoluntario.value = user.id || user.id_voluntario || null;
    }

    if (!idVoluntario.value) {
      throw new Error('No se pudo identificar al voluntario');
    }

    // Obtener asistencias del voluntario
    const idProyecto = route.params.idProyecto as string;
    const asistenciasData = await AsistenciasService.obtenerAsistenciasPorVoluntario(
      idVoluntario.value,
      idProyecto
    );

    // Asignar datos directamente (ya no enriquecemos con proyecto y hora)
    asistencias.value = asistenciasData;

  } catch (err) {
    console.error('Error al cargar asistencias:', err);
    error.value = err instanceof Error 
      ? err.message 
      : 'No se pudieron cargar las asistencias';
  } finally {
    cargando.value = false;
  }
};

/**
 * Exporta el historial a PDF
 */

const showExportModal = ref(false)

const openExportModal = () => { showExportModal.value = true }

const exportarPDF = async (filters?: { from: string | null; to: string | null; projectIds?: string[] | null }) => {
  if (!filters) { openExportModal(); return }

  // Filtrar asistencias por rango de fechas
  let rows = asistencias.value.slice();

  if (filters.from) {
    const fromD = new Date(filters.from);
    fromD.setHours(0,0,0,0);
    rows = rows.filter(r => {
      const f = r.fecha ? new Date(r.fecha) : null;
      return f ? f >= fromD : false;
    });
  }
  if (filters.to) {
    const toD = new Date(filters.to);
    toD.setHours(23,59,59,999);
    rows = rows.filter(r => {
      const f = r.fecha ? new Date(r.fecha) : null;
      return f ? f <= toD : false;
    });
  }

  try {
    const mod = await import('jspdf');
    await import('jspdf-autotable');
    // @ts-ignore
    const { default: jsPDF } = mod;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text('Historial de Asistencias', 40, 40);

    const head = [['Fecha','ID Asistencia','Proyecto','Estado','Actividad']];
    const body = rows.length > 0 ? rows.map(r => {
      const fecha = r.fecha ? new Date(r.fecha).toLocaleDateString() : '-';
      const estado = r.presencia === true ? 'Asistió' : 'Falta';
      return [fecha, r.id_asistencia.substring(0,8), r.id_proyecto, estado, r.actividad_realizada || '-'];
    }) : [['-','-','No hay registros','','']];

    // @ts-ignore
    (doc as any).autoTable({ head, body, startY: 60, styles: { fontSize: 9 } });
    const now = new Date();
    const filename = `historial_asistencias_${now.toISOString().slice(0,19).replace(/[:T]/g,'_')}.pdf`;
    doc.save(filename);
  } catch (e) {
    console.error('Error generando PDF', e);
    error.value = 'No se pudo generar el PDF. Asegúrate de instalar las dependencias.';
  }
}

// Cargar asistencias al montar
onMounted(() => {
  cargarAsistencias();
});

// Modal de export
const handleExportEmit = async (filters: any) => {
  showExportModal.value = false;
  await exportarPDF(filters);
}
</script>

<style scoped>
.historial-asistencias-view {
  background: #F7F5F0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.page-header {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2rem);
  background: white;
  border-radius: 12px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
  min-width: 250px;
}

.view-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 0.5rem 0;
}

.view-subtitle {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  color: #5a5a5a;
  margin: 0;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #79C99E;
  color: #4B0082;
  padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  border-radius: 8px;
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-volver:hover {
  background: #79C99E;
  color: white;
  transform: translateX(-4px);
}

.icon-arrow-left {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-exportar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #79C99E 0%, #4B0082 100%);
  border: none;
  color: white;
  padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  border-radius: 8px;
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-exportar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(121, 201, 158, 0.4);
}

.btn-exportar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-pdf {
  width: 1.25rem;
  height: 1.25rem;
}

/* Estados */
.estado-carga,
.estado-error,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(3rem, 6vw, 5rem);
  background: white;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e8f5ed;
}

.spinner-grande {
  width: 4rem;
  height: 4rem;
  border: 4px solid #e8f5ed;
  border-top-color: #79C99E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-error,
.icon-vacio {
  width: 5rem;
  height: 5rem;
  color: #79C99E;
  margin-bottom: 1.5rem;
}

.estado-error .icon-error {
  color: #FF6B6B;
}

.estado-carga p,
.estado-error p,
.estado-vacio p {
  color: #5a5a5a;
  font-size: clamp(1rem, 2vw, 1.125rem);
  margin: 0.5rem 0 0;
}

.estado-error h3,
.estado-vacio h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 0.5rem 0;
}

/* Contenido */
.contenido {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
}

/* Resumen */
.resumen-card {
  background: white;
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.resumen-titulo {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 1.5rem 0;
}

.estadisticas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 12px;
  border: 2px solid;
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-4px);
}

.stat-asistencias {
  background: linear-gradient(135deg, rgba(121, 201, 158, 0.1) 0%, rgba(121, 201, 158, 0.05) 100%);
  border-color: #79C99E;
}

.stat-inasistencias {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
  border-color: #FF6B6B;
}

.stat-porcentaje {
  background: linear-gradient(135deg, rgba(75, 0, 130, 0.1) 0%, rgba(75, 0, 130, 0.05) 100%);
  border-color: #4B0082;
}

.stat-icon {
  width: clamp(2.5rem, 5vw, 3.5rem);
  height: clamp(2.5rem, 5vw, 3.5rem);
  flex-shrink: 0;
}

.stat-asistencias .stat-icon {
  color: #79C99E;
}

.stat-inasistencias .stat-icon {
  color: #FF6B6B;
}

.stat-porcentaje .stat-icon {
  color: #4B0082;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-numero {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1;
}

.stat-asistencias .stat-numero {
  color: #79C99E;
}

.stat-inasistencias .stat-numero {
  color: #FF6B6B;
}

.stat-porcentaje .stat-numero {
  color: #4B0082;
}

.stat-label {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: #5a5a5a;
  font-weight: 600;
}

/* Tabla */
.tabla-card {
  background: white;
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tabla-titulo {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 1.5rem 0;
}

.tabla-container {
  overflow-x: auto;
}

.tabla-asistencias {
  width: 100%;
  border-collapse: collapse;
}

.tabla-asistencias thead tr {
  background: linear-gradient(135deg, #79C99E 0%, #4B0082 100%);
}

.tabla-asistencias th {
  padding: clamp(0.875rem, 2vw, 1.25rem);
  text-align: left;
  font-weight: 700;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: white;
  white-space: nowrap;
}

.tabla-asistencias td {
  padding: clamp(0.875rem, 2vw, 1.25rem);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: #333;
  border-bottom: 1px solid #e8f5ed;
}

.tabla-asistencias tbody tr {
  transition: background-color 0.2s ease;
}

.tabla-asistencias tbody tr:hover {
  background-color: #f8fffe;
}

.fila-inasistencia {
  background-color: rgba(255, 107, 107, 0.05);
}

.columna-fecha {
  font-weight: 600;
}

.columna-dia {
  text-transform: capitalize;
}

.columna-proyecto {
  font-weight: 600;
  color: #4B0082;
}

.badge-estado {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: clamp(0.8125rem, 1.5vw, 0.9375rem);
  white-space: nowrap;
}

.badge-asistio {
  background: #79C99E;
  color: white;
}

.badge-falta {
  background: #FF6B6B;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-volver,
  .btn-exportar {
    width: 100%;
    justify-content: center;
  }

  .estadisticas {
    grid-template-columns: 1fr;
  }

  .tabla-container {
    border-radius: 8px;
  }

  .tabla-asistencias {
    font-size: 0.875rem;
  }

  .tabla-asistencias th,
  .tabla-asistencias td {
    padding: 0.625rem;
  }
}
</style>
