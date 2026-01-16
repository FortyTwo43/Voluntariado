<template>
  <div class="ver-asistencias-view">
    <div class="container">
      <header class="page-header">
        <h1 class="title">{{ t.attendanceTitle }}</h1>
        <p class="subtitle">{{ t.attendanceSubtitle }}</p>
      </header>

      <section class="controls">
        <div class="filters">
          <label class="filter">
            <select v-model="filtroProyecto" @change="applyFilters">
              <option value="">{{ t.filterProject }}</option>
              <option v-for="p in proyectosList" :key="p.id" :value="p.id">{{ p.nombre }}</option>
            </select>
          </label>

          <label class="filter">
            <select v-model="filtroDia" @change="applyFilters">
              <option value="">{{ t.filterDay }}</option>
              <option v-for="d in dias" :key="d.value" :value="d.value">{{ d.label }}</option>
            </select>
          </label>

          <button class="btn-export" @click="onExportClick">{{ t.exportPdf }}</button>
        </div>
      </section>

      <ExportAsistenciasModal
        v-if="showExportModal"
        :projects="proyectosList"
        :show-projects="true"
        @close="showExportModal = false"
        @export="handleExportEmit"
      />

      <section class="lista-asistencias" v-if="!loading && enriched.length > 0">
        <div class="lista-headers">
          <div class="col cab-proyecto">Proyecto</div>
          <div class="col cab-dia">Día</div>
          <div class="col cab-hora">Hora</div>
          <div class="col cab-estado">Estado</div>
        </div>

        <AsistenciaRow v-for="item in paginated" :key="item.id_asistencia" :asistencia="item" />

        <div class="pagination" v-if="totalPages > 1">
          <button @click="prevPage" :disabled="page===1">{{ t.previous }}</button>
          <span>{{ page }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="page===totalPages">{{ t.next }}</button>
        </div>
      </section>

      <div v-else-if="!loading && enriched.length === 0" class="empty">
        <p>{{ t.noAttendances }}</p>
      </div>

      <div v-if="loading" class="loading">
        <p>{{ t.loadingProjects }}</p>
      </div>

      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import AsistenciasService from '@/services/asistencias.service'
import HorasService from '@/services/horas.service'
import ProyectosService from '@/services/proyectos.service'
import AsistenciaRow from '@/components/attendance/AsistenciaRow.vue'
import ExportAsistenciasModal from '@/components/modals/ExportAsistenciasModal.vue'
import type { IAsistencia } from '@/types/IAsistencia'
import type { IHora } from '@/types/IHora'
import type { Proyecto } from '@/types/proyecto'

const { t } = useLanguage()

const loading = ref(true)
const error = ref('')
const asistencias = ref<IAsistencia[]>([])
const enriched = ref<any[]>([])

const proyectosMap = ref<Record<string, Proyecto>>({})
const proyectosList = ref<Array<{ id: string; nombre: string }>>([])

const filtroProyecto = ref<string>('')
const filtroDia = ref<string>('')

const page = ref(1)
const perPage = 12

const dias = [
  { value: 'lunes', label: 'Lun' },
  { value: 'martes', label: 'Mar' },
  { value: 'miércoles', label: 'Mié' },
  { value: 'jueves', label: 'Jue' },
  { value: 'viernes', label: 'Vie' },
  { value: 'sábado', label: 'Sáb' },
  { value: 'domingo', label: 'Dom' },
]

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) throw new Error('Usuario no autenticado')
    const user = JSON.parse(userStr)
    const idVol = user.id

    const rows = await AsistenciasService.obtenerAsistenciasPorVoluntario(idVol)
    asistencias.value = rows || []

    // recoger ids de horas y proyectos únicos
    const idsHoras = Array.from(new Set(asistencias.value.map(a => a.id_hora))).filter(Boolean)
    const idsProy = Array.from(new Set(asistencias.value.map(a => a.id_proyecto))).filter(Boolean)

    // fetch horas por ids
    const horas = await HorasService.obtenerHorasPorIds(idsHoras)
    const horasMap: Record<string, IHora> = {}
    horas.forEach(h => { horasMap[h.id_hora] = h })

    // fetch proyectos (cache)
    for (const id of idsProy) {
      try {
        const p = await ProyectosService.obtenerProyectoPorId(id)
        proyectosMap.value[id] = p
      } catch (e) {
        console.error('Error cargando proyecto', id, e)
      }
    }

    proyectosList.value = Object.keys(proyectosMap.value).map(id => ({ id, nombre: proyectosMap.value[id]?.nombre ?? 'Proyecto' }))

    // construir registros enriquecidos
    enriched.value = asistencias.value.map(a => {
      const hora = horasMap[a.id_hora]
      const proyecto = proyectosMap.value[a.id_proyecto]
      return {
        ...a,
        proyectoNombre: proyecto?.nombre ?? 'Proyecto',
        dia: hora?.dia ?? '',
        hora: hora ? `${hora.hora_inicio.substring(0,5)} - ${hora.hora_fin.substring(0,5)}` : '',
        presencia: a.presencia === true
      }
    })

  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const applyFilters = () => {
  page.value = 1
}

