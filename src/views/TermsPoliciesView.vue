<template>
  <section class="page">
    <h1 class="page-title">{{ t.terms }}</h1>
    <p class="page-subtitle">{{ t.termsIntro }}</p>

    <!-- CONDICIONES DE USO -->
    <div class="card">
      <h2 class="section-title">1. {{ t.conditionsTitle }}</h2>
      
      <div class="subsection">
        <h3>1.1 {{ t.conditionsPurpose }}</h3>
        <p>{{ t.conditionsPurposeDesc }}</p>
      </div>

      <div class="subsection">
        <h3>1.2 {{ t.conditionsRegistration }}</h3>
        <p>{{ t.conditionsRegistrationDesc }}</p>
      </div>

      <div class="subsection">
        <h3>1.3 {{ t.conditionsUserResponsibility }}</h3>
        <p>{{ t.conditionsUserResponsibilityDesc }}</p>
        <ul class="list-items">
          <li>{{ t.conditionsPoint1 }}</li>
          <li>{{ t.conditionsPoint2 }}</li>
          <li>{{ t.conditionsPoint3 }}</li>
        </ul>
      </div>

      <div class="subsection">
        <h3>1.4 {{ t.conditionsLimitation }}</h3>
        <p>{{ t.conditionsLimitationDesc }}</p>
      </div>
    </div>

    <!-- POLÍTICA DE PRIVACIDAD -->
    <div class="card">
      <h2 class="section-title">2. {{ t.privacyTitle }}</h2>
      <p class="intro-text">{{ t.privacyIntro }}</p>

      <div class="subsection">
        <h3>2.1 {{ t.privacyDataCollected }}</h3>
        <p>{{ t.privacyDataCollectedDesc }}</p>
        <ul class="list-items">
          <li>{{ t.privacyData1 }}</li>
          <li>{{ t.privacyData2 }}</li>
          <li>{{ t.privacyData3 }}</li>
        </ul>
      </div>

      <div class="subsection">
        <h3>2.2 {{ t.privacyUsage }}</h3>
        <p>{{ t.privacyUsageDesc }}</p>
        <ul class="list-items">
          <li>{{ t.privacyUsage1 }}</li>
          <li>{{ t.privacyUsage2 }}</li>
          <li>{{ t.privacyUsage3 }}</li>
          <li>{{ t.privacyUsage4 }}</li>
        </ul>
      </div>

      <div class="subsection">
        <h3>2.3 {{ t.privacyProtection }}</h3>
        <p>{{ t.privacyProtectionDesc }}</p>
      </div>

      <div class="subsection">
        <h3>2.4 {{ t.privacyRights }}</h3>
        <p>{{ t.privacyRightsDesc }}</p>
        <ul class="list-items">
          <li>{{ t.privacyRight1 }}</li>
          <li>{{ t.privacyRight2 }}</li>
          <li>{{ t.privacyRight3 }}</li>
        </ul>
        <p class="contact-info">{{ t.privacyContact }}</p>
      </div>
    </div>

    <!-- POLÍTICA DE COOKIES -->
    <div class="card">
      <h2 class="section-title">3. {{ t.cookiesTitle }}</h2>
      <p class="intro-text">{{ t.cookiesIntro }}</p>

      <div class="subsection">
        <h3>3.1 {{ t.cookiesDefinition }}</h3>
        <p>{{ t.cookiesDefinitionDesc }}</p>
      </div>

      <div class="subsection">
        <h3>3.2 {{ t.cookiesTypes }}</h3>
        <div class="cookie-type">
          <h4>{{ t.cookiesEssential }}</h4>
          <p>{{ t.cookiesEssentialDesc }}</p>
        </div>
        <div class="cookie-type">
          <h4>{{ t.cookiesAnalytics }}</h4>
          <p>{{ t.cookiesAnalyticsDesc }}</p>
        </div>
        <div class="cookie-type">
          <h4>{{ t.cookiesPreferences }}</h4>
          <p>{{ t.cookiesPreferencesDesc }}</p>
        </div>
      </div>

      <div class="subsection">
        <h3>3.3 {{ t.cookiesControl }}</h3>
        <p>{{ t.cookiesControlDesc }}</p>
      </div>
    </div>

    <!-- CTA FINAL -->
    <div class="contact-section">
      <p>¿Tienes preguntas? Contacta con nuestro equipo: <a href="mailto:soporte@voluntariado.ec">soporte@voluntariado.ec</a></p>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--primary-color, #0ea5e9);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary, #64748b);
  margin-bottom: 30px;
  font-weight: 500;
}

.card {
  background-color: var(--card-bg, #ffffff);
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--primary-color, #0ea5e9);
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--primary-color, #0ea5e9);
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.subsection {
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.subsection h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary, #1e293b);
}

.subsection p {
  line-height: 1.7;
  color: var(--text-primary, #1e293b);
  margin-bottom: 10px;
}

.intro-text {
  margin-bottom: 15px;
  font-style: italic;
  color: var(--text-secondary, #64748b);
}

.list-items {
  list-style-position: inside;
  padding-left: 0;
  margin: 12px 0;
}

.list-items li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--text-primary, #1e293b);
}

.cookie-type {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 4px;
  border-left: 3px solid #0ea5e9;
}

.cookie-type h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--primary-color, #0ea5e9);
}

.cookie-type p {
  font-size: 0.95rem;
  margin: 0;
  color: var(--text-primary, #1e293b);
}

.contact-info {
  margin-top: 10px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  font-size: 0.95rem;
  color: var(--text-primary, #1e293b);
}

.contact-section {
  text-align: center;
  margin-top: 40px;
  padding: 25px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  color: var(--text-primary, #1e293b);
}

.contact-section a {
  color: var(--primary-color, #0ea5e9);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-section a:hover {
  color: var(--primary-hover, #0284c7);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page {
    padding: 25px 15px;
  }

  .page-title {
    font-size: 2rem;
  }

  .card {
    padding: 20px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .subsection h3 {
    font-size: 1rem;
  }

  .list-items li {
    font-size: 0.95rem;
  }
}
</style>
