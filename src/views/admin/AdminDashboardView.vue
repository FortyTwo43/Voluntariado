<template>
  <div class="admin-dashboard">
    <!-- Grid de secciones/formularios -->
    <div class="secciones-container">
      <div 
        v-for="seccion in secciones" 
        :key="seccion.id"
        class="seccion-card"
        @click="navegarAFormulario(seccion.ruta)"
      >
        <div class="seccion-icono" :style="{ background: seccion.colorGradiente }">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path :d="seccion.icono" />
          </svg>
        </div>
        <div class="seccion-contenido">
          <h3 class="seccion-titulo">{{ seccion.titulo }}</h3>
          <p class="seccion-descripcion">{{ seccion.descripcion }}</p>
        </div>
        <div class="seccion-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// Secciones del dashboard
const secciones = [
  {
    id: 'validacion-organizaciones',
    titulo: 'Validación de Organizaciones',
    descripcion: 'Revisa y valida las solicitudes de registro de organizaciones',
    ruta: '/admin/validacion-organizaciones',
    icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    colorGradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'gestion-proyectos',
    titulo: 'Gestión de Proyectos',
    descripcion: 'Supervisa y gestiona todos los proyectos del sistema',
    ruta: '/admin/gestion-proyectos',
    icono: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    colorGradiente: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'reportes-estadisticas',
    titulo: 'Reportes y Estadísticas',
    descripcion: 'Métricas y estadísticas del sistema',
    ruta: '/admin/reportes-estadisticas',
    icono: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    colorGradiente: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: 'eliminar-usuario-inactivo',
    titulo: 'Eliminar Usuario Inactivo',
    descripcion: 'Elimina voluntarios de proyectos por inasistencia',
    ruta: '/admin/eliminar-usuario-inactivo',
    icono: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    colorGradiente: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
];

/**
 * Navega a la ruta del formulario
 */
const navegarAFormulario = (ruta: string) => {
  router.push(ruta);
};
</script>

<style scoped>
.admin-dashboard {
  min-height: calc(100vh - 200px);
  padding: clamp(1rem, 4vw, 2rem);
  background: #f9fafb;
}

.secciones-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.seccion-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.seccion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #4f46e5;
}

.seccion-icono {
  width: 4rem;
  height: 4rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.seccion-icono svg {
  width: 2rem;
  height: 2rem;
  color: white;
}

.seccion-contenido {
  flex: 1;
  min-width: 0;
}

.seccion-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.seccion-descripcion {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.seccion-arrow {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.seccion-card:hover .seccion-arrow {
  color: #4f46e5;
  transform: translateX(4px);
}

.seccion-arrow svg {
  width: 1.5rem;
  height: 1.5rem;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .secciones-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .seccion-card {
    padding: 1.5rem;
    gap: 1rem;
  }

  .seccion-icono {
    width: 3rem;
    height: 3rem;
  }

  .seccion-icono svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .seccion-titulo {
    font-size: 1.125rem;
  }
}
</style>
