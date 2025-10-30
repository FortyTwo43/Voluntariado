<template>
  <div class="profile-field">
    <label class="field-label">{{ label }}</label>
    <div class="field-container">
      <input
        v-if="isEditing"
        :type="fieldType"
        :value="value"
        :placeholder="placeholder"
        class="field-input"
        :class="{ 'error': error }"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div v-else class="field-display">
        {{ value || 'No especificado' }}
      </div>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: string;
  error?: string;
  isEditing: boolean;
  fieldType?: 'text' | 'email' | 'tel';
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fieldType: 'text',
  error: '',
  placeholder: ''
});

const emit = defineEmits<{
  update: [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  
  // Si es un campo de teléfono, filtrar solo números
  if (props.fieldType === 'tel') {
    value = value.replace(/\D/g, '');
    target.value = value;
  }
  
  emit('update', value);
};

const handleBlur = () => {
  // Emitir evento de blur si es necesario para validación
};
</script>

<style scoped>
.profile-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.field-container {
  position: relative;
}

.field-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #f9fafb;
  transition: all 0.2s;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background-color: white;
}

.field-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-display {
  width: 100%;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .field-input,
  .field-display {
    padding: 0.625rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 320px) {
  .field-input,
  .field-display {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .field-label {
    font-size: 0.75rem;
  }
}
</style>
