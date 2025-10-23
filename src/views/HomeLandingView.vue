<template>
  <section class="landing">
    <HeroBanner />

    <div class="news-section">
      <h2 class="section-title">{{ t.newsAndUpdates }}</h2>
      <div class="news-grid">
        <NewsCard
          v-for="(item, idx) in news"
          :key="idx"
          :title="item.title"
          :description="item.desc"
          :image="item.image"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroBanner from '@/components/HeroBanner.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const news = [
  {
    title: 'Limpieza de playas en Barcelona',
    desc: 'Ayudemos a mantener nuestras costas limpias.',
    image: 'https://images.unsplash.com/photo-1608502253726-8f383ce5cf74?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Evento de recaudación para protectora de animales',
    desc: 'Participa en nuestro evento para apoyar una buena causa.',
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Reforestación en el parque del Retiro',
    desc: 'Súmate a la jornada de plantación de árboles.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Comedor social busca voluntarios',
    desc: 'Ayuda a preparar y servir comidas calientes.',
    image: 'https://images.unsplash.com/photo-1549575810-c24fd4e2ed1d?q=80&w=1200&auto=format&fit=crop'
  }
]
</script>

<style scoped>
.landing { max-width: 1200px; margin: 0 auto; display:flex; flex-direction:column; gap: 1.25rem; }
.news-section { margin-top: .5rem; }
.section-title { font-size: 1.25rem; font-weight: 700; margin: .5rem 0 .75rem; }
.news-grid { display:grid; grid-template-columns: 1fr; gap: .75rem; }
@media (min-width: 640px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 992px) { .news-grid { grid-template-columns: repeat(4, 1fr); } }
</style>
