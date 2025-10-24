<template>
  <section class="landing">
    <HeroBanner />

    <div class="news-section">
      <h2 class="section-title">{{ t.newsAndUpdates }}</h2>
      
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <span class="material-symbols-outlined loading-icon">progress_activity</span>
        <p>Cargando noticias...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <span class="material-symbols-outlined error-icon">error</span>
        <p>{{ error }}</p>
      </div>
      
      <!-- News grid -->
      <div v-else class="news-grid">
        <NewsCard
          v-for="item in news"
          :key="item.id"
          :title="item.titulo"
          :description="item.descripcion"
          :image="item.imagen_url || ''"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeroBanner from '@/components/HeroBanner.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useNews } from '@/composables/useNews'

const { t } = useLanguage()
const { news, loading, error, fetchNews } = useNews()

// Cargar noticias al montar el componente
onMounted(async () => {
  await fetchNews(4) // Cargar 4 noticias
})
</script>

<style scoped>
.landing { max-width: 1200px; margin: 0 auto; display:flex; flex-direction:column; gap: 1.25rem; }
.news-section { margin-top: .5rem; }
.section-title { font-size: 1.25rem; font-weight: 700; margin: .5rem 0 .75rem; }

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}

.loading-icon {
  font-size: 3rem;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: #ef4444;
}

.error-state p {
  color: #991b1b;
  font-weight: 500;
}

.news-grid { display:grid; grid-template-columns: 1fr; gap: .75rem; }
@media (min-width: 640px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 992px) { .news-grid { grid-template-columns: repeat(4, 1fr); } }
</style>
