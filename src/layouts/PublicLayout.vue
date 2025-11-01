<template>
  <div class="public-layout">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    
    <!-- Sidebar expandible -->
    <ExpandableSidebar />
    
    <!-- Header -->
    <header class="public-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="@/assets/voluntariado.png" alt="Logo Voluntariado" class="logo-image" />
          </div>
          <div class="logo-text-container">
            <span class="logo-text">Plataforma Voluntariado Juvenil</span>
            <span class="logo-subtitle">Plataforma</span>
          </div>
        </router-link>
        <nav class="header-nav">
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

    <!-- Indicador de página actual -->
    <PageIndicator />

    <!-- Main Content -->
    <main id="main-content" class="public-content">
      <router-view />
    </main>

    <!-- Footer mejorado -->
    <footer class="public-footer">
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
            <li>
              <router-link to="/informacion" class="footer-link">
                <span class="material-symbols-outlined">visibility</span>
                {{ t.vision }}
              </router-link>
            </li>
            <li>
              <router-link to="/informacion" class="footer-link">
                <span class="material-symbols-outlined">favorite</span>
                {{ t.values }}
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
                <span class="material-symbols-outlined">call</span>
                +1 (234) 567-89
              </a>
            </li>
            <li>
              <router-link to="/contacto" class="footer-link">
                <span class="material-symbols-outlined">help</span>
                {{ t.helpCenter }}
              </router-link>
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
                {{ t.cookiePolicy }}
              </router-link>
            </li>
            <li>
              <router-link to="/politicas" class="footer-link">
                <span class="material-symbols-outlined">security</span>
                {{ t.dataSecurity }}
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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

<script setup>
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import ExpandableSidebar from '@/components/ExpandableSidebar.vue'
import PageIndicator from '@/components/PageIndicator.vue'

const { t, currentLanguage, changeLanguage } = useLanguage()

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
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  max-height: 3rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 12px;
}

.logo:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-icon .material-symbols-outlined {
  font-size: 2rem;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-link-primary {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.nav-link-primary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.nav-link-cta {
  background: white;
  color: #667eea;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-link-cta:hover {
  background: #f9fafb;
  color: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Language Toggle Button */
.language-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.875rem;
}

.language-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    text-align: left;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .logo-text-container {
    display: none;
  }

  .logo-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .header-nav {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .language-toggle-btn {
    padding: 0.5rem 0.75rem;
  }

  .language-text {
    display: none;
  }
}
</style>
