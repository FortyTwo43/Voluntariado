<template>
  <section class="page">
    <h1 class="page-title">{{ t.terms }}</h1>
    <p class="page-subtitle">{{ t.termsIntro }}</p>

    <div class="card">
      <h2>1. {{ t.usage }}</h2>
      <p>{{ t.lorem }}</p>
    </div>
    <div class="card">
      <h2>2. {{ t.privacy }}</h2>
      <p>{{ t.lorem }}</p>
    </div>
    <div class="card">
      <h2>3. {{ t.cookies }}</h2>
      <p>{{ t.lorem }}</p>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; display:flex; flex-direction:column; gap:1rem; }
.page-title { font-size:1.75rem; font-weight:800; }
.page-subtitle { color: var(--color-text-secondary); }
.card { background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px; padding:1rem; }
.card h2 { font-size:1.1rem; margin:0 0 .5rem; }
</style>
