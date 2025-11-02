<template>
  <section class="dashboard-view">
    <div class="dashboard-header">
      <p class="dashboard-greeting">{{ t.greeting }}</p>
      <p class="dashboard-subtitle">
        {{ t.dashboardSubtitle }}
      </p>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <span class="material-symbols-outlined stat-icon">folder</span>
        <div class="stat-content">
          <h3 class="stat-value">12</h3>
          <p class="stat-label">{{ t.activeProjects }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <span class="material-symbols-outlined stat-icon">schedule</span>
        <div class="stat-content">
          <h3 class="stat-value">45h</h3>
          <p class="stat-label">{{ t.hoursThisMonth }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <span class="material-symbols-outlined stat-icon">emoji_events</span>
        <div class="stat-content">
          <h3 class="stat-value">8</h3>
          <p class="stat-label">{{ t.achievements }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <span class="material-symbols-outlined stat-icon">groups</span>
        <div class="stat-content">
          <h3 class="stat-value">3</h3>
          <p class="stat-label">{{ t.organizations }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-sections">
      <section class="section">
        <h2 class="section-title">{{ t.recommendedProjects }}</h2>
        <div class="project-grid">
          <div class="project-card" v-for="i in 3" :key="i">
            <div class="project-image">
              <span class="material-symbols-outlined">volunteer_activism</span>
            </div>
            <div class="project-info">
              <h3 class="project-title">Proyecto de Voluntariado {{ i }}</h3>
              <p class="project-description">
                Descripción breve del proyecto de voluntariado y las actividades que se realizan.
              </p>
              <div class="project-meta">
                <span class="meta-item">
                  <span class="material-symbols-outlined">location_on</span>
                  Manabi
                </span>
                <span class="meta-item">
                  <span class="material-symbols-outlined">calendar_today</span>
                  {{ t.flexible }}
                </span>
              </div>
              <button class="btn-primary">{{ t.viewDetails }}</button>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">{{ t.recentActivity }}</h2>
        <div class="activity-list">
          <div class="activity-item" v-for="i in 4" :key="i">
            <span class="material-symbols-outlined activity-icon">check_circle</span>
            <div class="activity-content">
              <p class="activity-text">{{ t.completedActivity }} <strong>Proyecto {{ i }}</strong></p>
              <p class="activity-time">{{ t.daysAgo }} {{ i }} {{ t.days }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
</script>

<style scoped>
.dashboard-view {
  max-width: 80rem;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-greeting {
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  margin-bottom: 0.25rem;
}

.dashboard-subtitle {
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.dashboard-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.project-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.project-image .material-symbols-outlined {
  font-size: 4rem;
  color: white;
}

.project-info {
  padding: 1rem;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-item .material-symbols-outlined {
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-left: 2px solid var(--color-primary);
  background-color: var(--color-background);
  border-radius: 0.25rem;
}

.activity-icon {
  color: var(--color-success);
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
</style>
