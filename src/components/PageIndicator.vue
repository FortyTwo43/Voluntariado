<template>
  <div class="page-indicator">
    <div class="indicator-content">
      <span class="material-symbols-outlined">location_on</span>
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/" class="breadcrumb-link">Inicio</router-link>
          </li>
          <li v-if="currentSection" class="breadcrumb-item">
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ currentSection }}</span>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentSection = computed(() => {
  const sectionNames: Record<string, string> = {
    'home': '',
    'proyectos': 'Proyectos de Voluntariado',
    'proyectos-detalle': 'Detalle del Proyecto',
    'proyectos-crear': 'Crear Proyecto',
    'proyectos-asistencia': 'Asistencia',
    'proyectos-horas': 'Horas de Voluntarios',
    'institutional': 'Información Institucional',
    'contact': 'Contacto y Soporte',
    'policies': 'Políticas y Términos de Uso',
    'UserLogin': 'Iniciar Sesión',
    'registration': 'Registro de Usuario',
    'RegistroVoluntario': 'Registro de Voluntario',
    'RegisterOrganization': 'Registro de Organización',
    'projects': 'Proyectos'
  }
  return sectionNames[route.name as string] || ''
})
</script>

<style scoped>
.page-indicator {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 2px solid var(--color-secondary);
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 4.5rem;
  z-index: 90;
  backdrop-filter: blur(8px);
}

.indicator-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.indicator-content > .material-symbols-outlined {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.breadcrumb {
  flex: 1;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.breadcrumb-link:hover {
  background: rgba(79, 70, 229, 0.1);
  color: var(--color-primary-dark);
}

.breadcrumb-separator {
  color: #9ca3af;
  font-weight: 500;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 700;
  font-size: 1.0625rem;
}

@media (max-width: 768px) {
  .page-indicator {
    padding: 0.625rem 1rem;
    top: 3.5rem;
  }

  .indicator-content > .material-symbols-outlined {
    font-size: 1.25rem;
  }

  .breadcrumb-current {
    font-size: 0.9375rem;
  }

  .breadcrumb-link {
    font-size: 0.875rem;
  }
}
</style>
