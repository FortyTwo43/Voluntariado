<template>
  <article class="proyecto-card">
    <!-- Imagen/Header del proyecto -->
    <div class="card-header">
      <div 
        class="card-imagen"
        :style="{ background: gradienteCategoria }"
      >
        <svg class="icon-proyecto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
  <span v-if="esNuevo" class="badge-nuevo">{{ t.newBadge }}</span>
    </div>

    <!-- Cuerpo de la card -->
    <div class="card-body">
      <!-- Título y Organización -->
      <h3 class="card-titulo">{{ proyecto.nombre }}</h3>
      <p class="card-organizacion">
        <svg class="icon-org" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
        </svg>
        {{ nombreOrganizacion }}
      </p>

      <!-- Descripción -->
      <p class="card-descripcion">{{ descripcionCorta }}</p>

      <!-- Tags (categoría y cupos) -->
      <div class="card-tags">
        <span class="tag tag-categoria">{{ proyecto.categoria }}</span>
        <span v-if="proyecto.cupo_maximo" class="tag tag-cupos">
          {{ proyecto.cupo_maximo }} {{ t.slots }}
        </span>
      </div>

      <!-- Metadata (ubicación, fecha, duración) -->
      <div class="card-meta">
        <div class="meta-item">
          <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <span>{{ t.startDateLabel }}: {{ fechaFormateada }}</span>
        </div>
        <div class="meta-item">
          <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <span>{{ t.endDateLabel }}: {{ fechaFinFormateada }}</span>
        </div>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div class="card-footer">
      <button 
        class="btn-secundario"
        @click="verDetalles"
      >
        {{ t.viewDetails }}
      </button>
      <button 
        class="btn-primario"
        @click="inscribirse"
      >
        {{ t.apply }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Proyecto } from '../../types/proyecto';
import { SUPABASE_URL, SUPABASE_HEADERS } from '../../config/supabase';
import { useLanguage } from '@/composables/useLanguage';

// Props
const props = defineProps<{
  proyecto: Proyecto;
}>();

// Emits
const emit = defineEmits<{
  'ver-detalles': [id: string];
  'inscribirse': [id: string];
}>();

/**
 * Nombre de la organización
 * Preferimos un valor ya provisto en el objeto proyecto (organizacion.nombre o organizacion_nombre),
 * y si no existe, consultamos la BD por id_organizacion.
 */
const nombreOrganizacion = ref<string>('');
const { t, currentLanguage } = useLanguage();
const locale = computed(() => currentLanguage.value === 'en' ? 'en-US' : 'es-ES');

const inicializarNombreOrganizacion = async () => {
  // 1) Si viene embebido en el proyecto
  const anyProyecto = props.proyecto as any;
  const embebido = anyProyecto?.organizacion?.nombre || anyProyecto?.organizacion_nombre;
  if (embebido && typeof embebido === 'string') {
    nombreOrganizacion.value = embebido;
    return;
  }

  // 2) Si no, intentar buscar por id_organizacion
  const orgId = props.proyecto.id_organizacion;
  if (!orgId) {
    nombreOrganizacion.value = t.value.organization;
    return;
  }

  try {
    // Intentamos con ambos esquemas posibles: id_organizacion y id
    const urls = [
      `${SUPABASE_URL}/rest/v1/organizaciones?id_organizacion=eq.${orgId}&select=nombre`,
      `${SUPABASE_URL}/rest/v1/organizaciones?id=eq.${orgId}&select=nombre`,
    ];

    for (const url of urls) {
      const res = await fetch(url, { headers: SUPABASE_HEADERS });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].nombre) {
          nombreOrganizacion.value = data[0].nombre as string;
          return;
        }
      }
    }

    // Fallback si no se encontró
    nombreOrganizacion.value = String(orgId);
  } catch (e) {
    console.warn('No se pudo obtener el nombre de la organización', e);
    nombreOrganizacion.value = String(orgId);
  }
};

onMounted(() => {
  inicializarNombreOrganizacion();
});

/**
 * Verifica si es un proyecto nuevo (menos de 30 días)
 */
const esNuevo = computed(() => {
  if (!props.proyecto.fecha_inicio) return false;
  const fecha = new Date(props.proyecto.fecha_inicio);
  const ahora = new Date();
  const diff = ahora.getTime() - fecha.getTime();
  const dias = diff / (1000 * 60 * 60 * 24);
  return Math.abs(dias) <= 30;
});

/**
 * Descripción truncada
 */
const descripcionCorta = computed(() => {
  const desc = props.proyecto.descripcion || '';
  return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
});

/**
 * Fecha formateada
 */
const fechaFormateada = computed(() => {
  if (!props.proyecto.fecha_inicio) return '-';
  const fecha = new Date(props.proyecto.fecha_inicio);
  return fecha.toLocaleDateString(locale.value, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
});

/**
 * Fecha de finalización formateada
 */
const fechaFinFormateada = computed(() => {
  if (!props.proyecto.fecha_fin) return '-';
  const fecha = new Date(props.proyecto.fecha_fin);
  return fecha.toLocaleDateString(locale.value, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
});

/**
 * Gradiente según categoría
 */
const gradienteCategoria = computed(() => {
  const gradientes: Record<string, string> = {
    social: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    educativo: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    ambiental: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  };
  return gradientes[props.proyecto.categoria] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
});

/**
 * Ver detalles del proyecto
 */
const verDetalles = () => {
  emit('ver-detalles', props.proyecto.id);
};

/**
 * Inscribirse al proyecto
 */
const inscribirse = () => {
  emit('inscribirse', props.proyecto.id);
};
</script>

<style scoped>
.proyecto-card {
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.proyecto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #79C99E;
}

/* Header */
.card-header {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-imagen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-proyecto {
  width: 5rem;
  height: 5rem;
  color: white;
  opacity: 0.9;
}

.badge-nuevo {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.875rem;
  background: #10b981;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

/* Body */
.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2E2E2E;
  margin: 0;
  line-height: 1.4;
  min-height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-organizacion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.icon-org {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.card-descripcion {
  font-size: 0.9375rem;
  color: #5a5a5a;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

/* Tags */
.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  text-transform: capitalize;
}

.tag-categoria {
  background: #EDE9FE;
  color: #4B0082;
}

.tag-cupos {
  background: #D1FAE5;
  color: #065f46;
}

/* Meta */
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #9ca3af;
}

/* Footer */
.card-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 2px solid #f3f4f6;
  background: #fafafa;
}

.btn-secundario,
.btn-primario {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secundario {
  color: #4B0082;
  background: white;
  border: 2px solid #4B0082;
}

.btn-secundario:hover {
  background: #4B0082;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 0, 130, 0.3);
}

.btn-primario {
  color: white;
  background: #79C99E;
  border: 2px solid #79C99E;
}

.btn-primario:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(121, 201, 158, 0.4);
}

/* Responsive */
@media (max-width: 640px) {
  .card-body {
    padding: 1.25rem;
  }

  .card-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-secundario,
  .btn-primario {
    width: 100%;
  }
}
</style>
