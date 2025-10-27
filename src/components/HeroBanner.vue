<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">{{ t.heroTitle }}</h1>
      <p class="hero-subtitle">{{ t.heroSubtitle }}</p>
      
      <div class="benefits-section">
        <h2 class="benefits-title">{{ t.whyVolunteer }}</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <span class="material-symbols-outlined benefit-icon">favorite</span>
            <div class="benefit-text">
              <h3>{{ t.socialImpact }}</h3>
              <p>{{ t.socialImpactDesc }}</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="material-symbols-outlined benefit-icon">psychology</span>
            <div class="benefit-text">
              <h3>{{ t.personalDevelopment }}</h3>
              <p>{{ t.personalDevelopmentDesc }}</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="material-symbols-outlined benefit-icon">groups</span>
            <div class="benefit-text">
              <h3>{{ t.networking }}</h3>
              <p>{{ t.networkingDesc }}</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="material-symbols-outlined benefit-icon">workspace_premium</span>
            <div class="benefit-text">
              <h3>{{ t.certification }}</h3>
              <p>{{ t.certificationDesc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <RouterLink to="/registro" class="btn btn-primary">{{ t.ctaRegister }}</RouterLink>
        <RouterLink to="/proyectos-view" class="btn btn-secondary">{{ t.ctaBrowse }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
</script>

<style scoped>
.hero {
  border-radius: 16px;
  min-height: 500px;
  background-image: url('https://images.unsplash.com/photo-1609599006353-c8ef86d6449a?q=80&w=1600&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position:absolute; inset:0;
  background: linear-gradient(90deg, rgba(0,0,0,.65), rgba(0,0,0,.3));
}
.hero-content {
  position: relative; z-index:1;
  color: white;
  padding: 2rem;
  max-width: 900px;
}
.hero-title { font-size: 2.25rem; font-weight: 800; margin-bottom: .5rem; }
.hero-subtitle { opacity:.95; margin-bottom: 1.5rem; }

.benefits-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0,0,0,.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.benefits-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: 1rem;
  background: rgba(255,255,255,.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255,255,255,.15);
  transform: translateY(-2px);
}

.benefit-icon {
  font-size: 2rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.benefit-text h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: .25rem;
}

.benefit-text p {
  font-size: .875rem;
  opacity: .9;
  line-height: 1.4;
}

.hero-actions { 
  display:flex; 
  gap:.75rem; 
  flex-wrap:wrap;
  margin-top: 1.5rem;
}

.btn {
  padding: .75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229,57,53,.3);
}

.btn-secondary {
  background: rgba(255,255,255,.2);
  color: white;
  border: 2px solid rgba(255,255,255,.4);
}

.btn-secondary:hover {
  background: rgba(255,255,255,.3);
  border-color: rgba(255,255,255,.6);
  transform: translateY(-2px);
}

@media (min-width: 768px) { 
  .hero-title { font-size: 3rem; } 
  .hero-content { padding: 3rem; }
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  .benefit-item {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}
</style>
