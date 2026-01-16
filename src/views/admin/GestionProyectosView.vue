<template>
  <div class="admin-form-view">
    <GestionProyectosForm />
  </div>
</template>

<script setup lang="ts">
import GestionProyectosForm from '../../components/admin/GestionProyectosForm.vue';
</script>

<style scoped>
.admin-form-view {
  min-height: calc(100vh - 200px);
  padding: clamp(1rem, 4vw, 2rem);
  background: #f9fafb;
}
</style>

