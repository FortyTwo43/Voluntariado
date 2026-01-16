<template>
  <div class="asistencia-row">
    <div class="col proyecto">
      <div class="proyecto-nombre">{{ asistencia.proyectoNombre }}</div>
    </div>
    <div class="col dia">{{ asistencia.dia }}</div>
    <div class="col hora">{{ asistencia.hora }}</div>
    <div class="col estado">
      <span :class="['badge', asistencia.presencia ? 'presente' : 'ausente']">{{ asistencia.presencia ? t.presence : t.absence }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

interface AsistenciaRowData {
  id_asistencia: string
  proyectoNombre: string
  dia: string
  hora: string
  presencia?: boolean
}

const props = defineProps<{ asistencia: AsistenciaRowData }>()
const asistencia = props.asistencia
</script>

<style scoped>
.asistencia-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.col {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.proyecto-nombre {
  font-weight: 700;
}

.badge {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
}

.badge.presente {
  background: #e6ffed;
  color: #1f8a3d;
  border: 1px solid #b9f4c0;
}

.badge.ausente {
  background: #fff0f0;
  color: #c53030;
  border: 1px solid #f3c6c6;
}

@media (max-width: 640px) {
  .asistencia-row {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    gap: 0.35rem;
    padding: 0.6rem 0.75rem;
  }

  .col {
    font-size: 0.95rem;
    padding: 0;
  }

  .col.proyecto { font-weight: 700; margin-bottom: 0.25rem }

  /* mostrar día y hora en línea */
  .col.dia, .col.hora {
    display: inline-block;
    color: var(--color-text-secondary);
    margin-right: 0.75rem;
    font-size: 0.9rem;
  }

  .col.estado {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.4rem;
  }

  .badge { font-size: 0.78rem; padding: 0.28rem 0.5rem }
}
</style>
