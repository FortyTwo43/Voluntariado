<template>
  <div class="validacion-organizaciones-form">
    <div class="form-header">
      <h1 class="form-title">Validación de Organizaciones</h1>
      <p class="form-subtitle">
        Revisa y valida las solicitudes de registro de organizaciones
      </p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando organizaciones...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="estado-error">
      <p>{{ error }}</p>
      <button @click="cargarOrganizaciones" class="btn-reintentar">Reintentar</button>
    </div>

    <!-- Tabla de organizaciones -->
    <div v-else class="tabla-container">
      <div class="filtros-container">
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar por nombre o email..."
          class="input-busqueda"
        />
        <select v-model="filtroEstado" class="select-filtro">
          <option value="">Todos los estados</option>
          <option value="true">Validadas</option>
          <option value="false">Pendientes</option>
        </select>
      </div>

      <table class="tabla-organizaciones">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in organizacionesFiltradas" :key="org.id_organizacion">
            <td>{{ org.nombre }}</td>
            <td>{{ org.tipo }}</td>
            <td>{{ org.direccion }}</td>
            <td>{{ org.email }}</td>
            <td>
              <span
                :class="[
                  'badge-estado',
                  org.estado_validacion === 'aceptada' ? 'estado-validada' : 
                  org.estado_validacion === 'cancelada' ? 'estado-cancelada' : 'estado-pendiente',
                ]"
              >
                {{ org.estado_validacion === 'aceptada' ? 'Validada' : 
                   org.estado_validacion === 'cancelada' ? 'Cancelada' : 'Pendiente' }}
              </span>
            </td>
            <td class="celda-acciones">
              <button
                v-if="org.estado_validacion !== 'aceptada'"
                @click="aprobarOrganizacion(org.id_organizacion)"
                class="btn-accion btn-aprobar"
                :disabled="procesando"
              >
                Aprobar
              </button>
              <button
                v-else
                @click="rechazarOrganizacion(org.id_organizacion)"
                class="btn-accion btn-rechazar"
                :disabled="procesando"
              >
                Desactivar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="organizacionesFiltradas.length === 0" class="estado-vacio">
        <p>No se encontraron organizaciones</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AdminService } from '../../services/adminService';
import { useAlert } from '../../composables/useAlert';
import type { IOrganizacion } from '../../types/IOrganizacion';

const { showSuccess, showError } = useAlert();

// Estado
const organizaciones = ref<IOrganizacion[]>([]);
const cargando = ref(true);
const error = ref('');
const procesando = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');

// Organizaciones filtradas
const organizacionesFiltradas = computed(() => {
  let resultado = organizaciones.value;

  // Filtro por búsqueda
  if (busqueda.value.trim()) {
    const busquedaLower = busqueda.value.toLowerCase();
    resultado = resultado.filter(
      (org) =>
        org.nombre.toLowerCase().includes(busquedaLower) ||
        org.email.toLowerCase().includes(busquedaLower)
    );
  }

  // Filtro por estado
  if (filtroEstado.value !== '') {
    if (filtroEstado.value === 'true') {
      resultado = resultado.filter((org) => org.estado_validacion === 'aceptada');
    } else {
      resultado = resultado.filter((org) => org.estado_validacion === 'pendiente' || org.estado_validacion === 'cancelada');
    }
  }

  return resultado;
});

/**
 * Carga las organizaciones desde el servicio
 */
const cargarOrganizaciones = async () => {
  cargando.value = true;
  error.value = '';

  try {
    organizaciones.value = await AdminService.obtenerOrganizaciones();
  } catch (err) {
    console.error('Error al cargar organizaciones:', err);
    error.value =
      err instanceof Error ? err.message : 'No se pudieron cargar las organizaciones';
  } finally {
    cargando.value = false;
  }
};

/**
 * Aprueba una organización
 */
const aprobarOrganizacion = async (idOrganizacion: string) => {
  if (!confirm('¿Estás seguro de que deseas aprobar esta organización?')) {
    return;
  }

  procesando.value = true;

  try {
    await AdminService.actualizarEstadoValidacion(idOrganizacion, true);
    showSuccess('Organización aprobada', 'La organización ha sido validada exitosamente');
    await cargarOrganizaciones();
  } catch (err) {
    console.error('Error al aprobar organización:', err);
    showError(
      'Error',
      err instanceof Error ? err.message : 'No se pudo aprobar la organización'
    );
  } finally {
    procesando.value = false;
  }
};

/**
 * Rechaza/Desactiva una organización
 */
const rechazarOrganizacion = async (idOrganizacion: string) => {
  if (
    !confirm(
      '¿Estás seguro de que deseas desactivar esta organización? Esto revocará su validación.'
    )
  ) {
    return;
  }

  procesando.value = true;

  try {
    await AdminService.actualizarEstadoValidacion(idOrganizacion, false);
    showSuccess('Organización desactivada', 'La validación de la organización ha sido revocada');
    await cargarOrganizaciones();
  } catch (err) {
    console.error('Error al rechazar organización:', err);
    showError(
      'Error',
      err instanceof Error ? err.message : 'No se pudo desactivar la organización'
    );
  } finally {
    procesando.value = false;
  }
};

// Cargar organizaciones al montar
onMounted(() => {
  cargarOrganizaciones();
});
</script>

<style scoped>
.validacion-organizaciones-form {
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

.tabla-organizaciones {
  width: 100%;
  border-collapse: collapse;
}

.tabla-organizaciones thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.tabla-organizaciones th {
  padding: 1rem;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-organizaciones tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.tabla-organizaciones tbody tr:hover {
  background: #f9fafb;
}

.tabla-organizaciones td {
  padding: 1rem;
  font-size: 0.95rem;
  color: #2e2e2e;
}

.badge-estado {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  text-align: center;
}

.estado-validada {
  background: #d1fae5;
  color: #065f46;
}

.estado-pendiente {
  background: #fef3c7;
  color: #92400e;
}

.estado-cancelada {
  background: #fee2e2;
  color: #991b1b;
}

.celda-acciones {
  min-width: 120px;
}

.btn-accion {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-accion:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-aprobar {
  background: #10b981;
  color: white;
}

.btn-aprobar:hover:not(:disabled) {
  background: #059669;
}

.btn-rechazar {
  background: #ef4444;
  color: white;
}

.btn-rechazar:hover:not(:disabled) {
  background: #dc2626;
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

  .tabla-organizaciones {
    min-width: 700px;
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

