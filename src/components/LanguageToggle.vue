<template>
  <div class="language-toggle">
    <button
      @click="toggleLanguage"
      class="language-btn"
      :title="currentLanguage === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span class="language-text">{{ currentLanguage.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage';

const { currentLanguage, changeLanguage } = useLanguage();

const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'es' ? 'en' : 'es';
  changeLanguage(newLang);
};
</script>

<style scoped>
.language-toggle {
  display: inline-flex;
  align-items: center;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.language-text {
  font-weight: 600;
}

/* Variant for light backgrounds */
.language-toggle.light .language-btn {
  background: rgba(79, 70, 229, 0.1);
  border-color: rgba(79, 70, 229, 0.2);
  color: #4f46e5;
}

.language-toggle.light .language-btn:hover {
  background: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
}
</style>
