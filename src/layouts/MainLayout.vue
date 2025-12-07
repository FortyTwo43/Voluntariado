<template>
  <div class="main-layout">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <img src="../assets/voluntariado.png" alt="Logo Voluntariado" class="logo" />
          <span class="brand-text">Plataforma de Voluntariado Juvenil</span>
        </div>
        
        <div class="navbar-nav">
          <router-link to="/dashboard" class="nav-link">{{ t.home }}</router-link>
          <router-link to="/opportunities" class="nav-link">{{ t.explore }}</router-link>
          <router-link to="/profile" class="nav-link active">{{ t.profile }}</router-link>
        </div>
        
        <div class="navbar-actions">
          <!-- Language Toggle Button -->
          <button @click="toggleLanguage" class="language-toggle-btn" :title="currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'">
            <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="language-text">{{ currentLanguage.toUpperCase() }}</span>
          </button>
          
          <div class="navbar-user">
            <div class="user-avatar">
              <img 
                v-if="userData?.foto_perfil" 
                :src="userData.foto_perfil" 
                :alt="`Foto de ${userData?.nombre}`"
                class="avatar-image"
              />
              <div v-else class="avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLanguage } from '@/composables/useLanguage';

const { t, currentLanguage, changeLanguage } = useLanguage();

const userData = ref<any>(null);

onMounted(() => {
  // Cargar datos del usuario desde localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    userData.value = JSON.parse(storedUser);
  }
});

// Language toggle
const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'es' ? 'en' : 'es';
  changeLanguage(newLang);
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f9fafb;
}

.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem);
  position: sticky;
  top: 0px;
  z-index: 50;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  flex-wrap: wrap;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  min-width: fit-content;
}

.logo {
  width: clamp(2.5rem, 8vw, 3.5rem);
  height: clamp(2.5rem, 8vw, 3.5rem);
  object-fit: contain;
  margin-bottom: -1%;
  margin-top: -1%;
  flex-shrink: 0;
}

.brand-text {
  font-size: clamp(0.875rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: #1f2937;
  word-wrap: break-word;
}

.navbar-nav {
  display: flex;
  gap: clamp(0.75rem, 3vw, 2rem);
  flex-wrap: wrap;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: clamp(0.375rem, 1vw, 0.5rem) 0;
  transition: color 0.2s;
  position: relative;
  font-size: clamp(0.875rem, 2vw, 1rem);
  white-space: nowrap;
}

.nav-link:hover {
  color: #4f46e5;
}

.nav-link.active {
  color: #1f2937;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #4f46e5;
  border-radius: 1px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  flex-wrap: wrap;
}

/* Language Toggle Button */
.language-toggle-btn {
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 1vw, 0.375rem);
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.875rem);
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 0.375rem;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  white-space: nowrap;
  flex-shrink: 0;
}

.language-toggle-btn:hover {
  background: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}

.language-icon {
  width: clamp(0.9rem, 2vw, 1.125rem);
  height: clamp(0.9rem, 2vw, 1.125rem);
  flex-shrink: 0;
}

.language-text {
  font-weight: 600;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: clamp(2rem, 6vw, 2.5rem);
  height: clamp(2rem, 6vw, 2.5rem);
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.avatar-placeholder svg {
  width: clamp(1rem, 2vw, 1.25rem);
  height: clamp(1rem, 2vw, 1.25rem);
}

.main-content {
  min-height: calc(100vh - 80px);
}

@media (max-width: 1024px) {
  .navbar-content {
    gap: clamp(0.5rem, 2vw, 1rem);
  }

  .navbar-nav {
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }

  .brand-text {
    font-size: clamp(0.875rem, 2vw, 1.1rem);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: clamp(0.75rem, 2vw, 1rem);
  }
  
  .navbar-content {
    flex-direction: column;
    gap: clamp(0.75rem, 2vw, 1rem);
    justify-content: center;
  }

  .navbar-brand {
    width: 100%;
    justify-content: center;
  }
  
  .navbar-nav {
    width: 100%;
    justify-content: center;
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }
  
  .brand-text {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
  }

  .navbar-actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .navbar-nav {
    gap: clamp(0.5rem, 1.5vw, 1rem);
    flex-wrap: wrap;
  }
  
  .nav-link {
    font-size: clamp(0.8rem, 2vw, 0.875rem);
  }

  .language-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }

  .logo {
    width: clamp(2rem, 8vw, 2.5rem);
    height: clamp(2rem, 8vw, 2.5rem);
  }

  .navbar-nav {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    width: 100%;
  }
  
  .brand-text {
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }

  .user-avatar {
    width: clamp(1.75rem, 6vw, 2rem);
    height: clamp(1.75rem, 6vw, 2rem);
  }
}
</style>
