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
  const baseClass = 'button-primary';
  const variantClass = props.variant === 'primary' ? 'button-primary--purple' : 'button-primary--orange';
  const disabledClass = props.disabled ? 'button-primary--disabled' : '';
  
  return [baseClass, variantClass, disabledClass].filter(Boolean).join(' ');
});
</script>

<style scoped>
.button-primary {
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

.button-primary--purple {
  background-color: #4f46e5;
  color: white;
}

.button-primary--purple:hover:not(.button-primary--disabled) {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.button-primary--orange {
  background-color: #f59e0b;
  color: white;
}

.button-primary--orange:hover:not(.button-primary--disabled) {
  background-color: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.button-primary--disabled {
  background-color: #9ca3af;
  color: #6b7280;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-primary:active:not(.button-primary--disabled) {
  transform: translateY(0);
}
</style>
