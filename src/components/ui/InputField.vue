<template>
  <div class="input-field">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-container">
      <input
        :id="id"
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        class="input"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="password-toggle"
        @click="togglePasswordVisibility"
      >
        <svg v-if="!showPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </button>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  id: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  modelValue: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showPasswordToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  showPasswordToggle: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
  focus: [];
}>();

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});
</script>

<style scoped>
.input-field {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #f9fafb;
}

.input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #374151;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}
</style>
