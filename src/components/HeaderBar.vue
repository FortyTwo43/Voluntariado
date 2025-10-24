<template>
  <header class="header">
    <div class="header-search">
      <label class="search-container">
        <span class="material-symbols-outlined search-icon">search</span>
        <input 
          type="search" 
          :placeholder="t.searchPlaceholder" 
          class="search-input"
        />
      </label>
    </div>

    <div class="header-actions">
      <div class="language-selector">
        <span class="material-symbols-outlined">language</span>
        <button 
          @click="changeLanguage('es')" 
          :class="{ 'lang-active': currentLanguage === 'es', 'lang-inactive': currentLanguage !== 'es' }"
        >
          ES
        </button>
        <span>/</span>
        <button 
          @click="changeLanguage('en')" 
          :class="{ 'lang-active': currentLanguage === 'en', 'lang-inactive': currentLanguage !== 'en' }"
        >
          EN
        </button>
      </div>
      
      <div class="location-info">
        <span class="material-symbols-outlined">location_on</span>
        <span class="location-text">{{ currentLanguage === 'es' ? 'Madrid, ES' : 'Madrid, ES' }}</span>
      </div>

      <div class="header-user-actions">
        <button class="notification-btn">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge"></span>
        </button>

        <div class="profile-dropdown">
          <button @click="toggleProfile" class="profile-btn">
            <img class="profile-image" src="https://lh3.googleusercontent.com/a/default-user" alt="Usuario" />
          </button>
          <div v-show="profileMenu" class="dropdown-menu">
            <RouterLink to="/perfil" class="dropdown-item">
              {{ t.myProfile }}
            </RouterLink>
            <RouterLink to="/logout" class="dropdown-item dropdown-item-danger">
              {{ t.logout }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const profileMenu = ref(false)
const { currentLanguage, t, changeLanguage } = useLanguage()

const toggleProfile = () => (profileMenu.value = !profileMenu.value)
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-search {
  flex: 1;
}

.search-container {
  display: flex;
  align-items: center;
  max-width: 28rem;
  position: relative;
}

.search-icon {
  color: var(--color-text-secondary);
  position: absolute;
  left: 0.75rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.language-selector,
.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.language-selector button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-active {
  font-weight: 500;
  color: var(--color-primary);
}

.lang-inactive {
  color: var(--color-text-secondary);
}

.lang-inactive:hover {
  color: var(--color-primary);
}

.location-text {
  font-weight: 500;
}

.header-user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-btn {
  position: relative;
  padding: 0.5rem;
}

.notification-btn .material-symbols-outlined {
  font-size: 1.5rem;
  color: var(--color-text);
}

.notification-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: block;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: var(--color-secondary);
  border: 2px solid var(--color-surface);
}

.profile-dropdown {
  position: relative;
}

.profile-btn {
  padding: 0;
}

.profile-image {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 20;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-background);
}

.dropdown-item-danger {
  color: var(--color-error);
}

.dropdown-item-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
