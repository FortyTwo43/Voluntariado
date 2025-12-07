<template>
  <div class="lista-proyectos-view">
    <!-- Contenedor principal -->
    <div class="container">
      <div class="page-header">
        <div class="header-title-container">
          <svg class="icon-projects" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <div>
            <h1 class="view-title">Proyectos de Voluntariado</h1>
            <p class="subtitulo">Gestiona los proyectos de voluntariado de tu organización.</p>
          </div>
        </div>
        
        <button 
          type="button" 
          class="btn-crear-proyecto"
          @click="irACrearProyecto"
        >
          <svg class="icon-plus" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Crear Nuevo Proyecto
        </button>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="barra-controles">
        <div class="busqueda-container">
          <svg class="icon-search" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por nombre de proyecto"
            v-model="busqueda"
            class="input-busqueda"
          />
        </div>

        <div class="filtros-container">
          <select v-model="filtroEstado" class="select-filtro">
            <option value="">Estado</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="proximamente">Próximamente</option>
          </select>

          <select v-model="ordenamiento" class="select-filtro">
            <option value="">Ordenar por</option>
            <option value="nombre">Nombre</option>
            <option value="fecha">Fecha</option>
            <option value="voluntarios">Voluntarios</option>
          </select>
        </div>
      </div>

      <!-- Estado: Cargando -->
      <div v-if="cargando" class="estado-carga">
        <div class="spinner-grande"></div>
        <p>Cargando proyectos...</p>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="error" class="estado-error">
        <svg class="icon-error-grande" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3>Error al cargar proyectos</h3>
        <p>{{ error }}</p>
        <button class="btn-reintentar" @click="cargarProyectos">
          Reintentar
        </button>
      </div>

      <!-- Estado: Sin proyectos -->
      <div v-else-if="proyectos.length === 0" class="estado-vacio">
        <svg class="icon-empty" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3>No hay proyectos aún</h3>
        <p>Comienza creando tu primer proyecto de voluntariado</p>
        <button class="btn-crear-primero" @click="irACrearProyecto">
          Crear Primer Proyecto
        </button>
      </div>

      <!-- Tabla de Proyectos -->
      <div v-else class="tabla-container">
        <table class="tabla-proyectos">
          <thead>
            <tr>
              <th>Nombre del Proyecto</th>
              <th>Estado</th>
              <th>Voluntarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="proyecto in proyectos" 
              :key="proyecto.id"
              class="fila-proyecto"
            >
              <!-- Nombre del Proyecto -->
              <td class="celda-proyecto">
                <div class="proyecto-info-tabla">
                  <div class="proyecto-imagen">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="proyecto-detalles-tabla">
                    <div class="proyecto-nombre-tabla">{{ proyecto.nombre }}</div>
                    <div class="proyecto-ubicacion">{{ proyecto.descripcion?.substring(0, 50) }}...</div>
                  </div>
                </div>
              </td>

              <!-- Estado -->
              <td>
                <span :class="['badge-estado', `estado-${proyecto.estado || 'activo'}`]">
                  {{ obtenerEstadoLabel(proyecto.estado || 'activo') }}
                </span>
              </td>

              <!-- Voluntarios -->
              <td class="celda-voluntarios">
                <div class="voluntarios-avatares">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
                <span class="voluntarios-texto">15 / {{ proyecto.cupo_maximo }} Inscritos</span>
              </td>

              <!-- Acciones -->
              <td class="celda-acciones">
                <button 
                  class="btn-accion"
                  @click="verVoluntarios(proyecto.id)"
                  title="Ver Voluntarios"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Voluntarios
                </button>
                <button 
                  class="btn-accion"
                  @click="verAsistencia(proyecto.id)"
                  title="Ver Asistencia"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  Asistencia
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="paginacion">
          <span class="paginacion-info">Mostrando 1 a {{ proyectos.length }} de {{ proyectos.length }} Proyectos</span>
          <div class="paginacion-controles">
            <button class="btn-pagina" disabled>&lt;</button>
            <button class="btn-pagina activo">1</button>
            <button class="btn-pagina">2</button>
            <button class="btn-pagina">3</button>
            <button class="btn-pagina">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Proyecto } from '../../types/proyecto';
