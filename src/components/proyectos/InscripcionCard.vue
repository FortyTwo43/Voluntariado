<template>
  <article class="inscripcion-card">
    <div class="card-header">
      <span class="estado-badge" :class="`estado-${inscripcion.estado}`">
        {{ getEstadoLabel(inscripcion.estado) }}
      </span>
    </div>

    <div class="card-body">
      <h3 class="proyecto-nombre">{{ proyecto.nombre }}</h3>
      
      <p class="proyecto-descripcion">{{ descripcionCorta }}</p>

      <div class="info-grid">
        <div class="info-item categoria">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 7h10v10H7z"/>
            <path d="M3 3h18v18H3z"/>
          </svg>
          <span class="info-text">{{ proyecto.categoria }}</span>
        </div>

        <div class="info-item fecha-inscripcion">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="info-text">Inscrito el {{ formatearFecha(inscripcion.fecha_inscripcion) }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-ver-proyecto" @click="verProyecto">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Ver Proyecto
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IInscripcion, EstadoInscripcion } from '@/types/IInscripcion';
import type { Proyecto } from '@/types/proyecto';

const props = defineProps<{
  proyecto: Proyecto;
  inscripcion: IInscripcion;
}>();

const emit = defineEmits<{
  'ver-proyecto': [idProyecto: string];
}>();

const descripcionCorta = computed(() => {
  const desc = props.proyecto.descripcion || '';
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
});

const getEstadoLabel = (estado: EstadoInscripcion): string => {
  const labels: Record<EstadoInscripcion, string> = {
    activa: 'Activa',
    espera: 'En espera',
    completado: 'Completada',
    cancelado: 'Cancelada',
  };
  return labels[estado] || estado;
};

const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const verProyecto = () => {
  emit('ver-proyecto', props.proyecto.id);
};
</script>

<style scoped>
.inscripcion-card {
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.inscripcion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.card-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.estado-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estado-badge.estado-activa {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.estado-badge.estado-espera {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.estado-badge.estado-completado {
  background: #dbeafe;
  color: #1e3a8a;
  border: 1px solid #93c5fd;
}

.estado-badge.estado-cancelado {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.proyecto-nombre {
  font-size: 1.375rem;
  font-weight: 700;
  color: #2E2E2E;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.proyecto-descripcion {
  font-size: 0.9375rem;
  color: #5a5a5a;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.categoria .info-text {
  text-transform: capitalize;
  color: #4B0082;
  font-weight: 600;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #f3f4f6;
  background: #fafafa;
}

.btn-ver-proyecto {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-ver-proyecto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

@media (max-width: 768px) {
  .proyecto-nombre {
    font-size: 1.125rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-footer {
    padding: 0.875rem 1.25rem;
  }
}
</style>
