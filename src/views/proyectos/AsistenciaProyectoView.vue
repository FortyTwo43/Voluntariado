<template>
  <div class="asistencia-view">
    <!-- Contenedor principal -->
    <div class="container">
      <div class="page-header">
        <div class="header-left">
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
          <div>
            <h1 class="view-title">Asistencia de Voluntarios</h1>
            <p class="subtitulo">Registra y gestiona la asistencia de voluntarios para tus proyectos.</p>
          </div>
        </div>
        
        <button 
          type="button" 
          class="btn-ver-horas"
          @click="irAHoras"
        >
          <svg class="icon-clock" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          Ver Registro de Horas
        </button>
      </div>

      <!-- Panel de selección -->
      <div class="panel-seleccion">
        <div class="seccion-izquierda">
          <h2 class="seccion-titulo">Seleccionar Proyecto y Horario</h2>
          
          <!-- Selector de Proyecto -->
          <div class="form-group">
            <label class="form-label">Proyecto</label>
            <select v-model="proyectoSeleccionado" class="form-select">
              <option value="">Selecciona un proyecto</option>
              <option 
                v-for="proyecto in proyectos" 
                :key="proyecto.id"
                :value="proyecto.id"
              >
                {{ proyecto.nombre }}
              </option>
            </select>
          </div>

          <!-- Fechas programadas -->
          <div v-if="proyectoSeleccionado" class="form-group">
            <label class="form-label">Días Programados</label>
            <div class="lista-fechas">
              <button
                v-for="(fecha, index) in fechasProgramadas"
                :key="index"
                :class="['btn-fecha', { 'activo': fechaSeleccionada === fecha }]"
                @click="seleccionarFecha(fecha)"
              >
                {{ formatearFechaCompleta(fecha) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de asistencia -->
        <div class="seccion-derecha">
          <div v-if="!proyectoSeleccionado || !fechaSeleccionada" class="mensaje-vacio">
            <svg class="icon-info" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <p>Selecciona un proyecto y una fecha para ver la asistencia</p>
          </div>

          <div v-else class="panel-asistencia">
            <div class="asistencia-header">
              <h3 class="asistencia-titulo">
                Asistencia de Voluntarios para {{ nombreProyectoActual }}
              </h3>
              <p class="asistencia-fecha">{{ formatearFechaCompleta(fechaSeleccionada) }}</p>
            </div>

            <!-- Tabla de asistencia -->
            <div class="tabla-container">
              <table class="tabla-asistencia">
                <thead>
                  <tr>
                    <th>Nombre del Voluntario</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="voluntario in voluntarios" 
                    :key="voluntario.id"
                    class="fila-voluntario"
                  >
                    <!-- Nombre -->
                    <td class="celda-nombre">{{ voluntario.nombre }}</td>

                    <!-- Estado (Radio buttons) -->
                    <td class="celda-estado">
                      <label class="radio-group">
                        <input 
                          type="radio" 
                          :name="`estado-${voluntario.id}`"
                          :value="'presente'"
                          v-model="voluntario.estado"
                          class="radio-input"
                        />
                        <span class="radio-label presente">Presente</span>
                      </label>
                      <label class="radio-group">
                        <input 
                          type="radio" 
                          :name="`estado-${voluntario.id}`"
                          :value="'ausente'"
                          v-model="voluntario.estado"
                          class="radio-input"
                        />
                        <span class="radio-label ausente">Ausente</span>
                      </label>
                    </td>

                    <!-- Observaciones -->
                    <td class="celda-observaciones">
                      <input 
                        type="text" 
                        v-model="voluntario.observaciones"
                        placeholder="Agregar observación..."
                        class="input-observaciones"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Botones de acción -->
            <div class="acciones-footer">
              <button 
                class="btn-secundario"
                @click="cancelar"
              >
                Cancelar
              </button>
              <button 
                class="btn-primario"
                @click="guardarAsistencia"
              >
                Guardar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Proyecto } from '../../types/proyecto';
import { ProyectosService } from '../../services/proyectos.service';
import { HorariosService } from '../../services/horarios.service';
import { HorasService } from '../../services/horas.service';
import { InscripcionesService } from '../../services/inscripciones.service';
import { VoluntariosService, type VoluntarioMin } from '../../services/voluntarios.service';
import { AsistenciasService } from '../../services/asistencias.service';
import type { IHora } from '../../types/IHora';

const router = useRouter();
const route = useRoute();

// Estado
const proyectos = ref<Proyecto[]>([]);
const proyectoSeleccionado = ref('');
const fechaSeleccionada = ref('');

// Fechas programadas calculadas a partir de horas
const fechasProgramadas = ref<string[]>([]);

// Mapa de día -> lista de horas
const horasPorDia = ref<Record<string, IHora[]>>({});

// ID de la hora seleccionada (según fecha)
const idHoraSeleccionada = ref<string>('');

// Voluntarios cargados para la fecha seleccionada
const voluntarios = ref<Array<{ id: string; nombre: string; estado: 'presente'|'ausente'; observaciones: string }>>([]);

// Computed
const nombreProyectoActual = computed(() => {
  const proyecto = proyectos.value.find(p => p.id === proyectoSeleccionado.value);
  return proyecto ? proyecto.nombre : '';
});

const proyectoActual = computed(() => proyectos.value.find(p => p.id === proyectoSeleccionado.value) || null);

/**
 * Vuelve a la lista de proyectos
 */
const volver = () => {
  router.push({ name: 'proyectos' });
};

/**
 * Navega a la vista de registro de horas
 */
const irAHoras = () => {
  router.push({ name: 'proyectos-horas' });
};

/**
 * Selecciona una fecha
 */
const seleccionarFecha = (fecha: string) => {
  fechaSeleccionada.value = fecha;
};

/**
 * Formatea una fecha completa
 */
const formatearFechaCompleta = (fecha: string): string => {
  if (!fecha) return '-';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return fecha;
  }
};

