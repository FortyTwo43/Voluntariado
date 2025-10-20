<template>
  <div class="public-layout">
    <PublicTopBar />
    <main class="public-content">
      <router-view />
    </main>
    <PublicFooter />
  </div>
</template>

<script setup>
import PublicTopBar from '@/components/PublicTopBar.vue'
import PublicFooter from '@/components/PublicFooter.vue'
</script>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  color: var(--color-text);
}

.public-content {
  flex: 1;
  padding: 1rem;
}

@media (min-width: 768px) {
  .public-content {
    padding: 1.5rem;
  }
}
</style>
