<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">{{ t.heroTitle }}</h1>
      <p class="hero-subtitle">{{ t.heroSubtitle }}</p>
      <div class="hero-actions">
        <RouterLink to="/proyectos" class="btn btn-secondary">{{ t.ctaBrowse }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.hero {
  border-radius: 16px;
  min-height: 340px;
  background-image: url('https://images.unsplash.com/photo-1609599006353-c8ef86d6449a?q=80&w=1600&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position:absolute; inset:0;
  background: linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.2));
}
.hero-content {
  position: relative; z-index:1;
  color: white;
  padding: 2rem;
  max-width: 700px;
}
.hero-title { font-size: 2.25rem; font-weight: 800; margin-bottom: .5rem; }
.hero-subtitle { opacity:.95; margin-bottom: 1rem; }
.hero-actions { display:flex; gap:.5rem; flex-wrap:wrap; }
@media (min-width: 768px) { .hero-title{font-size:3rem;} .hero-content{padding:3rem;} }
</style>
