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
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { proyectosEjemplo } from '../../services/proyectos.mock';

const router = useRouter();
const route = useRoute();

// Estado
const proyectos = ref(proyectosEjemplo);
const proyectoSeleccionado = ref('');
const fechaSeleccionada = ref('');

// Fechas de ejemplo
const fechasProgramadas = ref([
  '2023-10-26',
  '2023-10-28',
  '2023-11-02'
]);

// Voluntarios de ejemplo
const voluntarios = ref([
  {
    id: '1',
    nombre: 'Jane Doe',
    estado: 'presente',
    observaciones: ''
  },
  {
    id: '2',
    nombre: 'John Smith',
    estado: 'ausente',
    observaciones: 'Called in sick'
  },
  {
    id: '3',
    nombre: 'Samantha Lee',
    estado: 'presente',
    observaciones: ''
  }
]);

// Computed
const nombreProyectoActual = computed(() => {
  const proyecto = proyectos.value.find(p => p.id === proyectoSeleccionado.value);
  return proyecto ? proyecto.nombre : '';
});

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
  // TODO: Implementar guardado en Supabase
  alert('Asistencia guardada correctamente');
  console.log('Asistencia:', voluntarios.value);
};

// Si viene un ID de proyecto en la URL, pre-seleccionarlo
if (route.params.id) {
  proyectoSeleccionado.value = route.params.id as string;
}
</script>

<style scoped>
.asistencia-view {
  background: #F7F5F0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

.btn-ver-horas {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
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
  width: 1.125rem;
  height: 1.125rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subtitulo {
  font-size: 1rem;
  color: #5a5a5a;
  margin: 0;
}

/* Panel de selección */
.panel-seleccion {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: start;
}

.seccion-izquierda {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.seccion-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4B0082;
  margin: 0 0 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2E2E2E;
  margin-bottom: 0.5rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
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
  gap: 0.75rem;
}

.btn-fecha {
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
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
  padding: 3rem;
  color: #9ca3af;
}

.icon-info {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.mensaje-vacio p {
  font-size: 1rem;
  color: #6b7280;
}

.panel-asistencia {
  width: 100%;
}

.asistencia-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.asistencia-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4B0082;
  margin: 0 0 0.5rem;
}

.asistencia-fecha {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

/* Tabla de asistencia */
.tabla-container {
  padding: 1.5rem 2rem;
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
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-asistencia tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.tabla-asistencia td {
  padding: 1.25rem 1.5rem;
}

.celda-nombre {
  font-size: 1rem;
  font-weight: 600;
  color: #2E2E2E;
  min-width: 200px;
}

.celda-estado {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  min-width: 250px;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: #79C99E;
}

.radio-label {
  font-size: 0.95rem;
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
  min-width: 250px;
}

.input-observaciones {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #2E2E2E;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
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
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #e5e7eb;
}

.btn-secundario,
.btn-primario {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
@media (max-width: 1024px) {
  .panel-seleccion {
    grid-template-columns: 1fr;
  }

  .seccion-izquierda {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-left {
    flex: 1;
    min-width: 100%;
  }

  .btn-ver-horas {
    width: 100%;
    justify-content: center;
  }

  .container {
    padding: 1rem;
  }

  .view-title {
    font-size: 1.25rem;
  }

  .tabla-container {
    overflow-x: auto;
  }

  .tabla-asistencia {
    min-width: 700px;
  }

  .acciones-footer {
    flex-direction: column;
  }

  .btn-secundario,
  .btn-primario {
    width: 100%;
  }
}
</style>
