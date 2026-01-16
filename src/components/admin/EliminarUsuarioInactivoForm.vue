<template>
  <div class="eliminar-usuario-form">
    <div class="form-header">
      <h1 class="form-title">Eliminar Usuario Inactivo de Proyecto</h1>
      <p class="form-subtitle">
        Elimina voluntarios de proyectos cuando la organización solicita su eliminación por
        inasistencia
      </p>
    </div>

    <!-- Formulario de selección -->
    <div class="form-container">
      <div class="form-group">
        <label for="proyecto" class="form-label">Seleccionar Proyecto</label>
        <select
          id="proyecto"
          v-model="proyectoSeleccionado"
          @change="cargarInscripciones"
          class="form-select"
          :disabled="cargandoProyectos"
        >
          <option value="">-- Seleccione un proyecto --</option>
          <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
            {{ proyecto.nombre }}
          </option>
        </select>
      </div>

      <!-- Estado de carga de inscripciones -->
      <div v-if="cargandoInscripciones" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando voluntarios inscritos...</p>
      </div>

      <!-- Lista de inscripciones -->
      <div v-else-if="proyectoSeleccionado && inscripciones.length > 0" class="inscripciones-container">
        <h3 class="subtitulo-seccion">Voluntarios Inscritos en el Proyecto</h3>
        <div class="tabla-container">
          <table class="tabla-inscripciones">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Fecha de Inscripción</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inscripcion in inscripciones" :key="inscripcion.id_inscripcion">
                <td>
                  <div class="info-voluntario">
                    <span class="nombre-voluntario">{{ obtenerNombreVoluntario(inscripcion.id_voluntario) }}</span>
                    <span class="id-voluntario">ID: {{ inscripcion.id_voluntario.substring(0, 8) }}...</span>
                  </div>
                </td>
                <td>{{ formatearFecha(inscripcion.fecha_inscripcion) }}</td>
                <td>
                  <span
                    :class="[
                      'badge-estado',
                      `estado-${inscripcion.estado}`,
                    ]"
                  >
                    {{ obtenerEstadoLabel(inscripcion.estado) }}
                  </span>
                </td>
                <td class="celda-accion">
                  <button
                    @click="confirmarEliminacion(inscripcion)"
                    class="btn-eliminar"
                    :disabled="procesando"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="proyectoSeleccionado && inscripciones.length === 0" class="estado-vacio">
        <p>No hay voluntarios inscritos en este proyecto</p>
      </div>

      <!-- Mensaje inicial -->
      <div v-else-if="!proyectoSeleccionado" class="mensaje-inicial">
        <p>Seleccione un proyecto para ver los voluntarios inscritos</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AdminService } from '../../services/adminService';
import { VoluntariosService } from '../../services/voluntarios.service';
import { useAlert } from '../../composables/useAlert';
import type { Proyecto } from '../../types/proyecto';
import type { IInscripcion } from '../../types/IInscripcion';

const { showSuccess, showError } = useAlert();

// Estado
const proyectos = ref<Proyecto[]>([]);
const proyectoSeleccionado = ref('');
const inscripciones = ref<IInscripcion[]>([]);
const nombresVoluntarios = ref<Record<string, string>>({});
const cargandoProyectos = ref(true);
const cargandoInscripciones = ref(false);
const procesando = ref(false);

/**
 * Carga los proyectos desde el servicio
 */
const cargarProyectos = async () => {
  cargandoProyectos.value = true;

  try {
    proyectos.value = await AdminService.obtenerTodosLosProyectos();
  } catch (err) {
    console.error('Error al cargar proyectos:', err);
    showError(
      'Error',
      err instanceof Error ? err.message : 'No se pudieron cargar los proyectos'
    );
  } finally {
    cargandoProyectos.value = false;
  }
};

/**
 * Carga las inscripciones del proyecto seleccionado
 */
