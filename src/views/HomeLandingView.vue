<template>
  <section class="landing">
    <!-- Panel de Accesibilidad -->
    <div class="accessibility-panel">
      <button 
        @click="toggleAccessibilityPanel" 
        class="accessibility-toggle-btn"
        :aria-label="t.accessibilityOptions"
        :aria-expanded="accessibilityPanelOpen"
      >
        <span class="material-symbols-outlined">accessibility_new</span>
      </button>

      <div v-show="accessibilityPanelOpen" class="accessibility-menu">
        <div class="accessibility-header">
          <h3>{{ t.accessibilityOptions }}</h3>
          <button @click="toggleAccessibilityPanel" class="close-btn" :aria-label="t.close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="accessibility-content">
          <!-- Tamaño de Fuente -->
          <div class="accessibility-option">
            <label class="option-label">
              <span class="material-symbols-outlined">format_size</span>
              <span class="option-text">{{ t.fontSize }}</span>
            </label>
            <div class="font-size-controls">
              <button @click="decreaseFontSize" class="size-btn" :aria-label="t.decreaseText">
                <span class="material-symbols-outlined">text_decrease</span>
              </button>
              <span class="size-value">{{ accessibilitySettings.fontSize }}%</span>
              <button @click="increaseFontSize" class="size-btn" :aria-label="t.increaseText">
                <span class="material-symbols-outlined">text_increase</span>
              </button>
            </div>
          </div>

          <!-- Alto Contraste -->
          <div class="accessibility-option">
            <label class="option-label">
              <span class="material-symbols-outlined">contrast</span>
              <span class="option-text">{{ t.highContrast }}</span>
              <input 
                type="checkbox" 
                v-model="accessibilitySettings.highContrast"
                @change="updateHighContrast"
                class="toggle-checkbox"
              />
            </label>
          </div>

          <!-- Reducir Movimiento -->
          <div class="accessibility-option">
            <label class="option-label">
              <span class="material-symbols-outlined">animation</span>
              <span class="option-text">{{ t.reduceMotion }}</span>
              <input 
                type="checkbox" 
                v-model="accessibilitySettings.reduceMotion"
                @change="updateReduceMotion"
                class="toggle-checkbox"
              />
            </label>
          </div>

          <!-- Lector de Pantalla -->
          <div class="accessibility-option">
            <label class="option-label">
              <span class="material-symbols-outlined">record_voice_over</span>
              <span class="option-text">{{ t.screenReader }}</span>
              <input 
                type="checkbox" 
                v-model="accessibilitySettings.screenReader"
                @change="toggleScreenReader"
                class="toggle-checkbox"
              />
            </label>
          </div>

          <button @click="resetAccessibilitySettings" class="reset-btn">
            {{ t.resetSettings }}
          </button>
        </div>
      </div>
    </div>

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

    <!-- Sección FAQ -->
    <div class="faq-section">
      <h2 class="section-title">{{ t.faqTitle }}</h2>
      <p class="faq-subtitle">{{ t.faqSubtitle }}</p>
      
      <div class="faq-container">
        <div 
          v-for="(faq, index) in faqItems" 
          :key="index"
          class="faq-item"
        >
          <button 
            @click="toggleFaq(index)"
            class="faq-question"
            :aria-expanded="openFaqIndex === index"
            :aria-controls="`faq-answer-${index}`"
          >
            <span class="faq-question-text">{{ faq.question }}</span>
            <span 
              class="material-symbols-outlined faq-icon"
              :class="{ rotated: openFaqIndex === index }"
            >
              expand_more
            </span>
          </button>
          <div 
            v-show="openFaqIndex === index"
            :id="`faq-answer-${index}`"
            class="faq-answer"
          >
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue'
import HeroBanner from '@/components/HeroBanner.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useNews } from '@/composables/useNews'

const { t } = useLanguage()
const { news, loading, error, fetchNews } = useNews()

// Estado del panel de accesibilidad
const accessibilityPanelOpen = ref(false)
const openFaqIndex = ref<number | null>(null)

// Configuración de accesibilidad
const accessibilitySettings = reactive({
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  screenReader: false
})

// Lector de pantalla
let speechSynthesis: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null
const isReading = ref(false)