import { ProyectosService } from '../../services/proyectos.service';

const router = useRouter();

// Estado
const proyectos = ref<Proyecto[]>([]);
const cargando = ref(true);
const error = ref('');

// Filtros y búsqueda
const busqueda = ref('');
const filtroEstado = ref('');
const ordenamiento = ref('');

/**
 * Carga los proyectos desde el servicio
 */
const getLoggedOrganizationId = (): string | null => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user?.rol === 'organizacion') {
      return user.id || user.id_organizacion || null;
    }
    return null;
  } catch {
    return null;
  }
};

const cargarProyectos = async () => {
  cargando.value = true;
  error.value = '';

  try {
    const orgId = getLoggedOrganizationId();
    if (!orgId) {
      throw new Error('Debes iniciar sesión como organización para ver tus proyectos');
    }
    proyectos.value = await ProyectosService.obtenerProyectosDeOrganizacion(orgId);
  } catch (err) {
    console.error('Error al cargar proyectos:', err);
    error.value = err instanceof Error 
      ? err.message 
      : 'No se pudieron cargar los proyectos';
  } finally {
    cargando.value = false;
  }
};

/**
 * Navega a la vista de crear proyecto
 */
const irACrearProyecto = () => {
  router.push({ name: 'proyectos-crear' });
};




/**
 * Obtiene el label del estado
 */
const obtenerEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    activo: 'Activo',
    completado: 'Completado',
    proximamente: 'Próximamente',
  };
  return labels[estado] || estado;
};

/**
 * Ver voluntarios del proyecto
 */
const verVoluntarios = (id: string) => {
  // TODO: Implementar vista de voluntarios
  alert(`Ver voluntarios del proyecto ${id}`);
};

/**
 * Ver asistencia del proyecto
 */
const verAsistencia = (id: string) => {
  router.push({ name: 'proyectos-asistencia', params: { id } });
};

// Cargar proyectos al montar
onMounted(() => {
  cargarProyectos();
});
</script>

<style scoped>
.lista-proyectos-view {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem);
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: clamp(1rem, 4vw, 2rem);
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.header-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.icon-projects {
  width: clamp(2rem, 5vw, 3rem);
  height: clamp(2rem, 5vw, 3rem);
  color: #4B0082;
  flex-shrink: 0;
}

.view-title {
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  word-break: break-word;
}

.subtitulo {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #5a5a5a;
  margin: 0;
}

