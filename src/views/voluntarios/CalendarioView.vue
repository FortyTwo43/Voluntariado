<template>
  <div class="calendario-view">
    <div class="container">
      <div class="page-header">
        <h1 class="view-title">Mi Calendario Semanal</h1>
        <p class="view-subtitle">Organiza tus actividades de voluntariado</p>
      </div>

      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando calendario...</p>
      </div>

      <div v-else-if="error" class="estado-error">
        <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Error al cargar calendario</h3>
        <p>{{ error }}</p>
      </div>

      <CalendarioSemanal v-else :actividades="actividades" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CalendarioSemanal from '@/components/calendario/CalendarioSemanal.vue';
import InscripcionesService from '@/services/inscripciones.service';
import ProyectosService from '@/services/proyectos.service';
import HorariosService from '@/services/horarios.service';
import HorasService from '@/services/horas.service';
import type { ActividadCalendario } from '@/types/calendario';

const cargando = ref(true);
const error = ref('');
const actividades = ref<ActividadCalendario[]>([]);

const cargarCalendario = async () => {
  try {
    cargando.value = true;
    error.value = '';

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }

    const user = JSON.parse(userStr);
    const idVoluntario = user.id;

    // Obtener inscripciones activas
    const inscripciones = await InscripcionesService.obtenerInscripcionesPorVoluntario(idVoluntario);
    const inscripcionesActivas = inscripciones.filter(ins => ins.estado === 'activa');

    if (inscripcionesActivas.length === 0) {
      actividades.value = [];
      return;
    }

    // Obtener proyectos y sus horarios
    const actividadesTemp: ActividadCalendario[] = [];

    for (const inscripcion of inscripcionesActivas) {
      try {
        const proyecto = await ProyectosService.obtenerProyectoPorId(inscripcion.id_proyecto);
        const horarios = await HorariosService.obtenerHorariosPorProyecto(inscripcion.id_proyecto);

        for (const horario of horarios) {
          const horas = await HorasService.obtenerHorasPorHorario(horario.id_horario);

          for (const hora of horas) {
            // Mapear el nombre del día (español) a número de semana (0=Dom,1=Lun,...6=Sáb)
            const diaNombre = (hora.dia || '').toString().toLowerCase();
            const mapaDias: Record<string, number> = {
              'domingo': 0,
              'dom': 0,
              'domingo.': 0,
              'lunes': 1,
              'lun': 1,
              'martes': 2,
              'mar': 2,
              'miercoles': 3,
              'miércoles': 3,
              'mié': 3,
              'jueves': 4,
              'jue': 4,
              'viernes': 5,
              'vie': 5,
              'sabado': 6,
              'sábado': 6,
              'sab': 6
            };

            const diaNumero = mapaDias[diaNombre] ?? (() => {
              // si no coincide, fallback a domingo (0)
              return 0;
            })();

            actividadesTemp.push({
              idProyecto: proyecto.id,
              nombreProyecto: proyecto.nombre,
              dia: diaNumero,
              horaInicio: hora.hora_inicio,
              horaFin: hora.hora_fin,
              hora
            });
          }
        }
      } catch (err) {
        console.error(`Error cargando proyecto ${inscripcion.id_proyecto}:`, err);
      }
    }

    actividades.value = actividadesTemp;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarCalendario();
});
</script>

<style scoped>
.calendario-view {
  min-height: 100vh;
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

@media (max-width: 768px) {
  .calendario-view {
    padding: 1rem 0.5rem;
  }

  .view-title {
    font-size: 2rem;
  }

  .view-subtitle {
    font-size: 1rem;
  }
}
</style>
