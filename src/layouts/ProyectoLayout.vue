<template>
  <div class="proyecto-layout">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Layout simple para las vistas de proyectos
// Puede extenderse con navegación, breadcrumbs, etc.
</script>

<style scoped>
.proyecto-layout {
  min-height: 100vh;
  background: #F7F5F0;
}
</style>