/**
 * Cancela la edición
 */
const cancelar = () => {
  router.push({ name: 'proyectos' });
};

/**
 * Guarda la asistencia
 */
const guardarAsistencia = () => {
  if (!idHoraSeleccionada.value) {
    alert('No hay una hora configurada para la fecha seleccionada');
    return;
  }
  const lote = voluntarios.value.map(v => ({
    id_hora: idHoraSeleccionada.value,
    id_voluntario: v.id,
    presencia: v.estado === 'presente',
    actividad_realizada: v.observaciones || undefined,
  }));
  AsistenciasService.guardarAsistencias(lote)
    .then(() => alert('Asistencia guardada correctamente'))
    .catch((e) => {
      console.error('Error guardando asistencia', e);
      alert('No se pudo guardar la asistencia');
    });
};

// Si viene un ID de proyecto en la URL, pre-seleccionarlo
if (route.params.id) {
  proyectoSeleccionado.value = route.params.id as string;
}

// Cargar proyectos reales para el selector
const getLoggedOrganizationId = (): string | null => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user?.rol === 'organizacion') {
      return user.id || user.id_organizacion || null;
    }
    return null;
  } catch {
    return null;
  }
};

onMounted(async () => {
  try {
    const orgId = getLoggedOrganizationId();
    if (!orgId) {
      console.warn('Vista de asistencia: usuario no es organización o no ha iniciado sesión');
      proyectos.value = [];
      return;
    }
    proyectos.value = await ProyectosService.obtenerProyectosDeOrganizacion(orgId);
  } catch (e) {
    console.error('No se pudieron cargar proyectos para asistencia:', e);
  }
});

// Helpers
const dateToDiaSemana = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  return dias[date.getDay()] || '';
};

