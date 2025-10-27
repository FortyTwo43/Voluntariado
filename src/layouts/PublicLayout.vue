<template>
  <div class="public-layout">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    
    <!-- Header -->
    <header class="public-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="@/assets/voluntariado.png" alt="Logo Voluntariado" class="logo-image" />
          </div>
          <span class="logo-text">Plataforma de Voluntariado Juvenil</span>
        </router-link>
        <nav class="header-nav">
          <router-link to="/proyectos-view" class="nav-link">{{ t.ctaBrowse }}</router-link>
          
          <!-- Dropdown menu con hover -->
          <div class="nav-item has-dropdown" 
               @mouseenter="openInfoDropdown" 
               @mouseleave="closeInfoDropdown"
               @focusin="openInfoDropdown" 
               @focusout="closeInfoDropdown">
            <button class="nav-link dropdown-trigger" 
                    aria-haspopup="menu"
                    :aria-expanded="infoDropdownOpen"
                    @click="toggleInfoDropdown">
              {{ t.institutionalInfo }}
              <span class="material-symbols-outlined dropdown-icon">expand_more</span>
            </button>
            <div v-show="infoDropdownOpen" class="nav-dropdown" role="menu">
              <router-link to="/informacion" class="dropdown-item" role="menuitem" @click="closeInfoDropdown">
                {{ t.institutionalInfo }}
              </router-link>
              <router-link to="/politicas" class="dropdown-item" role="menuitem" @click="closeInfoDropdown">
                {{ t.terms }}
              </router-link>
              <router-link to="/contacto" class="dropdown-item" role="menuitem" @click="closeInfoDropdown">
                {{ t.support }}
              </router-link>
            </div>
          </div>
          
          <!-- Language Toggle Button -->
          <button @click="toggleLanguage" class="language-toggle-btn" :title="currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'">
            <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="language-text">{{ currentLanguage.toUpperCase() }}</span>
          </button>
          
          <router-link to="/login" class="nav-link nav-link-primary">{{ t.signIn }}</router-link>
          <router-link to="/registro" class="nav-link nav-link-cta">{{ t.ctaRegister }}</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="public-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="public-footer">
      <div class="footer-content">
        <div class="footer-left">
          <p class="copyright">
            © 2024 Plataforma de Voluntariado Juvenil. Todos los derechos reservados.
          </p>
        </div>
        <div class="footer-right">
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t, currentLanguage, changeLanguage } = useLanguage()

// Dropdown state
const infoDropdownOpen = ref(false)

const openInfoDropdown = () => {
  infoDropdownOpen.value = true
}

const closeInfoDropdown = () => {
  infoDropdownOpen.value = false
}

const toggleInfoDropdown = () => {
  infoDropdownOpen.value = !infoDropdownOpen.value
}

// Language toggle
const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'es' ? 'en' : 'es'
  changeLanguage(newLang)
}
</script>

<style scoped>
.public-layout {
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

.public-layout::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  pointer-events: none;
  z-index: 0;
}

.public-header,
.public-content,
.public-footer {
  position: relative;
  z-index: 1;
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
.public-header {
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-icon .material-symbols-outlined {
  font-size: 2rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.has-dropdown {
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-icon {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.has-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 240px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.dropdown-item.router-link-active {
  background-color: #eef2ff;
  color: var(--color-primary);
  font-weight: 600;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  font-size: 0.9375rem;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-link-primary {
  color: var(--color-primary);
}

.nav-link-primary:hover {
  background-color: #eef2ff;
  color: var(--color-primary-dark);
}

.nav-link-cta {
  background-color: var(--color-primary);
  color: white;
}

.nav-link-cta:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

/* Language Toggle Button */
.language-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 0.375rem;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.875rem;
}

.language-toggle-btn:hover {
  background: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}

.language-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.language-text {
  font-weight: 600;
}

/* Main Content */
.public-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 100%;
}

/* Footer */
.public-footer {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #9ca3af;
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--color-primary);
}

.social-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .public-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .logo-text {
    font-size: 1rem;
  }
  
  .header-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-link {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .public-content {
    padding: 1rem;
  }
  
  .public-footer {
    padding: 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
}
</style>
