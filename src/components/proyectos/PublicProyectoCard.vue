<script setup lang="ts">
// Componente en desuso: mantener por compatibilidad, reexporta ProyectoCard en modo solo visual
import ProyectoCard from './ProyectoCard.vue'
defineProps<{ proyecto: any }>()
</script>

<template>
  <ProyectoCard :proyecto="(proyecto as any)" :show-actions="false" />
</template>
