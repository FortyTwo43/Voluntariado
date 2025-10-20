<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="material-symbols-outlined sidebar-logo">diversity_3</span>
      <h1 class="sidebar-title">Voluntariado Juvenil</h1>
    </div>

    <nav class="sidebar-nav">
  <RouterLink to="/app" class="nav-item nav-item-active">
        <span class="material-symbols-outlined">home</span>
        <span>{{ t.home }}</span>
      </RouterLink>

      <!-- Proyectos -->
      <div>
        <button @click="toggle('proyectos')" class="nav-item nav-button">
          <div class="nav-item-content">
            <span class="material-symbols-outlined">folder</span>
            <span>{{ t.projects }}</span>
          </div>
          <span class="material-symbols-outlined">{{ openSections.proyectos ? 'expand_less' : 'expand_more' }}</span>
        </button>
        <div v-show="openSections.proyectos" class="submenu">
          <RouterLink to="/app/proyectos" class="submenu-item">{{ t.explore }}</RouterLink>
          <RouterLink to="/postulaciones" class="submenu-item">{{ t.myApplications }}</RouterLink>
        </div>
      </div>

  <RouterLink to="/app/organizaciones" class="nav-item">
        <span class="material-symbols-outlined">groups</span>
        <span>{{ t.organizations }}</span>
      </RouterLink>

  <RouterLink to="/app/perfil" class="nav-item">
        <span class="material-symbols-outlined">person</span>
        <span>{{ t.profile }}</span>
      </RouterLink>

  <RouterLink to="/app/mensajes" class="nav-item">
        <span class="material-symbols-outlined">mail</span>
        <span>{{ t.messages }}</span>
      </RouterLink>

      <!-- Accesibilidad -->
      <div>
        <button @click="toggle('accesibilidad')" class="nav-item nav-button">
          <div class="nav-item-content">
            <span class="material-symbols-outlined">accessibility_new</span>
            <span>{{ t.accessibility }}</span>
          </div>
          <span class="material-symbols-outlined">{{ openSections.accesibilidad ? 'expand_less' : 'expand_more' }}</span>
        </button>

        <div v-show="openSections.accesibilidad" class="submenu">
          <label class="accessibility-option">
            <span>{{ t.darkMode }}</span>
            <input type="checkbox" v-model="darkMode" />
          </label>
        </div>
      </div>

  <RouterLink to="/app/configuracion" class="nav-item">
        <span class="material-symbols-outlined">settings</span>
        <span>{{ t.settings }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <RouterLink to="/ayuda" class="nav-item">
        <span class="material-symbols-outlined">help_outline</span>
        <span>{{ t.help }}</span>
      </RouterLink>
      <RouterLink to="/logout" class="nav-item nav-item-danger">
        <span class="material-symbols-outlined">logout</span>
        <span>{{ t.exit }}</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const openSections = ref({
  proyectos: false,
  accesibilidad: false
})

const darkMode = ref(false)

const toggle = (section) => {
  openSections.value[section] = !openSections.value[section]
}

watch(darkMode, (value) => {
  document.documentElement.classList.toggle('dark', value)
})
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 16rem;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  height: 4rem;
}

.sidebar-logo {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: var(--color-text);
  transition: background-color 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  background-color: var(--color-background);
}

.nav-item-active {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-item-danger {
  color: var(--color-error);
}

.nav-item-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.submenu {
  padding-left: 1.5rem;
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.submenu-item:hover {
  background-color: var(--color-background);
}

.accessibility-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.accessibility-option:hover {
  background-color: var(--color-background);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
