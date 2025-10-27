<template>
  <div class="proyecto-layout">
    <!-- Header con navegación y cambio de idioma -->
    <header class="proyecto-header">
      <div class="header-container">
        <div class="header-left">
          <router-link to="/" class="logo-link">
            <span class="logo-icon">🤝</span>
            <span class="logo-text">{{ t.platformName }}</span>
          </router-link>
        </div>
        
        <div class="header-right">
          <!-- Botón de cambio de idioma -->
          <button 
            class="language-toggle"
            @click="toggleLanguage"
            :title="currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'"
          >
            <span class="language-icon">🌐</span>
            <span class="language-text">{{ currentLanguage === 'es' ? 'EN' : 'ES' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="proyecto-main">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="proyecto-footer">
      <div class="footer-container">
        <div class="footer-content">
          <p class="footer-text">© 2025 {{ t.platformName }}. {{ t.allRightsReserved || 'Todos los derechos reservados' }}.</p>
          <div class="footer-links">
            <router-link to="/terminos" class="footer-link">{{ t.terms }}</router-link>
            <router-link to="/contacto" class="footer-link">{{ t.support }}</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t, currentLanguage, changeLanguage } = useLanguage()

const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'es' ? 'en' : 'es'
  changeLanguage(newLang)
}
</script>

<style scoped>
.proyecto-layout {
  min-height: 100vh;
  background: #F7F5F0;
  display: flex;
  flex-direction: column;
}

/* Header */
.proyecto-header {
  background: linear-gradient(135deg, #3a0066 0%, #4B0082 100%);
  border-bottom: 3px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.logo-link:hover {
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Botón de idioma */
.language-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.language-icon {
  font-size: 1.25rem;
}

.language-text {
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Contenido principal */
.proyecto-main {
  flex: 1;
}

/* Footer */
.proyecto-footer {
  background: linear-gradient(135deg, #3a0066 0%, #4B0082 100%);
  border-top: 3px solid #79C99E;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #79C99E;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }

  .logo-text {
    font-size: 1rem;
  }

  .language-toggle {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .footer-container {
    padding: 1.5rem 1rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}
</style>
