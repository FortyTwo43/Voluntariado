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
  padding: 0.5rem 1rem;
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
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  margin-bottom: -1%;
  margin-top: -1%;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.navbar-nav {
  display: flex;
  gap: 2rem;

}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s;
  position: relative;
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
  gap: 1rem;
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

.navbar-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
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
  width: 1.25rem;
  height: 1.25rem;
}

.main-content {
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .navbar-nav {
    gap: 1.5rem;
  }
  
  .brand-text {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .navbar-nav {
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.875rem;
  }
}

@media (max-width: 320px) {
  .navbar {
    padding: 0.75rem;
  }
  
  .navbar-nav {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .brand-text {
    font-size: 0.875rem;
  }
}
</style>
