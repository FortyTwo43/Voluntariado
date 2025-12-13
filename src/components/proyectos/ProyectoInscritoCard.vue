<template>
  <div class="proyecto-inscrito-card">
    <div class="card-header">
      <span class="categoria-badge" :class="`badge-${proyecto.categoria}`">
        {{ getCategoriaLabel(proyecto.categoria) }}
      </span>
      <span class="estado-badge" :class="`estado-${inscripcion.estado}`">
        {{ getEstadoLabel(inscripcion.estado) }}
      </span>
    </div>
    
    <div class="card-body">
      <h3 class="proyecto-nombre">{{ proyecto.nombre }}</h3>
      <p v-if="proyecto.descripcion" class="proyecto-descripcion">
        {{ proyecto.descripcion }}
      </p>
      
      <div class="proyecto-info">
        <div class="info-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="info-text">{{ formatearFecha(proyecto.fecha_inicio) }} - {{ formatearFecha(proyecto.fecha_fin) }}</span>
        </div>
        
        <div class="info-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span class="info-text">Cupo: {{ proyecto.cupo_maximo }}</span>
        </div>
      </div>
      
      <div class="info-item fecha-inscripcion">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="info-text">Inscrito el {{ formatearFecha(inscripcion.fecha_inscripcion) }}</span>
      </div>
    </div>
    
    <div class="card-footer">
      <button @click="verDetalles" class="btn-detalles">
        <svg class="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Ver Detalles
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Proyecto } from '@/types/proyecto';
import type { IInscripcion, EstadoInscripcion } from '@/types/IInscripcion';

interface Props {
  proyecto: Proyecto;
  inscripcion: IInscripcion;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  verDetalles: [idProyecto: string, estado: EstadoInscripcion];
}>();

const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    social: 'Social',
    educativo: 'Educativo',
    ambiental: 'Ambiental'
  };
  return labels[categoria] || categoria;
};

const getEstadoLabel = (estado: EstadoInscripcion): string => {
  const labels: Record<EstadoInscripcion, string> = {
    activa: 'Activa',
    espera: 'En Espera',
    completado: 'Completado',
    cancelado: 'Cancelado'
  };
  return labels[estado];
};

const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return fecha;
  }
};

const verDetalles = () => {
  emit('verDetalles', props.proyecto.id, props.inscripcion.estado);
};
</script>

<style scoped>
.proyecto-inscrito-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.proyecto-inscrito-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5ed 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.categoria-badge,
.estado-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.categoria-badge {
  background: #667eea;
  color: white;
}

.badge-social {
  background: #f093fb;
}

.badge-educativo {
  background: #4facfe;
}

.badge-ambiental {
  background: #43e97b;
}

.estado-badge {
  border: 2px solid;
}

.estado-activa {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.estado-espera {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeeba;
}

.estado-completado {
  background: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
}

.estado-cancelado {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.proyecto-nombre {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  line-height: 1.3;
}

.proyecto-descripcion {
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.proyecto-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fecha-inscripcion {
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.25rem;
}

.icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #667eea;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.875rem;
  color: #4a5568;
}

.card-footer {
  padding: 1rem 1.25rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-detalles {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detalles:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.icon-btn {
  width: 1.125rem;
  height: 1.125rem;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .proyecto-nombre {
    font-size: 1.125rem;
  }

  .proyecto-descripcion {
    font-size: 0.875rem;
  }

  .card-footer {
    padding: 0.875rem 1rem;
  }

  .btn-detalles {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
