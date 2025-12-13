<template>
  <div class="calendario-container">
    <div class="semana-info">
      <svg class="icon-calendario" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span class="semana-texto">
        Semana del {{ formatearFechaCorta(inicioSemana) }} al {{ formatearFechaCorta(finSemana) }}
      </span>
    </div>

    <div class="calendario-scroll">
      <table class="calendario-tabla">
        <thead>
          <tr>
            <th class="columna-hora">Hora</th>
            <th 
              v-for="dia in diasSemana" 
              :key="dia.numero"
              :class="['columna-dia', { 'dia-actual': esHoy(dia.numero) }]"
            >
              <div class="dia-header">
                <span class="dia-nombre">{{ dia.nombre }}</span>
                <span class="dia-fecha">{{ obtenerFechaDia(dia.numero) }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hora in horasDelDia" :key="hora">
            <td class="celda-hora">
              <span class="hora-texto">{{ formatearHora(hora) }}</span>
            </td>
            <td 
              v-for="dia in diasSemana" 
              :key="`${hora}-${dia.numero}`"
              :class="['celda-actividad', { 'dia-actual': esHoy(dia.numero) }]"
            >
              <div 
                v-if="obtenerActividad(hora, dia.numero)"
                class="actividad-card"
              >
                <div class="actividad-hora">
                  {{ obtenerRangoHora(obtenerActividad(hora, dia.numero)!) }}
                </div>
                <div class="actividad-nombre">
                  {{ obtenerActividad(hora, dia.numero)!.nombreProyecto }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!hayActividades" class="sin-actividades">
      <svg class="icon-sin-actividades" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
      <h3>No tienes actividades programadas</h3>
      <p>Inscríbete en proyectos para ver tus horarios aquí</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ActividadCalendario } from '@/types/calendario';

const props = defineProps<{
  actividades: ActividadCalendario[];
}>();

const diasSemana = [
  { numero: 1, nombre: 'Lun' },
  { numero: 2, nombre: 'Mar' },
  { numero: 3, nombre: 'Mié' },
  { numero: 4, nombre: 'Jue' },
  { numero: 5, nombre: 'Vie' },
  { numero: 6, nombre: 'Sáb' },
  { numero: 0, nombre: 'Dom' }
];

const horasDelDia = Array.from({ length: 18 }, (_, i) => i + 5);

const hoy = new Date();
const diaActualSemana = hoy.getDay();

const inicioSemana = computed(() => {
  const fecha = new Date(hoy);
  const diff = fecha.getDay() === 0 ? -6 : 1 - fecha.getDay();
  fecha.setDate(fecha.getDate() + diff);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
});

const finSemana = computed(() => {
  const fecha = new Date(inicioSemana.value);
  fecha.setDate(fecha.getDate() + 6);
  fecha.setHours(23, 59, 59, 999);
  return fecha;
});

const hayActividades = computed(() => props.actividades.length > 0);

const esHoy = (diaSemana: number): boolean => {
  return diaSemana === diaActualSemana;
};

const obtenerFechaDia = (diaSemana: number): string => {
  const fecha = new Date(inicioSemana.value);
  const diff = diaSemana === 0 ? 6 : diaSemana - 1;
  fecha.setDate(fecha.getDate() + diff);
  return fecha.getDate().toString();
};

const formatearFechaCorta = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short'
  }).format(fecha);
};

const formatearHora = (hora: number): string => {
  return `${hora.toString().padStart(2, '0')}:00`;
};

const obtenerActividad = (hora: number, dia: number): ActividadCalendario | null => {
  return props.actividades.find(act => {
    if (act.dia !== dia) return false;
    
    const horaInicioNum = parseInt((String(act.hora?.hora_inicio ?? '0:00:00').split(':')[0] ?? '0'), 10);
    const horaFinNum = parseInt((String(act.hora?.hora_fin ?? '0:00:00').split(':')[0] ?? '0'), 10);
    
    return hora >= horaInicioNum && hora < horaFinNum;
  }) || null;
};

const obtenerRangoHora = (actividad: ActividadCalendario): string => {
  const inicioRaw = actividad?.hora?.hora_inicio ?? actividad?.horaInicio ?? '00:00:00';
  const finRaw = actividad?.hora?.hora_fin ?? actividad?.horaFin ?? '00:00:00';
  const inicio = inicioRaw.substring(0, 5);
  const fin = finRaw.substring(0, 5);
  return `${inicio} - ${fin}`;
};
</script>

