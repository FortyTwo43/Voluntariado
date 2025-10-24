<template>
  <section class="page">
    <h1 class="page-title">{{ t.institutionalInfo }}</h1>
    <p class="page-subtitle">{{ t.institutionalIntro }}</p>

    <div class="grid">
      <div class="card">
        <h2>{{ t.mission }}</h2>
        <p>{{ t.lorem }}</p>
      </div>
      <div class="card">
        <h2>{{ t.vision }}</h2>
        <p>{{ t.lorem }}</p>
      </div>
      <div class="card">
        <h2>{{ t.values }}</h2>
        <p>{{ t.lorem }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.page { max-width: 1000px; margin: 0 auto; display:flex; flex-direction:column; gap:1rem; }
.page-title { font-size:1.75rem; font-weight:800; }
.page-subtitle { color: var(--color-text-secondary); }
.grid { display:grid; grid-template-columns: 1fr; gap:1rem; }
@media (min-width: 768px){ .grid{ grid-template-columns: repeat(3, 1fr);} }
.card { background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px; padding:1rem; }
.card h2 { font-size:1.1rem; margin:0 0 .5rem; }
</style>
