<template>
  <header class="topbar">
    <button class="topbar-icon" aria-label="menu" @click="toggleMenu">
      <span class="material-symbols-outlined">menu</span>
    </button>
    <RouterLink to="/" class="brand">
      <span class="brand-icon material-symbols-outlined">diversity_3</span>
      <span class="brand-name">{{ t.platformName }}</span>
    </RouterLink>

    <div class="search-wrap">
      <span class="material-symbols-outlined search-icon">search</span>
      <input class="search-input" :placeholder="t.searchPlaceholder" />
    </div>

    <nav class="topbar-actions">
      <RouterLink to="/app" class="btn btn-primary">{{ t.signIn }}</RouterLink>
      <RouterLink to="/ayuda" class="btn btn-ghost">{{ t.help }}</RouterLink>
      <div class="lang-switch">
        <button @click="changeLanguage('es')" :class="{active: currentLanguage === 'es'}">ES</button>
        <span>/</span>
        <button @click="changeLanguage('en')" :class="{active: currentLanguage === 'en'}">EN</button>
      </div>
    </nav>
  </header>

  <!-- Simple dropdown menu -->
  <div v-if="dropdownOpen" class="dropdown-menu">
    <nav class="dropdown-nav">
      <RouterLink to="/" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">home</span>
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/app" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">dashboard</span>
        <span>{{ t.signIn }}</span>
      </RouterLink>
      <RouterLink to="/app/proyectos" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">folder</span>
        <span>{{ t.projects }}</span>
      </RouterLink>
      <div class="dropdown-sep"></div>
      <RouterLink to="/politicas" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">policy</span>
        <span>{{ t.terms }}</span>
      </RouterLink>
      <RouterLink to="/informacion" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">info</span>
        <span>{{ t.institutionalInfo }}</span>
      </RouterLink>
      <RouterLink to="/contacto" class="dropdown-link" @click="closeMenu">
        <span class="material-symbols-outlined">mail</span>
        <span>{{ t.support }}</span>
      </RouterLink>
      <div class="dropdown-sep"></div>
      <div class="dropdown-lang">
        <span class="material-symbols-outlined">language</span>
        <button @click="changeLanguage('es')" :class="{active: currentLanguage === 'es'}">ES</button>
        <span>/</span>
        <button @click="changeLanguage('en')" :class="{active: currentLanguage === 'en'}">EN</button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
const { t, changeLanguage, currentLanguage } = useLanguage()

const dropdownOpen = ref(false)
const toggleMenu = () => (dropdownOpen.value = !dropdownOpen.value)
const closeMenu = () => (dropdownOpen.value = false)
</script>

<style scoped>
.topbar {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  height: 64px;
  padding: 0 1rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.topbar-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 8px; }
.topbar-icon:hover { background: var(--color-background); }
.brand { display:flex; align-items:center; gap:.5rem; text-decoration:none; color:inherit; font-weight:700; }
.brand-icon { color: var(--color-primary); }
.brand-name { white-space:nowrap; }
.search-wrap { position: relative; display:none; }
.search-icon { position:absolute; left:.5rem; top:50%; transform:translateY(-50%); color: var(--color-text-secondary); }
.search-input { width:100%; padding:.5rem .75rem .5rem 2rem; border:1px solid var(--color-border); border-radius:9999px; background:var(--color-background); }
.topbar-actions { display:flex; align-items:center; gap:.5rem; }
.lang-switch { display:flex; align-items:center; gap:.25rem; }
.lang-switch button { background:none; border:none; color: var(--color-text-secondary); cursor:pointer; }
.lang-switch button.active { color: var(--color-primary); font-weight:600; }
@media (min-width: 768px) { .search-wrap{display:block;} .topbar{grid-template-columns:auto auto 1fr auto;} }

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 64px;
  left: 0;
  width: 260px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  z-index: 100;
}
.dropdown-nav { display:flex; flex-direction:column; padding:.5rem; }
.dropdown-link { display:flex; align-items:center; gap:.75rem; padding:.75rem; border-radius:8px; color:inherit; text-decoration:none; }
.dropdown-link:hover { background: var(--color-background); }
.dropdown-sep { height:1px; background: var(--color-border); margin:.5rem 0; }
.dropdown-lang { display:flex; align-items:center; gap:.25rem; padding:.5rem .75rem; color: var(--color-text-secondary); }
.dropdown-lang button { background:none; border:none; cursor:pointer; color: inherit; }
.dropdown-lang button.active { color: var(--color-primary); font-weight:600; }
</style>
