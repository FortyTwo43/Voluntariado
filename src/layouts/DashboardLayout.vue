<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="dashboard-main">
      <HeaderBar />
      <main class="dashboard-content">
        <router-view />
      </main>
      <footer class="dashboard-footer">
        © 2025 Voluntariado
      </footer>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  padding: 1.5rem;
}

.dashboard-footer {
  background-color: var(--color-surface);
  text-align: center;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
}
</style>
