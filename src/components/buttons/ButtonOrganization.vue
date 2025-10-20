<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
});

const emit = defineEmits<{
  click: [];
}>();

const buttonClass = computed(() => {
  const baseClass = 'button-organization';
  const variantClass = props.variant === 'primary' ? 'button-organization--primary' : 'button-organization--secondary';
  const disabledClass = props.disabled ? 'button-organization--disabled' : '';
  
  return [baseClass, variantClass, disabledClass].filter(Boolean).join(' ');
});
</script>

<style scoped>
.button-organization {
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-organization--primary {
  background-color: #f59e0b;
  color: white;
}

.button-organization--primary:hover:not(.button-organization--disabled) {
  background-color: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.button-organization--secondary {
  background-color: transparent;
  color: #f59e0b;
  border: 2px solid #f59e0b;
}

.button-organization--secondary:hover:not(.button-organization--disabled) {
  background-color: #f59e0b;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.button-organization--disabled {
  background-color: #9ca3af;
  color: #6b7280;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  border-color: #9ca3af;
}

.button-organization:active:not(.button-organization--disabled) {
  transform: translateY(0);
}
</style>
