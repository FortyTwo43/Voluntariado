<template>
  <div class="sidebar-wrapper" @mouseenter="openSidebar" @mouseleave="closeSidebar">
    <!-- Toggle button -->
    <button 
      class="sidebar-toggle" 
      @click="toggleSidebar"
      :aria-label="isExpanded ? t.closeMenu : t.openMenu"
      :aria-expanded="isExpanded"
    >
      <span class="material-symbols-outlined">menu</span>
    </button>

    <!-- Sidebar -->
    <aside 
      class="sidebar" 
      :class="{ 'expanded': isExpanded }"
      role="navigation"
      aria-label="Menú de navegación lateral"
    >
      <!-- Header del sidebar -->
      <div class="sidebar-header">
        <div class="logo-sidebar">
          <!-- <img src="@/assets/voluntariado.png" alt="Logo" class="logo-img" /> -->
          <!-- <span v-if="isExpanded" class="logo-title">{{ t.platformName }}</span> -->
        </div>
      </div>

      <!-- Current page indicator -->
      <div v-if="isExpanded" class="current-page-indicator">
        <span class="material-symbols-outlined">location_on</span>
        <span class="current-page-text">{{ currentPageName }}</span>
      </div>

      <nav class="sidebar-nav">
        <!-- Main menu items -->
        <div class="menu-section">
          <h3 v-if="isExpanded" class="section-title">{{ t.mainMenu }}</h3>
          
          <router-link to="/" class="menu-item" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">home</span>
            <span v-if="isExpanded" class="menu-text">{{ t.home }}</span>
          </router-link>

          <router-link to="/informacion" class="menu-item" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">info</span>
            <span v-if="isExpanded" class="menu-text">{{ t.institutionalInfo }}</span>
          </router-link>
        </div>

        <!-- Accessibility submenu -->
        <div class="menu-section">
          <button 
            v-if="isExpanded" 
            class="section-toggle"
            @click="toggleAccessibility"
            :aria-expanded="accessibilityOpen"
          >
            <span class="material-symbols-outlined">accessibility</span>
            <span class="section-title">{{ t.accessibilityMenu }}</span>
            <span class="material-symbols-outlined expand-icon" :class="{ rotated: accessibilityOpen }">
              expand_more
            </span>
          </button>
          <div v-else class="menu-item">
            <span class="material-symbols-outlined">accessibility</span>
          </div>

          <div v-if="isExpanded && accessibilityOpen" class="submenu">
            <button class="submenu-item" @click="increaseFontSize">
              <span class="material-symbols-outlined">text_increase</span>
              <span class="menu-text">{{ t.increaseText }}</span>
            </button>
            <button class="submenu-item" @click="decreaseFontSize">
              <span class="material-symbols-outlined">text_decrease</span>
              <span class="menu-text">{{ t.decreaseText }}</span>
            </button>
            <button class="submenu-item" @click="toggleHighContrast">
              <span class="material-symbols-outlined">contrast</span>
              <span class="menu-text">{{ t.highContrastMode }}</span>
            </button>
            <button class="submenu-item" @click="toggleScreenReader">
              <span class="material-symbols-outlined">record_voice_over</span>
              <span class="menu-text">{{ t.screenReader }}</span>
            </button>
          </div>
        </div>

        <!-- Quick actions / Shortcuts -->
        <div class="menu-section">
          <h3 v-if="isExpanded" class="section-title">{{ t.quickActions }}</h3>
          
          <router-link to="/registro" class="menu-item accent" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">person_add</span>
            <span v-if="isExpanded" class="menu-text">{{ t.ctaRegister }}</span>
            <kbd v-if="isExpanded" class="shortcut-key">Ctrl+R</kbd>
          </router-link>

          <router-link to="/login" class="menu-item accent" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">login</span>
            <span v-if="isExpanded" class="menu-text">{{ t.signIn }}</span>
            <kbd v-if="isExpanded" class="shortcut-key">Ctrl+L</kbd>
          </router-link>
        </div>

        <!-- Support submenu -->
        <div class="menu-section">
          <button 
            v-if="isExpanded" 
            class="section-toggle"
            @click="toggleSupport"
            :aria-expanded="supportOpen"
          >
            <span class="material-symbols-outlined">support_agent</span>
            <span class="section-title">{{ t.supportMenu }}</span>
            <span class="material-symbols-outlined expand-icon" :class="{ rotated: supportOpen }">
              expand_more
            </span>
          </button>
          <div v-else class="menu-item">
            <span class="material-symbols-outlined">support_agent</span>
          </div>

          <div v-if="isExpanded && supportOpen" class="submenu">
            <router-link to="/contacto" class="submenu-item" @click="closeSidebarOnMobile">
              <span class="material-symbols-outlined">mail</span>
              <span class="menu-text">{{ t.contactForm }}</span>
            </router-link>
            <a href="mailto:soporte@voluntariado.com" class="submenu-item">
              <span class="material-symbols-outlined">email</span>
              <span class="menu-text">{{ t.emailSupport }}</span>
            </a>
            <a href="tel:+123456789" class="submenu-item">
              <span class="material-symbols-outlined">call</span>
              <span class="menu-text">{{ t.callUs }}</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Footer del sidebar -->
      <div v-if="isExpanded" class="sidebar-footer">
        <div class="footer-links">
          <router-link to="/politicas" class="footer-link" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">policy</span>
            <span class="menu-text">{{ t.policies }}</span>
          </router-link>
          <router-link to="/politicas" class="footer-link" @click="closeSidebarOnMobile">
            <span class="material-symbols-outlined">gavel</span>
            <span class="menu-text">{{ t.termsOfUse }}</span>
          </router-link>
        </div>
      </div>
    </aside>

    <!-- Overlay para móvil -->
    <div 
      v-if="isExpanded && isMobile" 
      class="sidebar-overlay"
      @click="closeSidebar"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const { t } = useLanguage()
