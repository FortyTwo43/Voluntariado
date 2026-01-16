<template>
  <div class="gestion-proyectos-form">
    <div class="form-header">
      <h1 class="form-title">Gestión de Proyectos</h1>
      <p class="form-subtitle">Supervisa y gestiona todos los proyectos del sistema</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando proyectos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="estado-error">
      <p>{{ error }}</p>
      <button @click="cargarProyectos" class="btn-reintentar">Reintentar</button>
    </div>

    <!-- Tabla de proyectos -->
    <div v-else class="tabla-container">
      <div class="filtros-container">
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar por nombre..."
          class="input-busqueda"
        />
        <select v-model="filtroEstado" class="select-filtro">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <table class="tabla-proyectos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Cupo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proyecto in proyectosFiltrados" :key="proyecto.id">
            <td>{{ proyecto.nombre }}</td>
            <td>
              <span class="badge-categoria">{{ proyecto.categoria }}</span>
            </td>
            <td>{{ formatearFecha(proyecto.fecha_inicio) }}</td>
            <td>{{ formatearFecha(proyecto.fecha_fin) }}</td>
            <td>{{ proyecto.cupo_maximo }}</td>
            <td>
              <span
                :class="[
                  'badge-estado',
                  `estado-${proyecto.estado || 'activo'}`,
                ]"
              >
                {{ obtenerEstadoLabel(proyecto.estado || 'activo') }}
              </span>
            </td>
            <td class="celda-acciones">
              <select
                v-model="estadosTemporales[proyecto.id]"
                @change="cambiarEstado(proyecto.id, estadosTemporales[proyecto.id] || 'activo')"
                class="select-estado"
                :disabled="procesando"
              >
                <option :value="proyecto.estado || 'activo'">
                  {{ obtenerEstadoLabel(proyecto.estado || 'activo') }}
                </option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="completado">Completado</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="proyectosFiltrados.length === 0" class="estado-vacio">
        <p>No se encontraron proyectos</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AdminService } from '../../services/adminService';
import { useAlert } from '../../composables/useAlert';
import type { Proyecto } from '../../types/proyecto';

const { showSuccess, showError } = useAlert();

// Estado
const proyectos = ref<Proyecto[]>([]);
const cargando = ref(true);
const error = ref('');
const procesando = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');
const estadosTemporales = ref<Record<string, string>>({});

// Proyectos filtrados
const proyectosFiltrados = computed(() => {
  let resultado = proyectos.value;

  // Filtro por búsqueda
  if (busqueda.value.trim()) {
    const busquedaLower = busqueda.value.toLowerCase();
    resultado = resultado.filter((proyecto) =>
      proyecto.nombre.toLowerCase().includes(busquedaLower)
    );
  }

  // Filtro por estado
  if (filtroEstado.value !== '') {
    resultado = resultado.filter((proyecto) => (proyecto.estado || 'activo') === filtroEstado.value);
  }

  return resultado;
});

/**
 * Carga los proyectos desde el servicio
 */
const cargarProyectos = async () => {
  cargando.value = true;
  error.value = '';

  try {
    proyectos.value = await AdminService.obtenerTodosLosProyectos();
    // Inicializar estados temporales (todos serán 'activo' ya que la BD no tiene estado)
    proyectos.value.forEach((proyecto) => {
      estadosTemporales.value[proyecto.id] = 'activo';
    });
  } catch (err) {
    console.error('Error al cargar proyectos:', err);
    error.value = err instanceof Error ? err.message : 'No se pudieron cargar los proyectos';
  } finally {
    cargando.value = false;
  }
};

/**
 * Cambia el estado de un proyecto
 */
const cambiarEstado = async (
  idProyecto: string,
  nuevoEstado: string
): Promise<void> => {
  if (
    !confirm(
      `¿Estás seguro de que deseas cambiar el estado del proyecto a "${obtenerEstadoLabel(nuevoEstado)}"? Nota: Este cambio es solo visual, la base de datos no almacena estados.`
    )
  ) {
    // Restaurar estado anterior (siempre será 'activo' ya que la BD no tiene estado)
    estadosTemporales.value[idProyecto] = 'activo';
    return;
  }

  procesando.value = true;

  try {
    await AdminService.actualizarEstadoProyecto(
      idProyecto,
      nuevoEstado as 'activo' | 'inactivo' | 'completado'
    );
    showSuccess('Estado actualizado', 'Nota: La base de datos no tiene columna estado, el cambio es solo visual');
    await cargarProyectos();
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    showError('Error', err instanceof Error ? err.message : 'No se pudo actualizar el estado');
    // Restaurar estado anterior (siempre será 'activo')
    estadosTemporales.value[idProyecto] = 'activo';
  } finally {
    procesando.value = false;
  }
};

/**
 * Obtiene el label del estado
 */
const obtenerEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    completado: 'Completado',
  };
  return labels[estado] || estado;
};

/**
 * Formatea una fecha
 */
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return fecha;
  }
};

// Cargar proyectos al montar
onMounted(() => {
  cargarProyectos();
});
</script>

<style scoped>
.gestion-proyectos-form {
  background: white;
  padding: clamp(1rem, 4vw, 2rem);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #6b7280;
  margin: 0;
}

.estado-carga,
.estado-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-reintentar {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.btn-reintentar:hover {
  background: #4338ca;
}

.filtros-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.input-busqueda {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-busqueda:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.select-filtro {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-width: 150px;
}

.select-filtro:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.tabla-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.tabla-proyectos {
  width: 100%;
  border-collapse: collapse;
}

.tabla-proyectos thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.tabla-proyectos th {
  padding: 1rem;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-proyectos tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.tabla-proyectos tbody tr:hover {
  background: #f9fafb;
}

.tabla-proyectos td {
  padding: 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
}

.badge-categoria {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  background: #e0e7ff;
  color: #4338ca;
  text-transform: capitalize;
}

.badge-estado {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  text-align: center;
}

.estado-activo {
  background: #d1fae5;
  color: #065f46;
}

.estado-inactivo {
  background: #fee2e2;
  color: #991b1b;
}

.estado-completado {
  background: #dbeafe;
  color: #1e40af;
}

.celda-acciones {
  min-width: 150px;
}

.select-estado {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #2e2e2e;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.select-estado:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.select-estado:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.estado-vacio {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 768px) {
  .tabla-container {
    overflow-x: auto;
  }

  .tabla-proyectos {
    min-width: 800px;
  }

  .filtros-container {
    flex-direction: column;
  }

  .input-busqueda,
  .select-filtro {
    width: 100%;
  }
}
</style>

