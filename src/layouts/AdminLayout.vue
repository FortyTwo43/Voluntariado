<template>
  <div class="admin-layout">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    
    <!-- Header -->
    <header class="proyecto-header">
      <div class="header-content">
        <!-- Botón hamburguesa para móvil -->
        <button @click="toggleSidebar" class="hamburger-btn" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="@/assets/voluntariado.png" alt="Logo Voluntariado" class="logo-image" />
          </div>
          <div class="logo-text-container">
            <span class="logo-text">Plataforma Voluntariado Juvenil</span>
            <span class="logo-subtitle">Administración</span>
          </div>
        </router-link>
        <nav class="header-nav">
          <!-- Botón de dashboard -->
          <button @click="goToDashboard" class="nav-link nav-link-browse" :title="t.dashboard">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span class="nav-text">{{ t.dashboard }}</span>
          </button>
          
          <!-- Language Toggle Button -->
          <button @click="toggleLanguage" class="language-toggle-btn" :title="currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'">
            <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span class="language-text">{{ currentLanguage === 'es' ? 'ES' : 'EN' }}</span>
          </button>

          <!-- Profile Button -->
          <button @click="goToProfile" class="profile-btn" :aria-label="t.myProfile" :title="t.myProfile">
            <div class="user-avatar">
              <img v-if="userData?.foto" :src="userData.foto" :alt="userData.nombre" class="avatar-image">
              <div v-else class="avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </button>

          <!-- Logout Button -->
          <button @click="handleLogout" class="logout-btn" :aria-label="t.logout">
            <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span class="logout-text">{{ t.logout }}</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Layout con Sidebar -->
    <div class="layout-container">
      <!-- Overlay para móvil -->
      <div class="sidebar-overlay" :class="{ 'active': sidebarOpen }" @click="closeSidebar"></div>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <!-- Botón X para cerrar en móvil -->
        <button class="sidebar-close-btn" @click="closeSidebar" aria-label="Cerrar menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <nav class="sidebar-nav">
          <router-link to="/admin" exact-active-class="router-link-active" class="sidebar-link" @click="onNavClick">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span class="sidebar-text">{{ t.dashboard }}</span>
          </router-link>

          <router-link to="/admin/validacion-organizaciones" class="sidebar-link" @click="onNavClick">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="sidebar-text">{{ t.validacionOrganizaciones }}</span>
          </router-link>

          <router-link to="/admin/gestion-proyectos" class="sidebar-link" @click="onNavClick">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span class="sidebar-text">{{ t.gestionProyectos }}</span>
          </router-link>

          <router-link to="/admin/reportes-estadisticas" class="sidebar-link" @click="onNavClick">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="sidebar-text">{{ t.reportesEstadisticas }}</span>
          </router-link>

          <router-link to="/admin/eliminar-usuario-inactivo" class="sidebar-link" @click="onNavClick">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="sidebar-text">{{ t.eliminarUsuarioInactivo }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main id="main-content" class="main-content">
        <slot />
        <router-view />
      </main>
    </div>

    <!-- Footer -->
    <footer class="proyecto-footer">
      <div class="footer-content">
        <!-- Información Institucional -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t.institutionalInfo }}</h3>
          <ul class="footer-links-list">
            <li>
              <router-link to="/informacion" class="footer-link">
                <span class="material-symbols-outlined">info</span>
                {{ t.institutionalInfo }}
              </router-link>
            </li>
            <li>
              <router-link to="/informacion" class="footer-link">
                <span class="material-symbols-outlined">groups</span>
                {{ t.mission }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Soporte y Contacto -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t.supportAndContact }}</h3>
          <ul class="footer-links-list">
            <li>
              <router-link to="/contacto" class="footer-link">
                <span class="material-symbols-outlined">mail</span>
                {{ t.contactForm }}
              </router-link>
            </li>
            <li>
              <a href="mailto:soporte@voluntariado.com" class="footer-link">
                <span class="material-symbols-outlined">support_agent</span>
                soporte@voluntariado.com
              </a>
            </li>
            <li>
              <a href="tel:+123456789" class="footer-link">
                <span class="material-symbols-outlined">phone</span>
                +1 234 567 89
              </a>
            </li>
          </ul>
        </div>

        <!-- Políticas y Términos -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t.policiesAndTerms }}</h3>
          <ul class="footer-links-list">
            <li>
              <router-link to="/politicas" class="footer-link">
                <span class="material-symbols-outlined">policy</span>
                {{ t.privacyPolicies }}
              </router-link>
            </li>
            <li>
              <router-link to="/politicas" class="footer-link">
                <span class="material-symbols-outlined">gavel</span>
                {{ t.terms }}
              </router-link>
            </li>
            <li>
              <router-link to="/politicas" class="footer-link">
                <span class="material-symbols-outlined">cookie</span>
                {{ t.cookies }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Redes Sociales -->
        <div class="footer-section">
          <h3 class="footer-title">{{ t.followUs }}</h3>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter" title="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <p class="copyright">
            © 2024 {{ t.platformName }}.<br/>
            {{ t.allRightsReserved }}.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter } from 'vue-router'
