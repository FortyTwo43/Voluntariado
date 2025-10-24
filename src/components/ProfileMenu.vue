<template>
  <div class="profile-menu">
    <button @click="toggleMenu" class="profile-button">
      <img 
        :src="user.avatar" 
        :alt="user.name"
        class="profile-avatar"
      />
      <div class="profile-info">
        <span class="profile-name">{{ user.name }}</span>
        <span class="profile-role">{{ user.role }}</span>
      </div>
      <span class="material-symbols-outlined">
        {{ isOpen ? 'expand_less' : 'expand_more' }}
      </span>
    </button>

    <div v-show="isOpen" class="menu-dropdown">
      <div class="menu-header">
        <img :src="user.avatar" :alt="user.name" class="menu-avatar" />
        <div>
          <p class="menu-name">{{ user.name }}</p>
          <p class="menu-email">{{ user.email }}</p>
        </div>
      </div>

      <div class="menu-divider"></div>

      <nav class="menu-nav">
        <RouterLink to="/perfil" class="menu-item" @click="toggleMenu">
          <span class="material-symbols-outlined">person</span>
          <span>Mi Perfil</span>
        </RouterLink>

        <RouterLink to="/configuracion" class="menu-item" @click="toggleMenu">
          <span class="material-symbols-outlined">settings</span>
          <span>Configuración</span>
        </RouterLink>

        <RouterLink to="/estadisticas" class="menu-item" @click="toggleMenu">
          <span class="material-symbols-outlined">analytics</span>
          <span>Estadísticas</span>
        </RouterLink>

        <RouterLink to="/insignias" class="menu-item" @click="toggleMenu">
          <span class="material-symbols-outlined">emoji_events</span>
          <span>Insignias</span>
        </RouterLink>
      </nav>

      <div class="menu-divider"></div>

      <nav class="menu-nav">
        <RouterLink to="/ayuda" class="menu-item" @click="toggleMenu">
          <span class="material-symbols-outlined">help_outline</span>
          <span>Ayuda y soporte</span>
        </RouterLink>

        <button @click="logout" class="menu-item menu-item-danger">
          <span class="material-symbols-outlined">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isOpen = ref(false)

const user = reactive({
  name: 'Alejandro García',
  email: 'alejandro@example.com',
  role: 'Voluntario',
  avatar: 'https://lh3.googleusercontent.com/a/default-user'
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const logout = () => {
  // Aquí iría la lógica de cierre de sesión
  console.log('Cerrando sesión...')
  toggleMenu()
}
</script>

<style scoped>
.profile-menu {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.profile-button:hover {
  background-color: var(--color-background);
}

.profile-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 600;
}

.profile-role {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 16rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.menu-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
}

.menu-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
}

.menu-email {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0.125rem 0 0 0;
}

.menu-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.5rem 0;
}

.menu-nav {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.menu-item:hover {
  background-color: var(--color-background);
}

.menu-item .material-symbols-outlined {
  font-size: 1.25rem;
}

.menu-item-danger {
  color: var(--color-error);
}

.menu-item-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
