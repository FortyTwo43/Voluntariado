<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="cerrar">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-titulo">Editar Proyecto</h2>
            <button 
              class="btn-cerrar"
              @click="cerrar"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <form @submit.prevent="guardarCambios" class="form-edicion">
              <!-- Nombre del Proyecto -->
              <div class="form-group">
                <label for="nombre" class="form-label">
                  Nombre del Proyecto
                  <span class="required">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="formulario.nombre"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Limpieza de playa"
                  required
                />
              </div>

              <!-- Descripción -->
              <div class="form-group">
                <label for="descripcion" class="form-label">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  v-model="formulario.descripcion"
                  class="form-textarea"
                  rows="4"
                  placeholder="Describe el proyecto..."
                />
              </div>

              <!-- Categoría -->
              <div class="form-group">
                <label for="categoria" class="form-label">
                  Categoría
                  <span class="required">*</span>
                </label>
                <select
                  id="categoria"
                  v-model="formulario.categoria"
                  class="form-select"
                  required
                >
                  <option value="social">Social</option>
                  <option value="educativo">Educativo</option>
                  <option value="ambiental">Ambiental</option>
                </select>
              </div>

              <!-- Fechas -->
              <div class="form-row">
                <div class="form-group">
                  <label for="fecha_inicio" class="form-label">
                    Fecha de Inicio
                    <span class="required">*</span>
                  </label>
                  <input
                    id="fecha_inicio"
                    v-model="formulario.fecha_inicio"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="fecha_fin" class="form-label">
                    Fecha de Fin
                    <span class="required">*</span>
                  </label>
                  <input
                    id="fecha_fin"
                    v-model="formulario.fecha_fin"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <!-- Cupo Máximo -->
              <div class="form-group">
                <label for="cupo_maximo" class="form-label">
                  Cupo Máximo
                  <span class="required">*</span>
                </label>
                <input
                  id="cupo_maximo"
                  v-model.number="formulario.cupo_maximo"
                  type="number"
                  class="form-input"
                  min="1"
                  placeholder="Ej: 20"
                  required
                />
              </div>

              <!-- Estado -->
              <div class="form-group">
                <label for="estado" class="form-label">
                  Estado
                </label>
                <select
                  id="estado"
                  v-model="formulario.estado"
                  class="form-select"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              <!-- Mensaje de Error -->
              <div v-if="mensajeError" class="mensaje-error">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ mensajeError }}
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn-secundario"
              @click="cerrar"
              :disabled="guardando"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn-primario"
              @click="guardarCambios"
              :disabled="guardando"
            >
              <span v-if="guardando" class="spinner"></span>
              {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Proyecto } from '../../types/proyecto';
import { ProyectosService } from '../../services/proyectos.service';
import { HistorialProyectosService } from '../../services/historialProyectos.service';

// Props
const props = defineProps<{
  modelValue: boolean;
  proyecto: Proyecto | null;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'guardado': [];
}>();

// Estado
const formulario = ref({
  nombre: '',
  descripcion: '',
  categoria: 'social' as 'social' | 'educativo' | 'ambiental',
  fecha_inicio: '',
  fecha_fin: '',
  cupo_maximo: 1,
  estado: 'activo' as 'activo' | 'inactivo' | 'completado',
});

const guardando = ref(false);
const mensajeError = ref('');

// Watch para cargar datos del proyecto
watch(
  () => props.proyecto,
  (proyecto) => {
    if (proyecto) {
      formulario.value = {
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion || '',
        categoria: proyecto.categoria,
        fecha_inicio: proyecto.fecha_inicio,
        fecha_fin: proyecto.fecha_fin,
        cupo_maximo: proyecto.cupo_maximo,
        estado: proyecto.estado || 'activo',
      };
      mensajeError.value = '';
    }
  },
  { immediate: true }
);

/**
 * Cierra el modal
 */
const cerrar = () => {
  if (!guardando.value) {
    emit('update:modelValue', false);
  }
};

/**
 * Guarda los cambios del proyecto
 */
const guardarCambios = async () => {
  if (!props.proyecto) return;

  // Validaciones
  if (!formulario.value.nombre.trim()) {
    mensajeError.value = 'El nombre del proyecto es requerido';
    return;
  }

  if (new Date(formulario.value.fecha_fin) < new Date(formulario.value.fecha_inicio)) {
    mensajeError.value = 'La fecha de fin debe ser posterior a la fecha de inicio';
    return;
  }

  guardando.value = true;
  mensajeError.value = '';

  try {
    // Guardar proyecto anterior para el historial
    const proyectoAnterior = { ...props.proyecto };

    // Actualizar proyecto
    const proyectoActualizado = await ProyectosService.actualizarProyecto(
      props.proyecto.id,
      {
        nombre: formulario.value.nombre,
        descripcion: formulario.value.descripcion,
        categoria: formulario.value.categoria,
        fecha_inicio: formulario.value.fecha_inicio,
        fecha_fin: formulario.value.fecha_fin,
        cupo_maximo: formulario.value.cupo_maximo,
        id_organizacion: props.proyecto.id_organizacion,
      }
    );

    // Crear proyecto con estado actualizado para el historial
    const proyectoConEstado = {
      ...proyectoActualizado,
      estado: formulario.value.estado,
    };

    // Registrar en el historial
    HistorialProyectosService.registrarCambio(
      proyectoAnterior,
      proyectoConEstado
    );

    emit('guardado');
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    mensajeError.value = error instanceof Error 
      ? error.message 
      : 'No se pudieron guardar los cambios';
  } finally {
    guardando.value = false;
  }
};
</script>

<style scoped>
/* Overlay del Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Container del Modal */
.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-cerrar {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  border-radius: 6px;
}

.btn-cerrar:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-cerrar svg {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  padding: 1.5rem;
}

/* Formulario */
.form-edicion {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Mensaje de Error */
.mensaje-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.875rem;
}

.mensaje-error svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primario,
.btn-secundario {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primario {
  background: #79C99E;
  color: white;
}

.btn-primario:hover:not(:disabled) {
  background: #6ab88c;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secundario {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secundario:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-secundario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