import { clearUserSession } from '@/services/authService'

const { t, currentLanguage, changeLanguage } = useLanguage()
const router = useRouter()

const userData = ref<any>(null)
const sidebarOpen = ref(true)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userData.value = JSON.parse(storedUser)
  }
  
  // En móviles y tablets, cerrar sidebar por defecto
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  } else {
    // En desktop, siempre abierto
    sidebarOpen.value = true
  }
})

const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'es' ? 'en' : 'es'
  changeLanguage(newLang)
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  // Solo cerrar en móvil
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const onNavClick = () => {
  // Cerrar sidebar automáticamente al hacer clic en una opción en móvil
  closeSidebar()
}

const goToDashboard = () => {
  router.push('/admin')
}

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = () => {
  try {
    clearUserSession()
  } catch (e) {
    // ignore storage errors
  }
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/fondoHome.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  position: relative;
}

.admin-layout::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  pointer-events: none;
  z-index: 0;
}

.layout-container,
.proyecto-footer {
  position: relative;
  z-index: 1;
}

.layout-container {
  padding-top: 80px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus-visible {
  left: 1rem;
  top: 1rem;
  width: auto;
  height: auto;
  padding: .5rem .75rem;
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  z-index: 1000;
}

/* Header */
.proyecto-header {
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(1rem, 5vw, 2rem);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(0.75rem, 3vw, 2rem);
}

/* Botón hamburguesa para móvil */
.hamburger-btn {
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  padding: 0.625rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.hamburger-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}

.logo {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: clamp(0.25rem, 1vw, 0.5rem);
  border-radius: 12px;
  min-width: fit-content;
}

.logo:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: clamp(2.5rem, 8vw, 3rem);
  height: clamp(2.5rem, 8vw, 3rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-icon .material-symbols-outlined {
  font-size: clamp(1.5rem, 5vw, 2rem);
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.logo-text {
  font-size: clamp(0.9rem, 2.5vw, 1.5rem);
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

.logo-subtitle {
  font-size: clamp(0.65rem, 1.5vw, 0.875rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: clamp(0.375rem, 1.5vw, 0.5rem);
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.75rem, 2vw, 1.25rem);
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: clamp(0.75rem, 2vw, 0.9375rem);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-link-browse {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.nav-link-browse:hover {
  background: rgba(255, 255, 255, 0.25);
}

.nav-icon {
  width: clamp(0.9rem, 2vw, 1.125rem);
  height: clamp(0.9rem, 2vw, 1.125rem);
  flex-shrink: 0;
}

/* Language Toggle Button */
.language-toggle-btn {
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 1vw, 0.375rem);
  padding: clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.65rem, 2vw, 1rem);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: clamp(0.7rem, 1.5vw, 0.875rem);
  white-space: nowrap;
  flex-shrink: 0;
}

.language-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.language-icon {
  width: clamp(0.9rem, 2vw, 1.125rem);
  height: clamp(0.9rem, 2vw, 1.125rem);
  flex-shrink: 0;
}

.language-text {
  font-weight: 600;
}

/* Profile Button - Solo avatar circular */
.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  transform: translateY(-2px);
}

.user-avatar {
  width: clamp(2rem, 6vw, 2.5rem);
  height: clamp(2rem, 6vw, 2.5rem);
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.profile-btn:hover .user-avatar {
  border-width: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

.avatar-placeholder svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Logout Button */
.logout-btn {
  display: flex;
  align-items: center;
  gap: clamp(0.375rem, 1.5vw, 0.5rem);
  padding: clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.65rem, 2vw, 1rem);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.15);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(0.7rem, 1.5vw, 0.875rem);
  white-space: nowrap;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logout-icon {
  width: clamp(0.9rem, 2vw, 1.125rem);
  height: clamp(0.9rem, 2vw, 1.125rem);
  flex-shrink: 0;
}

.logout-text {
  font-weight: 600;
}

/* Layout Container */
.layout-container {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100%;
  position: relative;
}

/* Overlay para móvil */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.sidebar-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 2px solid #e8f5ed;
  transition: transform 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  z-index: 101;
  padding-top: 90px;
}

/* Botón de cerrar sidebar (solo móvil) */
.sidebar-close-btn {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(118, 75, 162, 0.1);
  border: 2px solid #764ba2;
  border-radius: 8px;
  color: #764ba2;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  z-index: 10;
}

.sidebar-close-btn:hover {
  background: #764ba2;
  color: white;
  transform: rotate(90deg);
}

.sidebar-close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}

.sidebar-toggle {
  display: none;
  width: 100%;
  padding: 1rem;
  background: #f3eeff;
  border: none;
  border-bottom: 2px solid #e8f5ed;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar-toggle:hover {
  background: #e8f5ed;
}

.sidebar-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #764ba2;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: #5a5a5a;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.sidebar-link:hover {
  background: #f3eeff;
  color: #764ba2;
  transform: translateX(4px);
}

.sidebar-link.router-link-active {
  background: #764ba2;
  color: white;
  border-color: #667eea;
}

.sidebar-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.sidebar-text {
  flex: 1;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: clamp(1rem, 3vw, 2rem);
  overflow-x: hidden;
  width: calc(100% - 280px);
}

/* Footer */
.proyecto-footer {
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  color: var(--color-text-light);
  border-top: 4px solid var(--color-secondary);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-light);
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--color-secondary);
  padding-bottom: 0.5rem;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.375rem 0;
  font-size: 0.9375rem;
}

