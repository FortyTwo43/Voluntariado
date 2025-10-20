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
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
});

const emit = defineEmits<{
  click: [];
}>();

const buttonClass = computed(() => {
  const baseClass = 'button-secondary';
  const disabledClass = props.disabled ? 'button-secondary--disabled' : '';
  
  return [baseClass, disabledClass].filter(Boolean).join(' ');
});
</script>

<style scoped>
.button-secondary {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #4f46e5;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  color: #4f46e5;
}

.button-secondary:hover:not(.button-secondary--disabled) {
  background-color: #4f46e5;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.button-secondary--disabled {
  border-color: #9ca3af;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-secondary:active:not(.button-secondary--disabled) {
  transform: translateY(0);
}
</style>
