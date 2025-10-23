<template>
  <div class="public-layout">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <PublicTopBar />
    <main id="main-content" class="public-content">
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

.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus-visible {
  left: 1rem;
  top: 1rem;
  width: auto;
  height: auto;
  padding: .5rem .75rem;
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  z-index: 1000;
}

@media (min-width: 768px) {
  .public-content {
    padding: 1.5rem;
  }
}
</style>
