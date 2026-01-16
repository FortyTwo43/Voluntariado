<template>
  <div class="admin-form-view">
    <EliminarUsuarioInactivoForm />
  </div>
</template>

<script setup lang="ts">
import EliminarUsuarioInactivoForm from '../../components/admin/EliminarUsuarioInactivoForm.vue';
</script>

<style scoped>
.admin-form-view {
  min-height: calc(100vh - 200px);
  padding: clamp(1rem, 4vw, 2rem);
  background: #f9fafb;
}
</style>