const filtered = computed(() => {
  let list = enriched.value.slice()
  if (filtroProyecto.value) {
    list = list.filter(i => i.id_proyecto === filtroProyecto.value)
  }
  if (filtroDia.value) {
    list = list.filter(i => (i.dia || '').toLowerCase() === filtroDia.value.toLowerCase())
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))

const paginated = computed(() => {
  const start = (page.value -1) * perPage
  return filtered.value.slice(start, start + perPage)
})

const prevPage = () => { if (page.value > 1) page.value-- }
const nextPage = () => { if (page.value < totalPages.value) page.value++ }

const showExportModal = ref(false)

const openExportModal = () => { showExportModal.value = true }

const exportPdf = async (filters?: { from: string | null; to: string | null; projectIds?: string[] | null }) => {
  // Si se llama sin filtros, abrir modal
  if (!filters) {
    openExportModal();
    return;
  }

  // Filtrar datos en cliente usando la fecha de la asistencia (campo fecha)
  // Asegurar que enriched tenga campo fecha (proporcionado por backend)
  const rows = enriched.value.slice();

  let filteredRows = rows;

  if (filters.from) {
    const fromD = new Date(filters.from);
    fromD.setHours(0,0,0,0);
    filteredRows = filteredRows.filter(r => {
      const f = r.fecha ? new Date(r.fecha) : null;
      return f ? f >= fromD : false;
    });
  }
  if (filters.to) {
    const toD = new Date(filters.to);
    // incluir todo el día de la fecha "to"
    toD.setHours(23,59,59,999);
    filteredRows = filteredRows.filter(r => {
      const f = r.fecha ? new Date(r.fecha) : null;
      return f ? f <= toD : false;
    });
  }

  if (filters.projectIds && filters.projectIds.length > 0) {
    const set = new Set(filters.projectIds);
    filteredRows = filteredRows.filter(r => set.has(r.id_proyecto));
  }

  // Generar PDF con jsPDF + autoTable
  try {
  const mod = await import('jspdf');
  await import('jspdf-autotable');
  // @ts-ignore
  const { default: jsPDF } = mod;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const title = 'Asistencias';
    doc.setFontSize(14);
    doc.text(title, 40, 40);

    const head = [['Fecha', 'Proyecto', 'Día', 'Hora', 'Estado', 'Actividad']];
    const body = filteredRows.length > 0 ? filteredRows.map((r: any) => {
      const fecha = r.fecha ? new Date(r.fecha).toLocaleDateString() : '-';
      const estado = r.presencia === true ? 'Asistió' : 'Falta';
      return [fecha, r.proyectoNombre || r.id_proyecto, r.dia || '', r.hora || '', estado, r.actividad_realizada || '-'];
    }) : [['-','No hay registros para este rango','','','','']];

    // @ts-ignore
    (doc as any).autoTable({ head, body, startY: 60, styles: { fontSize: 9 } });

    const now = new Date();
    const filename = `asistencias_${now.toISOString().slice(0,19).replace(/[:T]/g,'_')}.pdf`;
    doc.save(filename);
  } catch (e) {
    console.error('Error generando PDF', e);
    error.value = 'No se pudo generar el PDF. Asegúrate de instalar las dependencias.';
  }
}

const handleExportEmit = async (filters: { from: string | null; to: string | null; projectIds?: string[] | null }) => {
  showExportModal.value = false;
  await exportPdf(filters);
}

const onExportClick = () => { exportPdf(); }
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  margin-bottom: 1rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
}

.subtitle {
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter {
  display: inline-block;
}

.filter select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  min-width: 160px;
}

.btn-export {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.lista-asistencias {
  overflow-x: auto;
}

.lista-headers {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--color-border);
  font-weight: 700;
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 5;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
}

.pagination {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

/* Responsive: pantallas pequeñas */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    width: 100%;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .filter select {
    width: 100%;
    min-width: 0;
  }

  .btn-export {
    width: 100%;
    margin-top: 0.5rem;
  }

  .lista-headers {
    display: none;
  }

  .pagination { padding: 0.5rem 0 }
}

@media (max-width: 420px) {
  .title { font-size: 1.25rem }
  .subtitle { font-size: 0.9rem }
  .filter select { padding: 0.45rem }
  .btn-export { padding: 0.5rem }
}
</style>
