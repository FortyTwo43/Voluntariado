<template>
  <div class="form-paso">
    <h2 class="form-title">Detalles del Proyecto y Cronograma</h2>
    
    <!-- Descripción del Proyecto -->
    <div class="form-group">
      <label for="descripcion" class="form-label">
        Descripción del Proyecto
      </label>
      <textarea
        id="descripcion"
        v-model="datosLocales.descripcion"
        class="form-textarea"
        rows="4"
        placeholder="ej., Un huerto comunitario para cultivar productos frescos para familias locales."
      />
      <p class="helper-text">
        Describe el propósito y objetivos de tu proyecto. Sé claro y conciso.
      </p>
    </div>

    <!-- Categoría del Proyecto -->
    <div class="form-group">
      <label for="categoria" class="form-label">
        Categoría del Proyecto
      </label>
      <select
        id="categoria"
        v-model="datosLocales.categoria"
        class="form-select"
        :class="{ 'select-valid': datosLocales.categoria }"
        @change="validarFormulario"
      >
        <option value="" disabled>Selecciona una categoría</option>
        <option value="social">Social</option>
        <option value="educativo">Educativo</option>
        <option value="ambiental">Ambiental</option>
      </select>
      
      <!-- Mensaje motivacional -->
      <div v-if="datosLocales.categoria" class="validation-message">
        <div class="message-success">
          <svg class="icon-check" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>¡Excelente! '{{ getCategoriaLabel(datosLocales.categoria) }}' es una gran elección.</span>
        </div>
      </div>
    </div>

    <!-- Fechas -->
    <div class="form-row">
      <!-- Fecha de Inicio -->
      <div class="form-group form-group-half">
        <label for="fecha-inicio" class="form-label">
          Fecha de Inicio
        </label>
        <input
          id="fecha-inicio"
          v-model="datosLocales.fecha_inicio"
          type="date"
          class="form-input"
          :class="{ 'input-valid': datosLocales.fecha_inicio }"
          @change="validarFechas"
        />
      </div>

      <!-- Fecha de Fin -->
      <div class="form-group form-group-half">
        <label for="fecha-fin" class="form-label">
          Fecha de Finalización
        </label>
        <input
          id="fecha-fin"
          v-model="datosLocales.fecha_fin"
          type="date"
          class="form-input"
          :class="{ 
            'input-valid': datosLocales.fecha_fin && !errorFecha,
            'input-invalid': errorFecha
          }"
          @change="validarFechas"
        />
      </div>
    </div>

    <!-- Error de fechas -->
    <div v-if="errorFecha" class="validation-message">
      <div class="message-error">
        <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>La fecha de finalización no puede ser anterior a la fecha de inicio.</span>
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
    descripcion?: string;
    categoria: CategoriaProyecto | '';
    fecha_inicio: string;
    fecha_fin: string;
  };
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue];
  'validacion-cambio': [esValido: boolean];
}>();

// Estado local
const datosLocales = reactive({
  descripcion: props.modelValue.descripcion || '',
  categoria: props.modelValue.categoria || '' as CategoriaProyecto | '',
  fecha_inicio: props.modelValue.fecha_inicio || '',
  fecha_fin: props.modelValue.fecha_fin || '',
});

const errorFecha = ref(false);

/**
 * Obtiene el label de la categoría en español
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
 * Valida que la fecha de fin no sea anterior a la fecha de inicio
 */
const validarFechas = () => {
  if (datosLocales.fecha_inicio && datosLocales.fecha_fin) {
    const inicio = new Date(datosLocales.fecha_inicio);
    const fin = new Date(datosLocales.fecha_fin);
    
    errorFecha.value = fin < inicio;
    validarFormulario();
  }
};

/**
 * Valida todo el formulario del paso 2
 */
const validarFormulario = () => {
  const esValido = 
    datosLocales.categoria !== '' &&
    datosLocales.fecha_inicio !== '' &&
    datosLocales.fecha_fin !== '' &&
    !errorFecha.value;
  
  emit('validacion-cambio', esValido);
};

// Sincronizar con el v-model
watch(datosLocales, (newValue) => {
  emit('update:modelValue', { ...newValue });
  validarFormulario();
}, { deep: true });

// Sincronizar cuando cambia desde el padre
watch(() => props.modelValue, (newValue) => {
  Object.assign(datosLocales, newValue);
  validarFechas();
}, { deep: true });

// Validar al montar
onMounted(() => {
  validarFechas();
  validarFormulario();
});
</script>

<style scoped>
.form-paso {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.form-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: clamp(0.875rem, 2.5vw, 0.95rem);
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #1a1a1a;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.input-valid,
.form-select.select-valid {
  border-color: #10b981;
}

.form-input.input-invalid {
  border-color: #ef4444;
}

.helper-text {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2.5vw, 0.875rem);
  color: #6b7280;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group-half {
  margin-bottom: 0;
}

.validation-message {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2.5vw, 0.875rem);
}

.message-success,
.message-error {
  display: flex;
  align-items: flex-start;
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

/* Tablet */
@media (max-width: 768px) {
  .form-paso {
    padding: 0 0.75rem;
  }
}

/* Móvil */
@media (max-width: 640px) {
  .form-paso {
    padding: 0 0.5rem;
  }

  .form-title {
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group-half {
    margin-bottom: 0;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.875rem 0.75rem;
  }

  .form-textarea {
    min-height: 120px;
  }
}

/* Móvil pequeño */
@media (max-width: 400px) {
  .form-paso {
    padding: 0;
  }
}
</style>
