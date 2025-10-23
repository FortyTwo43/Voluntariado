<template>
  <AuthLayout>
    <UserLoginForm />
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '../../layouts/AuthLayout.vue';
import UserLoginForm from '../../components/forms/UserLoginForm.vue';
</script>

<style scoped>
/* Los estilos están manejados por los componentes hijos */
</style>