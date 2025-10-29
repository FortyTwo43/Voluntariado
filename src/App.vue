<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAlert } from './composables/useAlert';
import AlertNotification from './components/alerts/AlertNotification.vue';

const { alerts, removeAlert } = useAlert();
</script>

<template>
  <RouterView />
  
  <!-- Contenedor de alertas -->
  <div class="alerts-container">
    <AlertNotification
      v-for="alert in alerts"
      :key="alert.id"
      :type="alert.type"
      :title="alert.title"
      :message="alert.message"
      :duration="alert.duration"
      @dismiss="removeAlert(alert)"
    />
  </div>
</template>

<style scoped>
.alerts-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.alerts-container > * {
  pointer-events: auto;
}

@media (max-width: 640px) {
  .alerts-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }
}
</style>
