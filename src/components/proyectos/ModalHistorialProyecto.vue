<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="cerrar">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-content">
              <svg class="icon-historial" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <div>
                <h2 class="modal-titulo">Historial de Cambios</h2>
                <p class="modal-subtitulo">{{ nombreProyecto }}</p>
              </div>
            </div>
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
            <!-- Sin Historial -->
            <div v-if="historial.length === 0" class="estado-vacio">
              <svg class="icon-vacio" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              <h3>Sin cambios registrados</h3>
              <p>Aún no se han realizado modificaciones a este proyecto.</p>
            </div>

            <!-- Timeline de Historial -->
            <div v-else class="timeline">
              <div 
                v-for="(registro, index) in historial" 
                :key="registro.id"
                class="timeline-item"
              >
                <!-- Línea vertical -->
                <div class="timeline-line" v-if="index < historial.length - 1"></div>
                
                <!-- Punto -->
                <div class="timeline-dot"></div>

                <!-- Contenido -->
                <div class="timeline-content">
                  <!-- Info del registro -->
                  <div class="registro-header">
                    <div class="registro-info">
                      <svg class="icon-usuario" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                      <span class="registro-usuario">{{ registro.usuario }}</span>
                    </div>
                    <span class="registro-fecha">{{ registro.fecha }}</span>
                  </div>

                  <!-- Cambios -->
                  <div class="cambios-lista">
                    <div 
                      v-for="(cambio, idx) in registro.cambios" 
                      :key="idx"
                      class="cambio-item"
                    >
                      <div class="cambio-campo">{{ cambio.campo }}</div>
                      <div class="cambio-valores">
                        <div class="valor-anterior">
                          <span class="valor-label">Anterior:</span>
                          <span class="valor-texto">{{ formatearValor(cambio.valorAnterior) }}</span>
                        </div>
                        <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <div class="valor-nuevo">
                          <span class="valor-label">Nuevo:</span>
                          <span class="valor-texto">{{ formatearValor(cambio.valorNuevo) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer" v-if="historial.length > 0">
            <button
              type="button"
              class="btn-limpiar"
              @click="limpiarHistorial"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Limpiar Historial
            </button>
            <button
              type="button"
              class="btn-cerrar-footer"
              @click="cerrar"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { HistorialProyectosService } from '../../services/historialProyectos.service';
import type { RegistroHistorial } from '../../services/historialProyectos.service';

// Props
const props = defineProps<{
  modelValue: boolean;
  idProyecto: string | null;
  nombreProyecto: string;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// Estado
const historial = ref<RegistroHistorial[]>([]);

// Watch para cargar historial cuando se abre el modal
watch(
  () => [props.modelValue, props.idProyecto],
  ([visible, id]) => {
    if (visible && id && typeof id === 'string') {
      cargarHistorial(id);
    }
  },
  { immediate: true }
);

/**
 * Carga el historial del proyecto
 */
const cargarHistorial = (idProyecto: string) => {
  historial.value = HistorialProyectosService.obtenerHistorialProyecto(idProyecto);
};

/**
 * Formatea un valor para mostrarlo de manera legible
 */
const formatearValor = (valor: any): string => {
  if (valor === null || valor === undefined) {
    return 'Sin definir';
  }
  
  if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/)) {
    // Es una fecha, formatearla
    const fecha = new Date(valor);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return String(valor);
};

/**
 * Limpia el historial del proyecto
 */
const limpiarHistorial = () => {
  if (!props.idProyecto) return;

  if (confirm('¿Estás seguro de que deseas eliminar todo el historial de cambios? Esta acción no se puede deshacer.')) {
    HistorialProyectosService.limpiarHistorialProyecto(props.idProyecto);
    historial.value = [];
  }
};

/**
 * Cierra el modal
 */
const cerrar = () => {
  emit('update:modelValue', false);
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  background: linear-gradient(135deg, #79C99E 0%, #6ab88c 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-historial {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.modal-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.modal-subtitulo {
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
}

.btn-cerrar {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  border-radius: 6px;
}

.btn-cerrar:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-cerrar svg {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Estado Vacío */
.estado-vacio {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
}

.icon-vacio {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.estado-vacio h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.estado-vacio p {
  margin: 0;
  font-size: 0.875rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-line {
  position: absolute;
  left: -1.5rem;
  top: 1.5rem;
  bottom: -2rem;
  width: 2px;
  background: #e5e7eb;
}

.timeline-dot {
  position: absolute;
  left: -1.75rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #79C99E;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #79C99E;
}

.timeline-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

/* Registro Header */
.registro-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.registro-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-usuario {
  width: 20px;
  height: 20px;
  color: #79C99E;
}

.registro-usuario {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.registro-fecha {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Cambios */
.cambios-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cambio-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
}

.cambio-campo {
  font-weight: 600;
  color: #79C99E;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.cambio-valores {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.icon-arrow {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

.valor-anterior,
.valor-nuevo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.valor-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.valor-texto {
  color: #374151;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
  word-break: break-word;
}

.valor-anterior .valor-texto {
  background: #fee2e2;
  color: #991b1b;
}

.valor-nuevo .valor-texto {
  background: #d1fae5;
  color: #065f46;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-limpiar,
.btn-cerrar-footer {
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

.btn-limpiar {
  background: white;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-limpiar:hover {
  background: #fee2e2;
}

.btn-limpiar svg {
  width: 16px;
  height: 16px;
}

.btn-cerrar-footer {
  background: #79C99E;
  color: white;
}

.btn-cerrar-footer:hover {
  background: #6ab88c;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

  .timeline {
    padding-left: 1.5rem;
  }

  .cambio-valores {
    flex-direction: column;
    align-items: stretch;
  }

  .icon-arrow {
    transform: rotate(90deg);
  }
}
</style>