const isExpanded = ref(false)
const accessibilityOpen = ref(false)
const supportOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const screenReaderActive = ref(false)

// Lector de pantalla
let speechSynthesis: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null

// Computed
const currentPageName = computed(() => {
  const routeNames: Record<string, string> = {
    'home': t.value.home,
    'proyectos': t.value.projects,
    'institutional': t.value.institutionalInfo,
    'contact': t.value.support,
    'policies': t.value.terms,
    'UserLogin': t.value.signIn,
    'registration': t.value.ctaRegister,
    'RegistroVoluntario': `${t.value.ctaRegister} - ${t.value.volunteer}`,
    'RegisterOrganization': `${t.value.ctaRegister} - ${t.value.organizationTitle}`,
    'projects': t.value.projects,
    'proyectos-crear': t.value.createProject,
    'proyectos-detalle': t.value.projectDetail,
    'proyectos-asistencia': t.value.viewAttendance,
    'proyectos-horas': t.value.viewHours
  }
  return routeNames[route.name as string] || t.value.platformName
})

// Methods
const openSidebar = () => {
  if (!isMobile.value) {
    isExpanded.value = true
  }
}

const closeSidebar = () => {
  if (!isMobile.value) {
    isExpanded.value = false
    accessibilityOpen.value = false
    supportOpen.value = false
  }
}

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    closeSidebar()
    isExpanded.value = false
  }
}

const toggleAccessibility = () => {
  accessibilityOpen.value = !accessibilityOpen.value
}

const toggleSupport = () => {
  supportOpen.value = !supportOpen.value
}

// Accessibility actions
const increaseFontSize = () => {
  const root = document.documentElement
  const currentSize = parseFloat(getComputedStyle(root).fontSize)
  root.style.fontSize = `${Math.min(currentSize + 2, 24)}px`
}

const decreaseFontSize = () => {
  const root = document.documentElement
  const currentSize = parseFloat(getComputedStyle(root).fontSize)
  root.style.fontSize = `${Math.max(currentSize - 2, 12)}px`
}