// FAQ items
const faqItems = computed(() => [
  { question: t.value.faqQuestion1, answer: t.value.faqAnswer1 },
  { question: t.value.faqQuestion2, answer: t.value.faqAnswer2 },
  { question: t.value.faqQuestion3, answer: t.value.faqAnswer3 },
  { question: t.value.faqQuestion4, answer: t.value.faqAnswer4 },
  { question: t.value.faqQuestion5, answer: t.value.faqAnswer5 },
  { question: t.value.faqQuestion6, answer: t.value.faqAnswer6 },
  { question: t.value.faqQuestion7, answer: t.value.faqAnswer7 }
])

// Cargar configuraciones guardadas
const loadAccessibilitySettings = () => {
  const savedFontSize = localStorage.getItem('accessibility-fontSize')
  const savedHighContrast = localStorage.getItem('accessibility-highContrast')
  const savedReduceMotion = localStorage.getItem('accessibility-reduceMotion')

  if (savedFontSize) {
    accessibilitySettings.fontSize = parseInt(savedFontSize)
    updateFontSize()
  }

  if (savedHighContrast === 'true') {
    accessibilitySettings.highContrast = true
    updateHighContrast()
  }

  if (savedReduceMotion === 'true') {
    accessibilitySettings.reduceMotion = true
    updateReduceMotion()
  }

  // No cargar screenReader automáticamente, debe activarse manualmente
}

// Funciones de accesibilidad
const toggleAccessibilityPanel = () => {
  accessibilityPanelOpen.value = !accessibilityPanelOpen.value
}

const increaseFontSize = () => {
  if (accessibilitySettings.fontSize < 150) {
    accessibilitySettings.fontSize += 10
    updateFontSize()
  }
}

const decreaseFontSize = () => {
  if (accessibilitySettings.fontSize > 80) {
    accessibilitySettings.fontSize -= 10
    updateFontSize()
  }
}

const updateFontSize = () => {
  document.documentElement.style.fontSize = `${accessibilitySettings.fontSize}%`
  localStorage.setItem('accessibility-fontSize', accessibilitySettings.fontSize.toString())
}

const updateHighContrast = () => {
  document.documentElement.classList.toggle('high-contrast', accessibilitySettings.highContrast)
  localStorage.setItem('accessibility-highContrast', accessibilitySettings.highContrast.toString())
}

const updateReduceMotion = () => {
  document.documentElement.classList.toggle('reduce-motion', accessibilitySettings.reduceMotion)
  localStorage.setItem('accessibility-reduceMotion', accessibilitySettings.reduceMotion.toString())
}

const toggleScreenReader = () => {
  if (!('speechSynthesis' in window)) {
    const message = t.value.screenReaderNotSupported || 'Tu navegador no soporta la funcionalidad de lector de pantalla.'
    alert(message)
    accessibilitySettings.screenReader = false
    return
  }

  speechSynthesis = window.speechSynthesis

  if (accessibilitySettings.screenReader) {
    // Activar modo de lectura por selección
    activateScreenReaderMode()
  } else {
    // Desactivar modo de lectura
    deactivateScreenReaderMode()
  }
  
  localStorage.setItem('accessibility-screenReader', accessibilitySettings.screenReader.toString())
}

const activateScreenReaderMode = () => {
  // Agregar listener para leer texto seleccionado al hacer doble clic
  document.addEventListener('dblclick', readSelectedText)
  // Agregar indicador visual
  document.body.style.cursor = 'text'
  document.body.setAttribute('data-screen-reader-active', 'true')
}

const deactivateScreenReaderMode = () => {
  stopScreenReader()
  document.removeEventListener('dblclick', readSelectedText)
  document.body.style.cursor = ''
  document.body.removeAttribute('data-screen-reader-active')
}

const readSelectedText = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const selectedText = selection.toString().trim()
  if (!selectedText) return

  if (!speechSynthesis) {
    speechSynthesis = window.speechSynthesis
  }

  // Detener cualquier lectura anterior
  speechSynthesis.cancel()

  currentUtterance = new SpeechSynthesisUtterance(selectedText)
  
  // Configurar el idioma según el idioma actual
  const currentLang = document.documentElement.lang || 'es-ES'
  currentUtterance.lang = currentLang === 'es' ? 'es-ES' : 'en-US'
  currentUtterance.rate = 0.9
  currentUtterance.pitch = 1
  currentUtterance.volume = 1

  currentUtterance.onstart = () => {
    isReading.value = true
  }

  currentUtterance.onend = () => {
    isReading.value = false
  }

  currentUtterance.onerror = () => {
    isReading.value = false
  }

  speechSynthesis.speak(currentUtterance)
}

const stopScreenReader = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel()
    isReading.value = false
  }
}