.btn-crear-proyecto {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-crear-proyecto:hover {
  background: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.icon-plus {
  width: 1.25rem;
  height: 1.25rem;
}

/* Barra de controles */
.barra-controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.busqueda-container {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.icon-search {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.input-busqueda {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 0.95rem;
  color: #2E2E2E;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-busqueda:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.filtros-container {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.select-filtro {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #2E2E2E;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-width: 120px;
}

.select-filtro:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

/* Estados */
.estado-carga,
.estado-error,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  text-align: center;
}

.spinner-grande {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-error-grande,
.icon-empty {
  width: clamp(3rem, 8vw, 4rem);
  height: clamp(3rem, 8vw, 4rem);
  color: #9ca3af;
  margin-bottom: 1rem;
}

.estado-error h3,
.estado-vacio h3 {
  font-size: clamp(1.125rem, 4vw, 1.5rem);
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
}

.estado-error p,
.estado-vacio p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.5rem 0 1.5rem;
}

.btn-reintentar,
.btn-crear-primero {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reintentar:hover,
.btn-crear-primero:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Tabla de proyectos */
.tabla-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  padding: 1rem 1rem;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
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
  color: #2E2E2E;
}

/* Celda de Proyecto */
.celda-proyecto {
  min-width: 220px;
}

.proyecto-info-tabla {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.proyecto-imagen {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #4B0082 0%, #79C99E 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.proyecto-imagen svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.proyecto-detalles-tabla {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.proyecto-nombre-tabla {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.proyecto-ubicacion {
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* Badge de Estado */
.badge-estado {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
}

.estado-activo {
  background: #d1fae5;
  color: #065f46;
}

.estado-completado {
  background: #dbeafe;
  color: #1e40af;
}

.estado-proximamente {
  background: #fef3c7;
  color: #92400e;
}

/* Celda de Voluntarios */
.celda-voluntarios {
  min-width: 140px;
}

.voluntarios-avatares {
  display: flex;
  margin-bottom: 0.375rem;
}

.avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -0.5rem;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:nth-child(1) {
  background: #4B0082;
}

.avatar:nth-child(2) {
  background: #79C99E;
}

.avatar:nth-child(3) {
  background: #5fb386;
}

.voluntarios-texto {
  font-size: 0.8125rem;
  color: #6b7280;
}

/* Celda de Acciones */
.celda-acciones {
  min-width: 200px;
}

.btn-accion {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.75rem;
  margin-right: 0.375rem;
  margin-bottom: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #4B0082;
  background: white;
  border: 2px solid #79C99E;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-accion:hover {
  background: #79C99E;
  color: white;
}

.btn-accion svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* Paginación */
.paginacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 2px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}

.paginacion-info {
  font-size: 0.8125rem;
  color: #6b7280;
}

.paginacion-controles {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.btn-pagina {
  padding: 0.4rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.25rem;
}

.btn-pagina:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #79C99E;
}

.btn-pagina.activo {
  background: #4B0082;
  color: white;
  border-color: #4B0082;
}

.btn-pagina:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== RESPONSIVE ==================== */

/* Tablet grande */
@media (max-width: 1200px) {
  .tabla-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tabla-proyectos {
    min-width: 700px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .header-title-container {
    flex-direction: column;
    text-align: center;
  }

  .btn-crear-proyecto {
    width: 100%;
  }

  .barra-controles {
    flex-direction: column;
    align-items: stretch;
  }

  .busqueda-container {
    max-width: 100%;
  }

  .filtros-container {
    justify-content: stretch;
  }

  .select-filtro {
    flex: 1;
  }
}

/* Móvil */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .view-title {
    font-size: 1.25rem;
    letter-spacing: 0;
  }

  .subtitulo {
    font-size: 0.875rem;
  }

  .barra-controles {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .input-busqueda,
  .select-filtro {
    padding: 0.625rem 0.875rem;
    padding-left: 2.5rem;
    font-size: 0.875rem;
  }

  .select-filtro {
    padding-left: 0.875rem;
  }

  /* Vista de Cards en móvil en lugar de tabla */
  .tabla-container {
    overflow-x: visible;
  }

  .tabla-proyectos {
    min-width: 0;
    display: block;
  }

  .tabla-proyectos thead {
    display: none;
  }

  .tabla-proyectos tbody {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tabla-proyectos tbody tr {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    gap: 0.75rem;
  }

  .tabla-proyectos tbody tr:hover {
    background: white;
  }

  .tabla-proyectos td {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .tabla-proyectos td::before {
    content: attr(data-label);
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .celda-proyecto,
  .celda-voluntarios,
  .celda-acciones {
    min-width: 0;
  }

  .proyecto-info-tabla {
    flex-direction: row;
  }

  .proyecto-ubicacion {
    max-width: 100%;
  }

  .celda-acciones {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .btn-accion {
    flex: 1;
    justify-content: center;
    margin-right: 0;
    margin-bottom: 0;
  }

  .paginacion {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0.5rem;
  }

  .paginacion-controles {
    justify-content: center;
  }
}

/* Móvil pequeño */
@media (max-width: 480px) {
  .container {
    padding: 0.75rem;
  }

  .page-header {
    padding: 0.875rem;
  }

  .icon-projects {
    display: none;
  }

  .view-title {
    font-size: 1.125rem;
  }

  .btn-crear-proyecto {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .icon-plus {
    width: 1rem;
    height: 1rem;
  }

  .btn-accion {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }

  .btn-pagina {
    padding: 0.35rem 0.5rem;
    min-width: 2rem;
    font-size: 0.75rem;
  }
}
</style>
