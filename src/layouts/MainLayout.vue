<template>
  <div class="main-layout">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span class="brand-text">Plataforma de Voluntariado</span>
        </div>
        
        <div class="navbar-nav">
          <router-link to="/dashboard" class="nav-link">Inicio</router-link>
          <router-link to="/opportunities" class="nav-link">Oportunidades</router-link>
          <router-link to="/profile" class="nav-link active">Mi Perfil</router-link>
        </div>
        
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
    </nav>
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const userData = ref<any>(null);

onMounted(() => {
  // Cargar datos del usuario desde localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    userData.value = JSON.parse(storedUser);
  }
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f9fafb;
}

.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
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
  width: 2rem;
  height: 2rem;
  color: #4f46e5;
}

.logo svg {
  width: 100%;
  height: 100%;
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