const cargarInscripciones = async () => {
  if (!proyectoSeleccionado.value) {
    inscripciones.value = [];
    return;
  }

  cargandoInscripciones.value = true;
  inscripciones.value = [];

  try {
    const inscripcionesData = await AdminService.obtenerInscripcionesPorProyecto(
      proyectoSeleccionado.value
    );
    inscripciones.value = inscripcionesData;

    // Cargar nombres de voluntarios
    const idsVoluntarios = inscripcionesData.map((ins) => ins.id_voluntario);
    if (idsVoluntarios.length > 0) {
      try {
        const voluntarios = await VoluntariosService.obtenerVoluntariosPorIds(idsVoluntarios);
        voluntarios.forEach((vol) => {
          nombresVoluntarios.value[vol.id] = `${vol.nombre} ${vol.apellido || ''}`.trim();
        });
      } catch (err) {
        console.warn('Error al cargar nombres de voluntarios:', err);
      }
    }
  } catch (err) {
    console.error('Error al cargar inscripciones:', err);
    showError(
      'Error',
      err instanceof Error ? err.message : 'No se pudieron cargar las inscripciones'
    );
  } finally {
    cargandoInscripciones.value = false;
  }
};

/**
 * Obtiene el nombre de un voluntario
 */
const obtenerNombreVoluntario = (idVoluntario: string): string => {
  return nombresVoluntarios.value[idVoluntario] || `Voluntario ${idVoluntario.substring(0, 8)}`;
};

/**
 * Obtiene el label del estado
 */
const obtenerEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    activa: 'Activa',
    completada: 'Completada',
    cancelado: 'Cancelada',
  };
  return labels[estado] || estado;
};

/**
 * Formatea una fecha
 */
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return fecha;
  }
};

/**
 * Confirma y elimina una inscripción
 */
const confirmarEliminacion = (inscripcion: IInscripcion) => {
  const nombreVoluntario = obtenerNombreVoluntario(inscripcion.id_voluntario);
  const proyecto = proyectos.value.find((p) => p.id === inscripcion.id_proyecto);

  if (
    !confirm(
      `¿Estás seguro de que deseas eliminar a "${nombreVoluntario}" del proyecto "${proyecto?.nombre || 'N/A'}"?\n\nEsta acción no se puede deshacer.`
    )
  ) {
    return;
  }

  eliminarInscripcion(inscripcion.id_inscripcion);
};

/**
 * Elimina una inscripción
 */
const eliminarInscripcion = async (idInscripcion: string) => {
  procesando.value = true;

  try {
    await AdminService.eliminarInscripcion(idInscripcion);
    showSuccess('Inscripción eliminada', 'El voluntario ha sido eliminado del proyecto exitosamente');
    await cargarInscripciones();
  } catch (err) {
    console.error('Error al eliminar inscripción:', err);
    showError(
      'Error',
      err instanceof Error ? err.message : 'No se pudo eliminar la inscripción'
    );
  } finally {
    procesando.value = false;
  }
};

// Cargar proyectos al montar
onMounted(() => {
  cargarProyectos();
});
</script>

<style scoped>
.eliminar-usuario-form {
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
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-select {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.estado-carga {
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

.subtitulo-seccion {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.inscripciones-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabla-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.tabla-inscripciones {
  width: 100%;
  border-collapse: collapse;
}

.tabla-inscripciones thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.tabla-inscripciones th {
  padding: 1rem;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-inscripciones tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.tabla-inscripciones tbody tr:hover {
  background: #f9fafb;
}

.tabla-inscripciones td {
  padding: 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
}

.info-voluntario {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nombre-voluntario {
  font-weight: 600;
  color: #1f2937;
}

.id-voluntario {
  font-size: 0.75rem;
  color: #6b7280;
}

.badge-estado {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  text-align: center;
}

.estado-activa {
  background: #d1fae5;
  color: #065f46;
}

.estado-completada {
  background: #dbeafe;
  color: #1e40af;
}

.estado-cancelado {
  background: #fee2e2;
  color: #991b1b;
}

.celda-accion {
  min-width: 120px;
}

.btn-eliminar {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-eliminar:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.btn-eliminar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.estado-vacio,
.mensaje-inicial {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
}

@media (max-width: 768px) {
  .tabla-container {
    overflow-x: auto;
  }

  .tabla-inscripciones {
    min-width: 600px;
  }
}
</style>

