<template>
  <section class="page">
    <h1 class="page-title">{{ t.support }}</h1>
    <p class="page-subtitle">{{ t.contactIntro }}</p>

    <div class="contact-grid">
      <form class="card" @submit.prevent="submit">
        <div class="field">
          <label>{{ t.name }}</label>
          <input v-model="form.name" required />
        </div>
        <div class="field">
          <label>{{ t.email }}</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div class="field">
          <label>{{ t.subject }}</label>
          <input v-model="form.subject" />
        </div>
        <div class="field">
          <label>{{ t.message }}</label>
          <textarea rows="5" v-model="form.message" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit">{{ t.send }}</button>
      </form>

      <div class="card info">
        <h2>{{ t.contactInfo }}</h2>
        <p>email@example.com</p>
        <p>+34 600 000 000</p>
        <p>Madrid, España</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
const { t } = useLanguage()

const form = reactive({ name: '', email: '', subject: '', message: '' })
const submit = () => {
  // Aquí puedes integrar con tu servicio de correo o backend
  alert('Mensaje enviado')
}
</script>

<style scoped>
.page { max-width: 1000px; margin: 0 auto; display:flex; flex-direction:column; gap:1rem; }
.page-title { font-size:1.75rem; font-weight:800; }
.page-subtitle { color: var(--color-text-secondary); }
.contact-grid { display:grid; grid-template-columns: 1fr; gap:1rem; }
@media (min-width: 992px){ .contact-grid{ grid-template-columns: 2fr 1fr;} }
.card { background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px; padding:1rem; }
.field { display:flex; flex-direction:column; gap:.25rem; margin-bottom:.75rem; }
label { font-weight:600; font-size:.9rem; }
.info h2 { font-size:1.1rem; margin:0 0 .5rem; }
</style>