const resetAccessibilitySettings = () => {
  deactivateScreenReaderMode()
  
  accessibilitySettings.fontSize = 100
  accessibilitySettings.highContrast = false
  accessibilitySettings.reduceMotion = false
  accessibilitySettings.screenReader = false
  
  document.documentElement.classList.remove('high-contrast', 'reduce-motion')
  document.documentElement.style.fontSize = '100%'
  
  localStorage.removeItem('accessibility-fontSize')
  localStorage.removeItem('accessibility-highContrast')
  localStorage.removeItem('accessibility-reduceMotion')
  localStorage.removeItem('accessibility-screenReader')
}

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

// Cargar noticias y configuraciones al montar el componente
onMounted(async () => {
  await fetchNews(4) // Cargar 4 noticias
  loadAccessibilitySettings()
})

// Limpiar al desmontar
onUnmounted(() => {
  deactivateScreenReaderMode()
})
</script>

<style scoped>
.landing { 
  max-width: 1200px; 
  margin: 0 auto; 
  display: flex; 
  flex-direction: column; 
  gap: 1.25rem; 
  position: relative;
}

.news-section { 
  margin-top: .5rem; 
}

.section-title { 
  font-size: 1.25rem; 
  font-weight: 700; 
  margin: .5rem 0 .75rem; 
}

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

.news-grid { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: .75rem; 
}

@media (min-width: 640px) { 
  .news-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
}

@media (min-width: 992px) { 
  .news-grid { 
    grid-template-columns: repeat(4, 1fr); 
  } 
}

/* Panel de Accesibilidad */
.accessibility-panel {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.accessibility-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.accessibility-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.accessibility-toggle-btn:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 2px;
}

.accessibility-toggle-btn .material-symbols-outlined {
  font-size: 1.75rem;
}

.accessibility-menu {
  position: absolute;
  bottom: 4.5rem;
  right: 0;
  width: 20rem;
  max-width: calc(100vw - 2rem);
  background-color: var(--color-bg-primary);
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.accessibility-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border-bottom: 1px solid var(--color-border-light);
}

.accessibility-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  padding: 0.25rem;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn .material-symbols-outlined {
  font-size: 1.25rem;
}

.accessibility-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.accessibility-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.option-label:hover {
  background: var(--color-bg-secondary);
}

.option-label .material-symbols-outlined {
  font-size: 1.25rem;
  color: var(--color-primary);
}

.option-text {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.toggle-checkbox {
  width: 2.5rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.font-size-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.size-btn {
  padding: 0.5rem;
  background-color: var(--color-bg-primary);
  border: 2px solid var(--color-border-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.size-btn .material-symbols-outlined {
  font-size: 1.125rem;
}

.size-value {
  font-weight: 600;
  min-width: 3rem;
  text-align: center;
  color: var(--color-text-primary);
}

.reset-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
}

.reset-btn:hover {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* Sección FAQ */
.faq-section {
  margin-top: 2rem;
  padding: 2rem 1rem;
  background: var(--color-bg-secondary);
  border-radius: 16px;
}

.faq-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: background 0.2s ease;
}

.faq-question:hover {
  background: var(--color-bg-secondary);
}

.faq-question:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.faq-question-text {
  flex: 1;
  padding-right: 1rem;
}

.faq-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.5rem 1.25rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  animation: slideDown 0.3s ease;
}

.faq-answer p {
  margin: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para alto contraste */
:global(.high-contrast) .accessibility-menu,
:global(.high-contrast) .faq-item {
  border-width: 3px;
  border-color: var(--color-text-primary);
}

:global(.high-contrast) .faq-question {
  font-weight: 700;
}

:global(.high-contrast) .option-label {
  font-weight: 600;
}

/* Estilos para reducir movimiento */
:global(.reduce-motion) *,
:global(.reduce-motion) *::before,
:global(.reduce-motion) *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Estilos para screen reader activo */
:global(body[data-screen-reader-active="true"]) {
  user-select: text;
}

:global(body[data-screen-reader-active="true"] *) {
  cursor: text !important;
}

/* Responsive */
@media (max-width: 768px) {
  .accessibility-panel {
    bottom: 1rem;
    right: 1rem;
  }

  .accessibility-menu {
    width: calc(100vw - 2rem);
    max-width: 20rem;
  }

  .faq-section {
    padding: 1.5rem 0.75rem;
  }

  .faq-question {
    padding: 1rem;
    font-size: 0.9375rem;
  }

  .faq-answer {
    padding: 0 1rem 1rem;
  }
}
</style>
