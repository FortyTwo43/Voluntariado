<template>
  <div class="overlay">
    <div class="modal">
      <header class="modal-header">
        <h3>Exportar Asistencias</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>

      <div class="modal-body">
        <div class="row">
          <label>Desde</label>
          <input type="date" v-model="from" />
        </div>
        <div class="row">
          <label>Hasta</label>
          <input type="date" v-model="to" />
        </div>

        <div class="row">
          <label>
            <input type="checkbox" v-model="allDates" />
            Exportar todo (sin rango de fechas)
          </label>
        </div>

        <div v-if="showProjects" class="projects-list">
          <label>
            <input type="checkbox" v-model="allProjects" />
            Incluir todos los proyectos
          </label>

          <div v-if="!allProjects" class="project-items">
            <label v-for="p in projects" :key="p.id" class="project-item">
              <input type="checkbox" :value="p.id" v-model="selectedProjects" />
              {{ p.nombre }}
            </label>
          </div>
        </div>
      </div>

      <footer class="modal-footer">
        <button class="btn" @click="$emit('close')">Cancelar</button>
        <button class="btn primary" @click="doExport">Exportar</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Project { id: string; nombre: string }

const props = withDefaults(defineProps<{ projects?: Project[]; showProjects?: boolean }>(), { projects: () => [], showProjects: false });

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'export', payload: { from: string | null; to: string | null; projectIds?: string[] | null }): void;
}>();

const from = ref<string | null>(null);
const to = ref<string | null>(null);
const allDates = ref(false);
const allProjects = ref(true);
const selectedProjects = ref<string[]>([]);

watch(allDates, val => {
  if (val) { from.value = null; to.value = null; }
});

watch(allProjects, val => {
  if (val) selectedProjects.value = [];
});

const doExport = () => {
  const payload = {
    from: allDates.value ? null : from.value,
    to: allDates.value ? null : to.value,
    projectIds: props.showProjects ? (allProjects.value ? null : selectedProjects.value.slice()) : null
  };
  // Emitir los filtros para que la vista genere el PDF
  emit('export', payload);
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  width: 420px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}
.close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}
.modal-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem }
.row { display:flex; flex-direction: column; gap: 0.25rem }
.row input[type="date"] { padding: 0.5rem; border-radius:6px; border:1px solid #ddd }
.projects-list { margin-top: 0.5rem }
.project-items { margin-top: 0.5rem; max-height: 160px; overflow:auto; border:1px solid #f0f0f0; padding:0.5rem; border-radius:6px }
.project-item { display:block; margin-bottom:0.5rem }
.modal-footer { display:flex; gap:0.5rem; padding:0.75rem 1rem; justify-content:flex-end; border-top:1px solid #eee }
.btn { padding:0.5rem 0.75rem; border-radius:6px; border:1px solid #ddd; background:white; cursor:pointer }
.btn.primary { background: linear-gradient(135deg,#79C99E 0%,#4B0082 100%); color:white; border:none }
</style>
