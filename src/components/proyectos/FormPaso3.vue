<template>
  <div class="form-paso">
    <h2 class="form-title">Detalles Finales y Confirmación</h2>
    
    <!-- Capacidad Máxima -->
    <div class="form-group">
      <label for="cupo-maximo" class="form-label">
        Capacidad Máxima
      </label>
      <input
        id="cupo-maximo"
        v-model.number="datosLocales.cupo_maximo"
        type="number"
        class="form-input"
        :class="{ 'input-valid': datosLocales.cupo_maximo && datosLocales.cupo_maximo > 0 }"
        placeholder="ej., 100"
        min="1"
        @input="validarFormulario"
      />
      <p class="helper-text">
        Número máximo de voluntarios que pueden participar en este proyecto.
      </p>
    </div>

    <!-- Organization ID -->
    <div class="form-group">
      <label for="id-organizacion" class="form-label">
        ID de la Organización
      </label>
      <input
        id="id-organizacion"
        v-model="datosLocales.id_organizacion"
        type="text"
        class="form-input"
        :class="{ 
          'input-valid': idOrganizacionValido,
          'input-invalid': !idOrganizacionValido && datosLocales.id_organizacion.length > 0
        }"
        placeholder="ORG-12345"
        @input="validarIdOrganizacion"
      />
      
      <!-- Validación de Organization ID -->
      <div v-if="datosLocales.id_organizacion.length > 0" class="validation-message">
        <div v-if="idOrganizacionValido" class="message-success">
          <svg class="icon-check" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>El ID de la organización es válido.</span>
        </div>
        <div v-else class="message-error">
          <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span>Por favor, ingresa un ID de organización válido.</span>
        </div>
      </div>
    </div>

    <!-- Resumen del Proyecto -->
    <div class="project-summary">
      <div class="summary-header">
        <h3 class="summary-title">Resumen del Proyecto</h3>
        <button 
          type="button" 
          class="edit-button"
          @click="$emit('editar-detalles')"
        >
          Editar Detalles
        </button>
      </div>
      
      <div class="summary-content">
        <div class="summary-item">
          <span class="summary-label">Nombre del Proyecto:</span>
          <span class="summary-value">{{ resumen.nombre }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">Categoría:</span>
          <span class="summary-value">{{ getCategoriaLabel(resumen.categoria) }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">Fecha de Inicio:</span>
          <span class="summary-value">{{ formatearFecha(resumen.fecha_inicio) }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">Fecha de Finalización:</span>
          <span class="summary-value">{{ formatearFecha(resumen.fecha_fin) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import type { CategoriaProyecto } from '../../types/proyecto';

// Props
const props = defineProps<{
  modelValue: {
    cupo_maximo: number;
    id_organizacion: string;
  };
  resumen: {
    nombre: string;
    categoria: CategoriaProyecto | '';
    fecha_inicio: string;
    fecha_fin: string;
  };
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue];
  'validacion-cambio': [esValido: boolean];
  'editar-detalles': [];
}>();

// Estado local
const datosLocales = reactive({
  cupo_maximo: props.modelValue.cupo_maximo || 0,
  id_organizacion: props.modelValue.id_organizacion || '',
});

const idOrganizacionValido = ref(false);

/**
 * Valida el formato del ID de organización
 */
const validarIdOrganizacion = () => {
  const id = datosLocales.id_organizacion.trim();
  
  if (id.length === 0) {
    idOrganizacionValido.value = false;
    validarFormulario();
    return;
  }
  
  // Validación simple: debe tener al menos 3 caracteres
  idOrganizacionValido.value = id.length >= 3;
  validarFormulario();
};

/**
 * Valida todo el formulario del paso 3
 */
const validarFormulario = () => {
  const esValido = 
    datosLocales.cupo_maximo > 0 &&
    datosLocales.id_organizacion.trim().length >= 3 &&
    idOrganizacionValido.value;
  
  emit('validacion-cambio', esValido);
};

/**
 * Obtiene el label de la categoría
 */
const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    social: 'Social',
    educativo: 'Educativo',
    ambiental: 'Environmental',
  };
  return labels[categoria] || categoria;
};

/**
 * Formatea una fecha en formato legible
 */
const formatearFecha = (fecha: string): string => {
  if (!fecha) return '-';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return fecha;
  }
};

// Sincronizar con el v-model
watch(datosLocales, (newValue) => {
  emit('update:modelValue', { ...newValue });
}, { deep: true });

// Sincronizar cuando cambia desde el padre
watch(() => props.modelValue, (newValue) => {
  datosLocales.cupo_maximo = newValue.cupo_maximo;
  datosLocales.id_organizacion = newValue.id_organizacion;
  validarIdOrganizacion();
}, { deep: true });

// Validar al montar
onMounted(() => {
  if (datosLocales.id_organizacion) {
    validarIdOrganizacion();
  }
  validarFormulario();
});
</script>

<style scoped>
.form-paso {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.35rem;
}

.form-input {
  width: 100%;
  padding: 0.6rem 0.875rem;
  font-size: 1rem;
  color: #1a1a1a;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.input-valid {
  border-color: #10b981;
}

.form-input.input-invalid {
  border-color: #ef4444;
}

.helper-text {
  margin-top: 0.35rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.validation-message {
  margin-top: 0.35rem;
  font-size: 0.875rem;
}

.message-success,
.message-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.message-success {
  color: #10b981;
}

.message-error {
  color: #ef4444;
}

.icon-check,
.icon-error {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Estilos del resumen */
.project-summary {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.edit-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background-color: #3b82f6;
  color: white;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-weight: 500;
  color: #6b7280;
}

.summary-value {
  font-weight: 600;
  color: #1a1a1a;
  text-align: right;
}
</style>
