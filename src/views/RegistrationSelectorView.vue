<template>
  <section class="registration-selector">
    <!-- Header -->
    <div class="selector-header">
      <h1 class="page-title">{{ t.joinCommunity }}</h1>
      <p class="page-subtitle">
        {{ t.chooseAccountType }}
      </p>
    </div>

    <!-- Cards de selección -->
    <div class="selector-cards">
      <!-- Voluntario Card -->
      <article 
        class="selection-card volunteer-card" 
        tabindex="0" 
        role="button"
        @click="goToVolunteerRegister" 
        @keypress.enter="goToVolunteerRegister"
        aria-label="Registrarse como voluntario"
      >
        <div class="card-icon volunteer-icon">
          <span class="material-symbols-outlined">volunteer_activism</span>
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ t.volunteer }}</h2>
          <p class="card-description">
            {{ t.volunteerDesc }}
          </p>
          <ul class="card-benefits">
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.findProjects }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.developSkills }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.connectCommunity }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.getCertificates }}
            </li>
          </ul>
        </div>
        <button class="card-button btn-volunteer">
          {{ t.registerAsVolunteerBtn }}
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </article>

      <!-- Organización Card -->
      <article 
        class="selection-card organization-card" 
        tabindex="0" 
        role="button"
        @click="goToOrganizationRegister" 
        @keypress.enter="goToOrganizationRegister"
        aria-label="Registrarse como organización"
      >
        <div class="card-icon organization-icon">
          <span class="material-symbols-outlined">business</span>
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ t.organizationTitle }}</h2>
          <p class="card-description">
            {{ t.organizationDesc }}
          </p>
          <ul class="card-benefits">
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.publishProjects }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.findVolunteers }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.expandImpact }}
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              {{ t.managementTools }}
            </li>
          </ul>
        </div>
        <button class="card-button btn-organization">
          {{ t.registerAsOrgBtn }}
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </article>
    </div>

    <!-- Login redirect -->
    <div class="login-redirect">
      <p>{{ t.alreadyAccount }}</p>
      <router-link to="/login" class="login-link">
        {{ t.signInHere }}
        <span class="material-symbols-outlined">login</span>
      </router-link>
    </div>

    <!-- Help section -->
    <div class="help-section">
      <span class="material-symbols-outlined">info</span>
      <p>
        {{ t.notSure }} 
        <router-link to="/contacto" class="help-link">{{ t.contactUs }}</router-link> {{ t.weWillHelp }}.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

const router = useRouter()
const { t } = useLanguage()

const goToVolunteerRegister = () => {
  router.push('/registro-voluntario')
}

const goToOrganizationRegister = () => {
  router.push('/register-organization')
}
</script>

<style scoped>
.registration-selector {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.selector-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.selector-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.selection-card {
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.selection-card:hover,
.selection-card:focus {
  border-color: var(--color-primary);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.15);
  transform: translateY(-4px);
  outline: none;
}

.selection-card:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.card-icon .material-symbols-outlined {
  font-size: 2.5rem;
  color: white;
}

.volunteer-icon {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.organization-icon {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
}

.card-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.5;
}

.card-benefits {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.card-benefits li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.card-benefits .material-symbols-outlined {
  font-size: 1.125rem;
  color: var(--color-success);
  flex-shrink: 0;
}

.card-button {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  color: white;
}

.btn-volunteer {
  background-color: var(--color-primary);
}

.btn-volunteer:hover {
  background-color: var(--color-primary-dark);
}

.btn-organization {
  background-color: var(--color-success);
}

.btn-organization:hover {
  background-color: #047857;
}

.card-button .material-symbols-outlined {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.card-button:hover .material-symbols-outlined {
  transform: translateX(3px);
}

.login-redirect {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--color-background);
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
}

.login-redirect p {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.625rem;
}

.login-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.login-link:hover {
  gap: 0.75rem;
}

.login-link .material-symbols-outlined {
  font-size: 1.125rem;
}

.help-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background-color: #fef3c7;
  border-radius: 0.75rem;
  border: 1px solid #fbbf24;
  font-size: 0.875rem;
  color: #92400e;
  flex-wrap: wrap;
}

.help-section .material-symbols-outlined {
  font-size: 1.125rem;
  color: #d97706;
}

.help-section p {
  margin: 0;
}

.help-link {
  color: #92400e;
  font-weight: 600;
  text-decoration: underline;
}

.help-link:hover {
  color: #78350f;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .selector-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-icon {
    width: 64px;
    height: 64px;
  }

  .card-icon .material-symbols-outlined {
    font-size: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .selection-card,
  .card-button,
  .card-button .material-symbols-outlined {
    transition: none;
  }
  
  .selection-card:hover {
    transform: none;
  }
}
</style>