.footer-link:hover {
  color: var(--color-secondary);
  transform: translateX(4px);
}

.footer-link .material-symbols-outlined {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--color-text-light);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.social-link:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(121, 201, 158, 0.4);
}

.social-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.copyright {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .main-content {
    margin-left: 240px;
    width: calc(100% - 240px);
  }

  .header-content {
    gap: clamp(0.5rem, 2vw, 1.5rem);
  }

  .logo-text {
    font-size: clamp(0.85rem, 2vw, 1.25rem);
  }

  .nav-link {
    padding: clamp(0.45rem, 1.5vw, 0.6rem) clamp(0.6rem, 1.5vw, 1rem);
    font-size: clamp(0.7rem, 1.5vw, 0.85rem);
  }
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* Mostrar botón hamburguesa */
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mostrar overlay cuando sidebar está abierto */
  .sidebar-overlay {
    display: block;
  }

  /* Sidebar ocupa toda la pantalla en móvil (usar top/bottom para cubrir UI móviles) */
  .sidebar {
    width: 100%;
    max-width: 320px;
    transform: translateX(-100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    /* usar top/bottom en lugar de height:100vh para evitar gaps en mobile browsers */
    top: 0;
    bottom: 0;
    height: auto;
    padding-top: 4rem;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1.5rem);
    overflow-y: auto;
    /* asegurar que el sidebar esté por encima de indicadores flotantes */
    z-index: 1100;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  /* Mostrar botón X en móvil */
  .sidebar-close-btn {
    display: block;
  }

  /* Sidebar nav ocupa todo el espacio disponible */
  .sidebar-nav {
    /* ocupar todo el espacio restante dentro del aside */
    min-height: calc(100% - 5rem);
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 2rem);
  }

  /* Main content ocupa todo el ancho en móvil */
  .main-content {
    margin-left: 0;
    width: 100%;
  }

  /* Header ajustado */
  .proyecto-header {
    padding: 0.75rem 1rem;
  }
  
  .header-content {
    gap: 0.75rem;
  }

  .logo {
    flex: 1;
    justify-content: center;
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 0.95rem;
  }

  .logo-subtitle {
    font-size: 0.7rem;
  }
  
  .header-nav {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }

  .nav-link {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .proyecto-footer {
    padding: 2rem 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    text-align: left;
  }

  .social-links {
    justify-content: center;
  }

  .logout-text {
    display: none;
  }

  .language-toggle-btn {
    font-size: 0.7rem;
    padding: 0.5rem 0.65rem;
  }

  .language-text {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-nav {
    gap: 0.4rem;
  }

  .nav-link {
    padding: 0.45rem 0.6rem;
    font-size: 0.7rem;
  }

  .language-toggle-btn {
    padding: 0.45rem 0.6rem;
    font-size: 0.65rem;
  }

  .user-avatar {
    width: 2rem;
    height: 2rem;
  }
}

@media (max-width: 480px) {
  .logo-text-container {
    display: none;
  }

  .logo-icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  .header-nav {
    gap: 0.35rem;
  }

  .nav-link {
    padding: 0.4rem 0.5rem;
  }

  .language-toggle-btn {
    padding: 0.4rem 0.5rem;
  }

  .user-avatar {
    width: 1.85rem;
    height: 1.85rem;
  }
}
</style>
