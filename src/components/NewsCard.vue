<template>
  <article class="news-card">
    <div class="news-cover">
      <img :src="image" :alt="title" />
    </div>
    <div class="news-body">
      <h3 class="news-title">{{ title }}</h3>
      <p class="news-desc">{{ description }}</p>
      <button class="btn btn-ghost">{{ t.viewMore }}</button>
    </div>
  </article>
  
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
defineProps<{ title: string; description: string; image: string }>()
const { t } = useLanguage()
</script>

<style scoped>
.news-card { background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
.news-cover { height: 140px; overflow:hidden; }
.news-cover img { width:100%; height:100%; object-fit:cover; display:block; }
.news-body { padding: 1rem; display:flex; flex-direction:column; gap:.5rem; }
.news-title { font-weight:700; font-size:1rem; }
.news-desc { color: var(--color-text-secondary); font-size:.9rem; }
</style>
