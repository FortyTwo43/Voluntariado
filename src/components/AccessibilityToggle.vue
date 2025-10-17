<template>
  <div class="accessibility-toggle">
    <button @click="togglePanel" class="toggle-btn" title="Opciones de accesibilidad">
      <span class="material-symbols-outlined">accessibility_new</span>
    </button>

    <div v-show="isOpen" class="accessibility-panel">
      <div class="panel-header">
        <h3>Accesibilidad</h3>
        <button @click="togglePanel" class="close-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="panel-content">
        <div class="option-group">
          <label class="option-label">
            <span class="option-text">Modo oscuro</span>
            <input 
              type="checkbox" 
              v-model="settings.darkMode" 
              @change="updateDarkMode"
              class="toggle-checkbox"
            />
          </label>
        </div>

        <div class="option-group">
          <label class="option-label">
            <span class="option-text">Tamaño de fuente</span>
          </label>
          <div class="font-size-controls">
            <button @click="decreaseFontSize" class="size-btn">A-</button>
            <span class="size-value">{{ settings.fontSize }}%</span>
            <button @click="increaseFontSize" class="size-btn">A+</button>
          </div>
        </div>

        <div class="option-group">
          <label class="option-label">
            <span class="option-text">Alto contraste</span>
            <input 
              type="checkbox" 
              v-model="settings.highContrast"
              @change="updateHighContrast"
              class="toggle-checkbox"
            />
          </label>
        </div>

        <div class="option-group">
          <label class="option-label">
            <span class="option-text">Reducir movimiento</span>
            <input 
              type="checkbox" 
              v-model="settings.reduceMotion"
              @change="updateReduceMotion"
              class="toggle-checkbox"
            />
          </label>
        </div>

        <button @click="resetSettings" class="reset-btn">
          Restablecer configuración
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isOpen = ref(false)

const settings = reactive({
  darkMode: false,
  fontSize: 100,
  highContrast: false,
  reduceMotion: false
})

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const updateDarkMode = () => {
  document.documentElement.classList.toggle('dark', settings.darkMode)
  localStorage.setItem('darkMode', settings.darkMode)
}

const increaseFontSize = () => {
  if (settings.fontSize < 150) {
    settings.fontSize += 10
    updateFontSize()
  }
}

const decreaseFontSize = () => {
  if (settings.fontSize > 80) {
    settings.fontSize -= 10
    updateFontSize()
  }
}

const updateFontSize = () => {
  document.documentElement.style.fontSize = `${settings.fontSize}%`
  localStorage.setItem('fontSize', settings.fontSize)
}

const updateHighContrast = () => {
  document.documentElement.classList.toggle('high-contrast', settings.highContrast)
  localStorage.setItem('highContrast', settings.highContrast)
}

const updateReduceMotion = () => {
  document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion)
  localStorage.setItem('reduceMotion', settings.reduceMotion)
}

const resetSettings = () => {
  settings.darkMode = false
  settings.fontSize = 100
  settings.highContrast = false
  settings.reduceMotion = false
  
  document.documentElement.classList.remove('dark', 'high-contrast', 'reduce-motion')
  document.documentElement.style.fontSize = '100%'
  
  localStorage.removeItem('darkMode')
  localStorage.removeItem('fontSize')
  localStorage.removeItem('highContrast')
  localStorage.removeItem('reduceMotion')
}
</script>

<style scoped>
.accessibility-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.toggle-btn:hover {
  transform: scale(1.05);
}

.toggle-btn .material-symbols-outlined {
  font-size: 1.75rem;
}

.accessibility-panel {
  position: absolute;
  bottom: 4.5rem;
  right: 0;
  width: 20rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.panel-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  padding: 0.25rem;
  color: var(--color-text-secondary);
}

.close-btn:hover {
  color: var(--color-text);
}

.panel-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.option-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.toggle-checkbox {
  width: 2.5rem;
  height: 1.25rem;
  cursor: pointer;
}

.font-size-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.size-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-weight: 600;
}

.size-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.size-value {
  font-weight: 600;
  min-width: 3rem;
  text-align: center;
}

.reset-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.reset-btn:hover {
  background-color: var(--color-error);
  color: white;
  border-color: var(--color-error);
}
</style>
