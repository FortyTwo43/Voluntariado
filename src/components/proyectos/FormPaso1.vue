<template>
  <div class="form-paso">
    <h2 class="form-title">Comencemos con el nombre</h2>
    
    <div class="form-group">
      <label for="nombre-proyecto" class="form-label">
        Nombre del Proyecto
      </label>
      <input
        id="nombre-proyecto"
        v-model="nombreLocal"
        type="text"
        class="form-input"
        :class="{ 
          'input-valid': isValid && nombreLocal.length > 0,
          'input-invalid': !isValid && nombreLocal.length > 0
        }"
        placeholder="ej., Proyecto de Apicultura Urbana"
        @input="validarNombre"
        @blur="validarNombre"
      />
      
      <!-- Mensaje de validación -->
      <div v-if="nombreLocal.length > 0" class="validation-message">
        <div v-if="isValid" class="message-success">
          <svg class="icon-check" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>{{ mensajeValidacion }}</span>
        </div>
        <div v-else class="message-error">
          <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span>{{ mensajeValidacion }}</span>
        </div>
      </div>
      
      <!-- Botón Next Step (siempre visible, deshabilitado si no es válido) -->
      <div class="button-container">
        <button
          type="button"
          class="btn-next"
          :disabled="!isValid"
          @click="$emit('siguiente-paso')"
        >
          Siguiente Paso
          <svg class="icon-arrow-right" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

// Props
const props = defineProps<{
  modelValue: string;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'validacion-cambio': [esValido: boolean];
  'siguiente-paso': [];
}>();

// Estado local
const nombreLocal = ref(props.modelValue);
const isValid = ref(false);
const mensajeValidacion = ref('');

// Constantes de validación
const MIN_CARACTERES = 5;
const MAX_CARACTERES = 100;

/**
 * Valida el nombre del proyecto
 */
const validarNombre = () => {
  const nombre = nombreLocal.value.trim();
  
  if (nombre.length === 0) {
    isValid.value = false;
    mensajeValidacion.value = '';
    emit('validacion-cambio', false);
    return;
  }
  
  if (nombre.length < MIN_CARACTERES) {
    isValid.value = false;
    mensajeValidacion.value = `El nombre debe tener al menos ${MIN_CARACTERES} caracteres`;
    emit('validacion-cambio', false);
    return;
  }
  
  if (nombre.length > MAX_CARACTERES) {
    isValid.value = false;
    mensajeValidacion.value = `El nombre no puede exceder ${MAX_CARACTERES} caracteres`;
    emit('validacion-cambio', false);
    return;
  }
  
  // Validación exitosa
  isValid.value = true;
  mensajeValidacion.value = '¡Nombre genial! Es claro e inspirador.';
  emit('validacion-cambio', true);
  console.log('Validación exitosa, isValid:', isValid.value);
};

// Sincronizar con el v-model
watch(nombreLocal, (newValue) => {
  emit('update:modelValue', newValue);
});

// Sincronizar cuando cambia desde el padre
watch(() => props.modelValue, (newValue) => {
  nombreLocal.value = newValue;
  if (newValue) {
    validarNombre();
  }
});

// Validar al montar si ya hay un valor
onMounted(() => {
  if (nombreLocal.value) {
    validarNombre();
  }
});
</script>

<style scoped>
.form-paso {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #4B0082;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #2E2E2E;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #2E2E2E;
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
  border-bottom: 3px solid #79C99E;
  border-radius: 0;
  transition: all 0.2s ease;
  outline: none;
  font-weight: 500;
}

.form-input:focus {
  border-bottom-color: #4B0082;
  background-color: rgba(255, 255, 255, 1);
}

.form-input.input-valid {
  border-bottom-color: #282828;
  background-color: #f5f5f5;
}

.form-input.input-invalid {
  border-bottom-color: #230046;
  background-color: #f5f5f5;
}

.validation-message {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.message-success,
.message-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-radius: 0;
  font-weight: 600;
}

.message-success {
  color: #79C99E;
  background: transparent;
  border: none;
}

.message-error {
  color: #4B0082;
  background: transparent;
  border: none;
}

.icon-check,
.icon-error {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.button-container {
  margin-top: 2.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-next {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: #79C99E;
  border: none;
  border-radius: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 0, 100, 0.4);
  background: linear-gradient(135deg, #320064 0%, #230046 100%);
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
  border-color: #6b7280;
  transform: none;
}

.btn-next:disabled:hover {
  transform: none;
  box-shadow: none;
}

.icon-arrow-right {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
