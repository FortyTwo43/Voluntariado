<template>
  <Transition name="alert">
    <div v-if="visible" :class="alertClass" class="alert-notification">
      <div class="alert-content">
        <div class="alert-icon">
          <svg v-if="type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="type === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="alert-message">
          <p class="alert-title">{{ title }}</p>
          <p v-if="message" class="alert-description">{{ message }}</p>
        </div>
        <button
          v-if="dismissible"
          @click="dismiss"
          class="alert-close"
          aria-label="Cerrar notificación"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  dismissible?: boolean;
  duration?: number; // Duración en milisegundos, 0 para no auto-ocultar
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
  duration: 5000,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const visible = ref(false);

const alertClass = computed(() => {
  const baseClass = 'alert-notification';
  const typeClass = `alert-${props.type}`;
  return [baseClass, typeClass];
});

const dismiss = () => {
  visible.value = false;
  emit('dismiss');
};

onMounted(() => {
  visible.value = true;
  
  if (props.duration > 0) {
    setTimeout(() => {
      dismiss();
    }, props.duration);
  }
});
</script>

<style scoped>
.alert-notification {
  position: relative;
  top: 0;
  right: 0;
  z-index: auto;
  max-width: 24rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.alert-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.alert-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-message {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
}

.alert-description {
  font-size: 0.75rem;
  line-height: 1rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
}

.alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.alert-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Tipos de alerta */
.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-warning {
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
  color: #d97706;
}

.alert-info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
}

/* Animaciones */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .alert-notification {
    max-width: none;
  }
}
</style>