const generarFechasPorDias = (inicio: string, fin: string, diasSemana: Set<string>, maxResultados = 30): string[] => {
  const res: string[] = [];
  const start = new Date(inicio + 'T00:00:00');
  const end = new Date(fin + 'T00:00:00');
  const cursor = new Date(start);
  while (cursor <= end && res.length < maxResultados) {
    const diaNombre = dateToDiaSemana(cursor.toISOString().slice(0,10));
    if (diasSemana.has(diaNombre)) {
      res.push(cursor.toISOString().slice(0,10));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return res;
};

// Reacciones a cambios de proyecto / fecha
watch(proyectoSeleccionado, async (nuevo) => {
  fechaSeleccionada.value = '';
  idHoraSeleccionada.value = '';
  fechasProgramadas.value = [];
  horasPorDia.value = {};

  const proyecto = proyectos.value.find(p => p.id === nuevo);
  if (!proyecto) return;

  try {
    const horarios = await HorariosService.obtenerHorariosPorProyecto(proyecto.id);
    const idsHorarios = horarios.map(h => h.id_horario);
    const horas = await HorasService.obtenerHorasPorHorarios(idsHorarios);
    const mapa: Record<string, IHora[]> = {};
    for (const h of horas) {
      const arr = mapa[h.dia] ?? (mapa[h.dia] = []);
      arr.push(h);
    }
    horasPorDia.value = mapa;
    const diasSemana = new Set(Object.keys(mapa));
    fechasProgramadas.value = generarFechasPorDias(proyecto.fecha_inicio, proyecto.fecha_fin, diasSemana);
    if (fechasProgramadas.value.length > 0) {
      fechaSeleccionada.value = (fechasProgramadas.value[0] as string);
    }
  } catch (e) {
    console.error('Error cargando horarios/horas del proyecto', e);
  }
});

watch(fechaSeleccionada, async (nueva) => {
  voluntarios.value = [];
  idHoraSeleccionada.value = '';
  const proyecto = proyectoActual.value;
  if (!nueva || !proyecto) return;
  const dia = dateToDiaSemana(nueva);
  const horasDia = horasPorDia.value[dia] || [];
  if (horasDia.length === 0) return;
  // Seleccionar la primera hora del día por ahora
  idHoraSeleccionada.value = (horasDia[0]!.id_hora);

  try {
    const inscripciones = await InscripcionesService.obtenerInscripcionesPorProyecto(proyecto.id);
    const idsVol = inscripciones.map(i => i.id_voluntario);
    const infoVoluntarios = await VoluntariosService.obtenerVoluntariosPorIds(idsVol);
    const asistencias = await AsistenciasService.obtenerAsistencias(idHoraSeleccionada.value, idsVol);
    const asistenciaPorVol = new Map(asistencias.map(a => [a.id_voluntario, a]));
    voluntarios.value = infoVoluntarios.map((v: VoluntarioMin) => {
      const a = asistenciaPorVol.get(v.id);
      const nombre = [v.nombre, v.apellido].filter(Boolean).join(' ');
      return {
        id: v.id,
        nombre: nombre || v.nombre,
        estado: a?.presencia ? 'presente' : 'ausente',
        observaciones: a?.actividad_realizada || ''
      };
    });
  } catch (e) {
    console.error('Error cargando voluntarios/asistencias', e);
  }
});
</script>

<style scoped>
.asistencia-view {
  background: #F7F5F0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2rem);
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  gap: clamp(1rem, 2vw, 1.5rem);
}

.header-left {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  flex-wrap: wrap;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.65rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.25rem);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
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
  white-space: nowrap;
}

.btn-volver:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.btn-ver-horas {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.65rem, 1.5vw, 0.75rem) clamp(1.25rem, 2vw, 1.5rem);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 700;
  color: #ffffff;
  background: #4B0082;
  border: 2px solid #4B0082;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-ver-horas:hover {
  background: #3a0066;
  border-color: #3a0066;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.3);
}

.icon-arrow-left,
.icon-clock {
  width: clamp(0.95rem, 2vw, 1.125rem);
  height: clamp(0.95rem, 2vw, 1.125rem);
}

.view-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 clamp(0.25rem, 0.5vw, 0.5rem);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subtitulo {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #5a5a5a;
  margin: 0;
}

/* Panel de selección */
.panel-seleccion {
  display: grid;
  grid-template-columns: clamp(280px, 30vw, 350px) 1fr;
  gap: clamp(1.5rem, 3vw, 2rem);
  align-items: start;
}

