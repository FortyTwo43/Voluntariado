<template>
  <header class="topbar">
    <button class="topbar-icon only-mobile" aria-label="menu" @click="toggleMenu">
      <span class="material-symbols-outlined">menu</span>
    </button>
    <RouterLink to="/" class="brand">
      <span class="brand-icon material-symbols-outlined">diversity_3</span>
      <span class="brand-name">{{ t.platformName }}</span>
    </RouterLink>

    <!-- Desktop main navigation -->
    <nav class="main-nav only-desktop" role="navigation" aria-label="Main">
      <RouterLink to="/" class="nav-link" :class="{ active: isActive('/') }">{{ t.home }}</RouterLink>
      <div class="nav-item has-dropdown"
           @mouseenter="openInfo" @mouseleave="closeInfo"
           @focusin="openInfo" @focusout="closeInfo">
        <button class="nav-link"
                aria-haspopup="menu"
                :aria-expanded="navInfoOpen ? 'true' : 'false'"
                :aria-controls="infoMenuId"
                @click="toggleInfo">
          {{ t.institutionalInfo }}
          <span class="material-symbols-outlined caret">expand_more</span>
        </button>
        <div class="nav-dropdown" role="menu" :id="infoMenuId">
          <RouterLink to="/informacion" class="dropdown-item" :class="{ active: isActive('/informacion') }" role="menuitem" @click="closeAll">{{ t.institutionalInfo }}</RouterLink>
          <RouterLink to="/politicas" class="dropdown-item" :class="{ active: isActive('/politicas') }" role="menuitem" @click="closeAll">{{ t.terms }}</RouterLink>
          <RouterLink to="/contacto" class="dropdown-item" :class="{ active: isActive('/contacto') }" role="menuitem" @click="closeAll">{{ t.support }}</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Desktop search -->
    <div class="search-wrap only-desktop">
      <span class="material-symbols-outlined search-icon">search</span>
      <input class="search-input" :placeholder="t.searchPlaceholder" aria-label="Buscar" />
    </div>

    <nav class="topbar-actions">
      <RouterLink to="/contacto" class="btn btn-primary">{{ t.support }}</RouterLink>
      <div class="lang-switch">
        <button @click="changeLanguage('es')" :class="{active: currentLanguage === 'es'}">ES</button>
        <span>/</span>
        <button @click="changeLanguage('en')" :class="{active: currentLanguage === 'en'}">EN</button>
      </div>
    </nav>
  </header>

  <!-- Mobile simple dropdown menu -->
  <div v-if="dropdownOpen" class="dropdown-menu only-mobile">
    <nav class="dropdown-nav">
  <RouterLink to="/" class="dropdown-link" :class="{ active: isActive('/') }" @click="closeMenu">
        <span class="material-symbols-outlined">home</span>
        <span>{{ t.home }}</span>
      </RouterLink>
      <div class="dropdown-sep"></div>
  <RouterLink to="/politicas" class="dropdown-link" :class="{ active: isActive('/politicas') }" @click="closeMenu">
        <span class="material-symbols-outlined">policy</span>
        <span>{{ t.terms }}</span>
      </RouterLink>
  <RouterLink to="/informacion" class="dropdown-link" :class="{ active: isActive('/informacion') }" @click="closeMenu">
        <span class="material-symbols-outlined">info</span>
        <span>{{ t.institutionalInfo }}</span>
      </RouterLink>
  <RouterLink to="/contacto" class="dropdown-link" :class="{ active: isActive('/contacto') }" @click="closeMenu">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
const { t, changeLanguage, currentLanguage } = useLanguage()

const dropdownOpen = ref(false)
const toggleMenu = () => (dropdownOpen.value = !dropdownOpen.value)
const closeMenu = () => (dropdownOpen.value = false)

const route = useRoute()
const isActive = (path: string) => route.path === path

// Desktop dropdown state + a11y
const navInfoOpen = ref(false)
const infoMenuId = 'info-menu'
const openInfo = () => { navInfoOpen.value = true }
const closeInfo = () => { navInfoOpen.value = false }
const toggleInfo = () => { navInfoOpen.value = !navInfoOpen.value }

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    navInfoOpen.value = false
    dropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))

const closeAll = () => { dropdownOpen.value = false; navInfoOpen.value = false }
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: auto 1fr auto;
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
.main-nav { display:none; align-items:center; gap:1rem; }
.nav-link { display:flex; align-items:center; gap:.25rem; padding:.5rem .25rem; color:inherit; text-decoration:none; font-weight:600; }
.nav-link.active { color: var(--color-primary); }
.nav-item { position: relative; }
.nav-item .caret { font-size: 18px; line-height: 1; }
.nav-dropdown { position:absolute; top:100%; left:0; min-width: 260px; background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px; padding:.5rem; box-shadow: 0 10px 24px rgba(0,0,0,.08); display:none; }
.nav-item:hover .nav-dropdown, .nav-item:focus-within .nav-dropdown { display:block; }
.nav-link:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; border-radius: 6px; }
.dropdown-item.active { background: var(--color-background); color: var(--color-primary); font-weight: 600; }
.dropdown-item { display:block; padding:.6rem .75rem; color:inherit; text-decoration:none; border-radius:8px; }
.dropdown-item:hover { background: var(--color-background); }
.topbar-actions { display:flex; align-items:center; gap:.5rem; }
.lang-switch { display:flex; align-items:center; gap:.25rem; }
.lang-switch button { background:none; border:none; color: var(--color-text-secondary); cursor:pointer; }
.lang-switch button.active { color: var(--color-primary); font-weight:600; }
@media (min-width: 768px) { .main-nav{display:flex;} .only-mobile{display:none;} }

/* Mobile dropdown menu */
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
.dropdown-link.active { background: var(--color-background); color: var(--color-primary); font-weight: 600; }
.dropdown-sep { height:1px; background: var(--color-border); margin:.5rem 0; }
.dropdown-lang { display:flex; align-items:center; gap:.25rem; padding:.5rem .75rem; color: var(--color-text-secondary); }
.dropdown-lang button { background:none; border:none; cursor:pointer; color: inherit; }
.dropdown-lang button.active { color: var(--color-primary); font-weight:600; }
.only-desktop { display:none; }
@media (min-width: 768px) { .only-desktop{display:flex;} }

/* Desktop search */
.search-wrap { position: relative; display:none; }
.search-icon { position:absolute; left:.5rem; top:50%; transform:translateY(-50%); color: var(--color-text-secondary); }
.search-input { width:220px; padding:.5rem .75rem .5rem 2rem; border:1px solid var(--color-border); border-radius:9999px; background:var(--color-background); }
.search-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.12); }
</style>
