<template>
  <div class="admin-form-view">
    <div class="view-header">
      <button @click="volverAlDashboard" class="btn-volver">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver al Dashboard
      </button>
      <h1 class="view-title">Reportes y Estadísticas</h1>
    </div>
    <ReportesEstadisticasForm />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ReportesEstadisticasForm from '../../components/admin/ReportesEstadisticasForm.vue';

const router = useRouter();

const volverAlDashboard = () => {
  router.push('/admin');
};
</script>

<style scoped>
.admin-form-view {
  min-height: calc(100vh - 200px);
  padding: clamp(1rem, 4vw, 2rem);
  background: #f9fafb;
}

.view-header {
  max-width: 1400px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4f46e5;
  background: white;
  border: 2px solid #4f46e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-volver:hover {
  background: #4f46e5;
  color: white;
}

.btn-volver svg {
  width: 1.25rem;
  height: 1.25rem;
}

.view-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
</style>