.seccion-izquierda {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.seccion-titulo {
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: #4B0082;
  margin: 0 0 clamp(1rem, 2vw, 1.5rem);
}

.form-group {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
}

.form-label {
  display: block;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 600;
  color: #2E2E2E;
  margin-bottom: clamp(0.375rem, 0.5vw, 0.5rem);
}

.form-select {
  width: 100%;
  padding: clamp(0.6rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: #2E2E2E;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.lista-fechas {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.btn-fecha {
  padding: clamp(0.7rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 600;
  color: #2E2E2E;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.btn-fecha:hover {
  border-color: #79C99E;
  background: #f9fafb;
}

.btn-fecha.activo {
  background: #4B0082;
  color: white;
  border-color: #4B0082;
}

/* Sección derecha */
.seccion-derecha {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mensaje-vacio {
  text-align: center;
  padding: clamp(2rem, 5vw, 3rem);
  color: #9ca3af;
}

.icon-info {
  width: clamp(2.5rem, 8vw, 4rem);
  height: clamp(2.5rem, 8vw, 4rem);
  margin: 0 auto clamp(0.75rem, 1.5vw, 1rem);
}

.mensaje-vacio p {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: #6b7280;
  margin: 0;
}

.panel-asistencia {
  width: 100%;
}

.asistencia-header {
  padding: clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2rem) clamp(1rem, 2vw, 1.5rem);
  border-bottom: 2px solid #e5e7eb;
}

.asistencia-titulo {
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: #4B0082;
  margin: 0 0 clamp(0.25rem, 0.5vw, 0.5rem);
}

.asistencia-fecha {
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: #6b7280;
  margin: 0;
}

/* Tabla de asistencia */
.tabla-container {
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2rem);
  overflow-x: auto;
}

.tabla-asistencia {
  width: 100%;
  border-collapse: collapse;
}

.tabla-asistencia thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.tabla-asistencia th {
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 1.5vw, 1.5rem);
  text-align: left;
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-asistencia tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.tabla-asistencia td {
  padding: clamp(1rem, 1.5vw, 1.25rem) clamp(1rem, 1.5vw, 1.5rem);
}

.celda-nombre {
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  font-weight: 600;
  color: #2E2E2E;
  min-width: 150px;
}

.celda-estado {
  display: flex;
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: center;
  min-width: 200px;
  flex-wrap: wrap;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: clamp(0.375rem, 0.5vw, 0.5rem);
  cursor: pointer;
  white-space: nowrap;
}

.radio-input {
  width: clamp(1rem, 1.5vw, 1.125rem);
  height: clamp(1rem, 1.5vw, 1.125rem);
  cursor: pointer;
  accent-color: #79C99E;
}

.radio-label {
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 600;
  cursor: pointer;
}

.radio-label.presente {
  color: #065f46;
}

.radio-label.ausente {
  color: #991b1b;
}

.celda-observaciones {
  min-width: 150px;
}

.input-observaciones {
  width: 100%;
  padding: clamp(0.6rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  color: #2E2E2E;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-observaciones:focus {
  outline: none;
  border-color: #79C99E;
  background: white;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.input-observaciones::placeholder {
  color: #9ca3af;
}

/* Footer de acciones */
.acciones-footer {
  display: flex;
  justify-content: flex-end;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2rem);
  border-top: 2px solid #e5e7eb;
  flex-wrap: wrap;
}

.btn-secundario,
.btn-primario {
  padding: clamp(0.7rem, 1.5vw, 0.875rem) clamp(1.25rem, 2vw, 1.75rem);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.btn-secundario {
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
}

.btn-secundario:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primario {
  color: white;
  background: #79C99E;
  border: 2px solid #79C99E;
}

.btn-primario:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .btn-ver-horas {
    align-self: flex-end;
  }
}

@media (max-width: 1024px) {
  .panel-seleccion {
    grid-template-columns: 1fr;
  }

  .seccion-izquierda {
    max-width: 100%;
  }

  .tabla-asistencia {
    min-width: 600px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: clamp(0.75rem, 3vw, 1rem);
  }

  .page-header {
    padding: clamp(1rem, 2vw, 1.5rem);
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-left {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-volver {
    width: 100%;
    justify-content: center;
  }

  .view-title {
    font-size: 1.25rem;
  }

  .btn-ver-horas {
    width: 100%;
    justify-content: center;
    align-self: auto;
  }

  .panel-seleccion {
    gap: 1.5rem;
  }

  .seccion-izquierda {
    padding: 1.25rem;
  }

  .seccion-derecha {
    min-height: 300px;
  }

  .tabla-container {
    overflow-x: auto;
    padding: 1rem;
  }

  .tabla-asistencia {
    min-width: 500px;
    font-size: 0.85rem;
  }

  .tabla-asistencia th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
  }

  .tabla-asistencia td {
    padding: 0.875rem 1rem;
  }

  .celda-nombre {
    min-width: 120px;
    font-size: 0.9rem;
  }

  .celda-estado {
    gap: 0.75rem;
    min-width: 150px;
  }

  .radio-group {
    gap: 0.375rem;
  }

  .radio-label {
    font-size: 0.85rem;
  }

  .celda-observaciones {
    min-width: 120px;
  }

  .input-observaciones {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  .acciones-footer {
    flex-direction: column;
    padding: 1rem;
  }

  .btn-secundario,
  .btn-primario {
    width: 100%;
  }

  .asistencia-header {
    padding: 1.25rem 1rem 1rem;
  }

  .asistencia-titulo {
    font-size: 1.125rem;
  }

  .asistencia-fecha {
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0.75rem;
  }

  .page-header {
    padding: 1rem;
    gap: 0.75rem;
  }

  .btn-volver,
  .btn-ver-horas {
    padding: 0.6rem 0.875rem;
    font-size: 0.8rem;
  }

  .view-title {
    font-size: 1.125rem;
  }

  .subtitulo {
    font-size: 0.8rem;
  }

  .panel-seleccion {
    gap: 1rem;
  }

  .seccion-izquierda {
    padding: 1rem;
  }

  .seccion-titulo {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  .btn-fecha {
    font-size: 0.8rem;
    padding: 0.65rem 0.75rem;
  }

  .tabla-container {
    padding: 0.875rem;
  }

  .tabla-asistencia {
    min-width: 400px;
    font-size: 0.75rem;
  }

  .tabla-asistencia th {
    padding: 0.6rem 0.75rem;
    font-size: 0.65rem;
  }

  .tabla-asistencia td {
    padding: 0.75rem 0.75rem;
  }

  .celda-nombre {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .celda-estado {
    gap: 0.5rem;
    min-width: 120px;
    flex-direction: column;
    align-items: flex-start;
  }

  .radio-group {
    width: 100%;
    justify-content: space-between;
  }

  .radio-label {
    font-size: 0.75rem;
  }

  .input-observaciones {
    font-size: 0.75rem;
    padding: 0.5rem;
  }

  .acciones-footer {
    padding: 0.875rem;
    gap: 0.5rem;
  }

  .btn-secundario,
  .btn-primario {
    font-size: 0.75rem;
    padding: 0.6rem 0.75rem;
  }

  .mensaje-vacio {
    padding: 2rem 1rem;
  }

  .icon-info {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .mensaje-vacio p {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }

  .page-header {
    padding: 0.75rem;
    gap: 0.5rem;
    flex-direction: column;
  }

  .header-left {
    gap: 0.5rem;
    width: 100%;
  }

  .btn-volver {
    font-size: 0.7rem;
    padding: 0.5rem 0.75rem;
  }

  .view-title {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .subtitulo {
    font-size: 0.7rem;
  }

  .btn-ver-horas {
    font-size: 0.7rem;
    padding: 0.5rem 0.75rem;
    width: 100%;
  }

  .panel-seleccion {
    gap: 0.75rem;
  }

  .seccion-izquierda {
    padding: 0.875rem;
  }

  .seccion-titulo {
    font-size: 0.95rem;
    margin-bottom: 0.875rem;
  }

  .form-group {
    margin-bottom: 0.875rem;
  }

  .form-label {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .form-select {
    font-size: 0.75rem;
    padding: 0.45rem 0.6rem;
  }

  .lista-fechas {
    gap: 0.4rem;
  }

  .btn-fecha {
    font-size: 0.75rem;
    padding: 0.6rem 0.7rem;
  }

  .seccion-derecha {
    min-height: 250px;
  }

  .tabla-container {
    padding: 0.75rem;
  }

  .tabla-asistencia {
    min-width: 100%;
    font-size: 0.7rem;
  }

  .tabla-asistencia th {
    padding: 0.5rem 0.6rem;
    font-size: 0.6rem;
  }

  .tabla-asistencia td {
    padding: 0.6rem 0.6rem;
  }

  .celda-nombre {
    min-width: 80px;
    font-size: 0.75rem;
  }

  .celda-estado {
    gap: 0.375rem;
    min-width: 100px;
  }

  .radio-input {
    width: 0.95rem;
    height: 0.95rem;
  }

  .radio-label {
    font-size: 0.7rem;
  }

  .input-observaciones {
    font-size: 0.7rem;
    padding: 0.4rem;
  }

  .acciones-footer {
    padding: 0.75rem;
    gap: 0.375rem;
  }

  .btn-secundario,
  .btn-primario {
    font-size: 0.7rem;
    padding: 0.5rem 0.6rem;
  }

  .asistencia-header {
    padding: 1rem 0.75rem 0.75rem;
  }

  .asistencia-titulo {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .asistencia-fecha {
    font-size: 0.75rem;
  }
}
</style>
