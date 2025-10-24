<template>
  <footer class="public-footer">
    <div class="footer-inner">
      <span>© 2024 {{ t.platformName }}.</span>
      <nav class="footer-links">
        <RouterLink to="/politicas">{{ t.terms }}</RouterLink>
        <RouterLink to="/contacto">{{ t.support }}</RouterLink>
        <RouterLink to="/informacion">{{ t.institutionalInfo }}</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()
</script>

<style scoped>
.public-footer { border-top:1px solid var(--color-border); background: var(--color-surface); }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 1rem; display:flex; gap:1rem; align-items:center; justify-content:space-between; color: var(--color-text-secondary); }
.footer-links { display:flex; gap:1rem; }
.footer-links a { color: inherit; text-decoration:none; }
.footer-links a:hover { color: var(--color-text); }
</style>