const toggleHighContrast = () => {
  document.body.classList.toggle('high-contrast')
}

const toggleScreenReader = () => {
  if (!('speechSynthesis' in window)) {
    const message = t.value.screenReaderNotSupported || 'Tu navegador no soporta la funcionalidad de lector de pantalla.'
    alert(message)
    screenReaderActive.value = false
    return
  }

  speechSynthesis = window.speechSynthesis

  if (screenReaderActive.value) {
    // Desactivar modo de lectura
    deactivateScreenReaderMode()
  } else {
    // Activar modo de lectura por selección
    activateScreenReaderMode()
  }
}

const activateScreenReaderMode = () => {
  screenReaderActive.value = true
  // Agregar listener para leer texto seleccionado al hacer doble clic
  document.addEventListener('dblclick', readSelectedText)
  // Agregar indicador visual
  document.body.style.cursor = 'text'
  document.body.setAttribute('data-screen-reader-active', 'true')
}

const deactivateScreenReaderMode = () => {
  screenReaderActive.value = false
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

  currentUtterance.onerror = () => {
    // Manejo de errores silencioso
  }

  speechSynthesis.speak(currentUtterance)
}

const stopScreenReader = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel()
  }
}

// Keyboard shortcuts
const handleKeyboard = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      window.location.href = '/registro'
    }
    if (e.key === 'l' || e.key === 'L') {
      e.preventDefault()
      window.location.href = '/login'
    }
  }
}

// Resize handler
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value && isExpanded.value) {
    // En desktop, cerrar cuando se hace resize
    isExpanded.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  window.removeEventListener('resize', handleResize)
  deactivateScreenReaderMode()
})
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: 5.5rem; /* Comienza después del header */
  left: 0;
  z-index: 95;
  height: calc(100vh - 5.5rem); /* Ajusta la altura para que no cubra el header */
}

.sidebar-toggle {
  position: fixed;
  top: calc(5.5rem + 1rem);
  left: 1rem;
  width: 3rem;
  height: 3rem;
  background: white;
  color: #667eea;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 95;
}

.sidebar-toggle:hover {
  background: #f3f4f6;
  border-color: #667eea;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
}

.sidebar-toggle .material-symbols-outlined {
  font-size: 1.5rem;
}

.sidebar {
  position: fixed;
  top: 5.5rem; /* Comienza después del header */
  left: -280px;
  width: 280px;
  height: calc(100vh - 5.5rem); /* Altura ajustada */
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 95;
}

.sidebar.expanded {
  left: 0;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0rem;
}

.logo-sidebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.52rem;
}

.logo-img {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  border-radius: 8px;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-light);
}

.current-page-indicator {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.current-page-indicator .material-symbols-outlined {
  color: var(--color-secondary);
  font-size: 1.25rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem 1rem;
  margin: 0;
}

.section-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
}

.section-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.expand-icon {
  margin-left: auto;
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: var(--color-text-light);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: var(--color-secondary);
}

.menu-item.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  border-left-color: var(--color-secondary);
  font-weight: 600;
}

.menu-item.accent {
  background: rgba(121, 201, 158, 0.15);
  border-left-color: var(--color-secondary);
}

.menu-item.accent:hover {
  background: rgba(121, 201, 158, 0.25);
}

.menu-item .material-symbols-outlined {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
}

.shortcut-key {
  padding: 0.125rem 0.375rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 600;
}

.submenu {
  padding-left: 1rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0 0.5rem 1rem;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  font-size: 0.875rem;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-light);
}

.submenu-item .material-symbols-outlined {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.footer-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-light);
}

.footer-link .material-symbols-outlined {
  font-size: 1.125rem;
}

.sidebar-overlay {
  position: fixed;
  top: 5.5rem; /* Comienza después del header */
  left: 0;
  width: 100vw;
  height: calc(100vh - 5.5rem);
  background: rgba(0, 0, 0, 0.5);
  z-index: 94; /* Debajo del sidebar */
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    left: -100%;
  }
}
</style>