<style scoped>
.calendario-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.semana-info {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.icon-calendario {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.semana-texto {
  font-size: 1.25rem;
  font-weight: 700;
}

.calendario-scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.calendario-tabla {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.calendario-tabla thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f7fafc;
}

.calendario-tabla th {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  background: #f7fafc;
}

.columna-hora {
  width: 80px;
  background: #edf2f7;
  position: sticky;
  left: 0;
  z-index: 11;
}

.columna-dia {
  min-width: 120px;
  transition: background 0.2s ease;
}

.columna-dia.dia-actual {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.dia-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dia-nombre {
  font-size: 0.9375rem;
  color: #2d3748;
}

.dia-fecha {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.calendario-tabla tbody td {
  padding: 0;
  border: 1px solid #e2e8f0;
  height: 60px;
  vertical-align: top;
}

.celda-hora {
  background: #edf2f7;
  text-align: center;
  vertical-align: middle;
  position: sticky;
  left: 0;
  z-index: 5;
}

.hora-texto {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.celda-actividad {
  position: relative;
  transition: background 0.2s ease;
}

.celda-actividad:hover {
  background: #f7fafc;
}

.celda-actividad.dia-actual {
  background: rgba(102, 126, 234, 0.03);
}

.celda-actividad.dia-actual:hover {
  background: rgba(102, 126, 234, 0.08);
}

.actividad-card {
  padding: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  margin: 0.25rem;
  height: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.actividad-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.actividad-hora {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
}

.actividad-nombre {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.sin-actividades {
  text-align: center;
  padding: 4rem 2rem;
}

.icon-sin-actividades {
  width: 5rem;
  height: 5rem;
  color: #cbd5e0;
  margin: 0 auto 1.5rem;
}

.sin-actividades h3 {
  font-size: 1.75rem;
  color: #2d3748;
  margin: 0 0 0.75rem 0;
}

.sin-actividades p {
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 768px) {
  .semana-info {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .icon-calendario {
    width: 1.25rem;
    height: 1.25rem;
  }

  .semana-texto {
    font-size: 0.875rem;
  }

  .calendario-scroll {
    max-height: calc(100vh - 250px);
    overflow-x: hidden;
  }

  .calendario-tabla {
    min-width: 100%;
    table-layout: fixed;
  }

  .calendario-tabla th {
    padding: 0.4rem 0.2rem;
    font-size: 0.65rem;
  }

  .columna-hora {
    width: 35px;
    font-size: 0.625rem;
  }

  .columna-dia {
    min-width: 0;
    width: auto;
  }

  .dia-header {
    gap: 0.1rem;
  }

  .dia-nombre {
    font-size: 0.65rem;
  }

  .dia-fecha {
    font-size: 0.6rem;
  }

  .calendario-tabla tbody td {
    height: 35px;
    padding: 0;
  }

  .hora-texto {
    font-size: 0.625rem;
  }

  .actividad-card {
    padding: 0.2rem;
    margin: 0.15rem;
    height: calc(100% - 0.3rem);
    border-radius: 3px;
    gap: 0;
  }

  /* Ocultar hora en móvil, solo mostrar nombre */
  .actividad-hora {
    display: none;
  }

  .actividad-nombre {
    font-size: 0.6rem;
    line-height: 1.2;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    font-weight: 600;
  }

  .sin-actividades {
    padding: 2rem 1rem;
  }

  .icon-sin-actividades {
    width: 3rem;
    height: 3rem;
  }

  .sin-actividades h3 {
    font-size: 1.25rem;
  }

  .sin-actividades p {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .calendario-tabla th {
    padding: 0.3rem 0.1rem;
    font-size: 0.6rem;
  }

  .columna-hora {
    width: 30px;
  }

  .dia-nombre {
    font-size: 0.6rem;
  }

  .dia-fecha {
    font-size: 0.55rem;
  }

  .calendario-tabla tbody td {
    height: 30px;
  }

  .hora-texto {
    font-size: 0.55rem;
  }

  .actividad-card {
    padding: 0.15rem;
    margin: 0.1rem;
  }

  .actividad-nombre {
    font-size: 0.55rem;
  }
}
</style>
