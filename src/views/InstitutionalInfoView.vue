<template>
  <section class="page">
    <h1 class="page-title">{{ t.institutionalInfo }}</h1>
    <p class="page-subtitle">{{ t.institutionalIntro }}</p>

    <!-- MISIÓN -->
    <div class="card mission-card">
      <div class="card-header">
        <h2 class="section-title">{{ t.mission }}</h2>
      </div>
      <div class="card-body">
        <p class="main-text">{{ t.missionMain }}</p>
        <p class="secondary-text">{{ t.missionSecondary }}</p>
      </div>
    </div>

    <!-- VISIÓN -->
    <div class="card vision-card">
      <div class="card-header">
        <h2 class="section-title">{{ t.vision }}</h2>
      </div>
      <div class="card-body">
        <p class="main-text">{{ t.visionMain }}</p>
        <p class="secondary-text">{{ t.visionSecondary }}</p>
      </div>
    </div>

    <!-- VALORES -->
    <div class="card values-card">
      <div class="card-header">
        <h2 class="section-title">{{ t.values }}</h2>
      </div>
      <div class="card-body">
        <p class="intro-text">{{ t.valuesIntro }}</p>
        <div class="values-grid">
          <div class="value-item">
            <h3 class="value-title">{{ t.valueSolidarity }}</h3>
            <p class="value-description">{{ t.valueSolidarityDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueCommitment }}</h3>
            <p class="value-description">{{ t.valueCommitmentDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueRespect }}</h3>
            <p class="value-description">{{ t.valueRespectDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueTeamwork }}</h3>
            <p class="value-description">{{ t.valueTeamworkDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueTransparency }}</h3>
            <p class="value-description">{{ t.valueTransparencyDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueInnovation }}</h3>
            <p class="value-description">{{ t.valueInnovationDesc }}</p>
          </div>
          <div class="value-item">
            <h3 class="value-title">{{ t.valueService }}</h3>
            <p class="value-description">{{ t.valueServiceDesc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.page {
  max-width: 1000px;
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
  margin-bottom: 40px;
  font-weight: 500;
}

.card {
  background-color: var(--card-bg, #ffffff);
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 25px;
  border-bottom: 2px solid #e2e8f0;
}

.mission-card .card-header {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.vision-card .card-header {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
}

.values-card .card-header {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: var(--primary-color, #0ea5e9);
}

.vision-card .section-title {
  color: #d97706;
}

.values-card .section-title {
  color: #16a34a;
}

.card-body {
  padding: 25px;
}

.main-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-primary, #1e293b);
  margin-bottom: 15px;
  font-weight: 500;
}

.secondary-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary, #1e293b);
  margin: 0;
}

.intro-text {
  font-size: 1.05rem;
  color: var(--text-primary, #1e293b);
  margin-bottom: 20px;
  font-weight: 500;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .values-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.value-item {
  padding: 18px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color, #0ea5e9);
  transition: all 0.3s ease;
}

.value-item:hover {
  background-color: #f1f5f9;
  border-left-color: #0284c7;
}

.values-card .value-item {
  border-left-color: #16a34a;
}

.values-card .value-item:hover {
  border-left-color: #15803d;
}

.value-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--primary-color, #0ea5e9);
}

.values-card .value-title {
  color: #16a34a;
}

.value-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  color: var(--text-primary, #1e293b);
}

.cta-section {
  text-align: center;
  margin-top: 50px;
  padding: 40px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 2px solid var(--primary-color, #0ea5e9);
}

.cta-section h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color, #0ea5e9);
  margin-bottom: 10px;
}

.cta-section p {
  font-size: 1.05rem;
  color: var(--text-primary, #1e293b);
  margin-bottom: 25px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 32px;
  background-color: var(--primary-color, #0ea5e9);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid var(--primary-color, #0ea5e9);
}

.btn-primary:hover {
  background-color: #0284c7;
  border-color: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

@media (max-width: 768px) {
  .page {
    padding: 25px 15px;
  }

  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .card-header {
    padding: 20px;
  }

  .card-body {
    padding: 20px;
  }

  .cta-section {
    padding: 25px;
  }

  .cta-section h3 {
    font-size: 1.3rem;
  }
}
</style>
