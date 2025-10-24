<template>
  <div class="horas-view">
    <!-- Header -->
    <header class="view-header">
      <div class="header-content">
        <div class="header-left">
          <button 
            type="button" 
            class="btn-volver"
            @click="volver"
          >
            <svg class="icon-arrow-left" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Volver
          </button>
          <h1 class="view-title">Registro de Horas de Voluntarios</h1>
        </div>
        
        <button 
          type="button" 
          class="btn-log-hours"
          @click="abrirModalRegistro"
        >
          Registrar Horas
        </button>
      </div>
    </header>

    <!-- Contenedor principal -->
    <div class="container">
      <p class="subtitulo">Gestiona y rastrea las horas de voluntariado para tu organización.</p>

      <!-- Tarjetas de estadísticas -->
      <div class="estadisticas-grid">
        <div class="stat-card">
          <div class="stat-label">Total de Horas Registradas</div>
          <div class="stat-valor">2,456</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Voluntarios Activos</div>
          <div class="stat-valor">82</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Proyecto con Más Horas</div>
          <div class="stat-valor">Community Garden</div>
        </div>
      </div>

      <!-- Barra de controles -->
      <div class="barra-controles">
        <div class="busqueda-container">
          <svg class="icon-search" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por voluntario, proyecto o fecha"
            v-model="busqueda"
            class="input-busqueda"
          />
        </div>

        <div class="filtros-container">
          <select v-model="filtroProyecto" class="select-filtro">
            <option value="">Proyecto</option>
            <option value="community-garden">Community Garden</option>
            <option value="soup-kitchen">Soup Kitchen</option>
            <option value="animal-shelter">Animal Shelter</option>
          </select>

          <select v-model="filtroEstado" class="select-filtro">
            <option value="">Estado</option>
            <option value="aprobado">Aprobado</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazado">Rechazado</option>
          </select>

          <select v-model="rangoFecha" class="select-filtro">
            <option value="">Rango de Fecha</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
          </select>

          <button class="btn-exportar">
            <svg class="icon-export" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <!-- Tabla de horas -->
      <div class="tabla-container">
        <table class="tabla-horas">
          <thead>
            <tr>
              <th>Voluntario</th>
              <th>Proyecto</th>
              <th>Fecha</th>
              <th>Horas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="registro in registros" 
              :key="registro.id"
              class="fila-registro"
            >
              <!-- Voluntario -->
              <td class="celda-voluntario">{{ registro.voluntario }}</td>

              <!-- Proyecto -->
              <td class="celda-proyecto">{{ registro.proyecto }}</td>

              <!-- Fecha -->
              <td class="celda-fecha">{{ registro.fecha }}</td>

              <!-- Horas -->
              <td class="celda-horas">{{ registro.horas }}</td>

              <!-- Estado -->
              <td class="celda-estado">
                <span :class="['badge-estado', `estado-${registro.estado.toLowerCase()}`]">
                  {{ registro.estado }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="celda-acciones">
                <button 
                  class="btn-icono"
                  @click="verDetalle(registro.id)"
                  title="Ver detalle"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  class="btn-icono"
                  @click="editar(registro.id)"
                  title="Editar"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  class="btn-icono"
                  @click="eliminar(registro.id)"
                  title="Eliminar"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="paginacion">
          <span class="paginacion-info">Mostrando 1 a 4 de 100 Registros</span>
          <div class="paginacion-controles">
            <button class="btn-pagina" disabled>Anterior</button>
            <button class="btn-pagina activo">1</button>
            <button class="btn-pagina">2</button>
            <button class="btn-pagina">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado
const busqueda = ref('');
const filtroProyecto = ref('');
const filtroEstado = ref('');
const rangoFecha = ref('');

// Datos de ejemplo
const registros = ref([
  {
    id: '1',
    voluntario: 'John Doe',
    proyecto: 'Community Garden',
    fecha: '2023-10-28',
    horas: 4,
    estado: 'Aprobado'
  },
  {
    id: '2',
    voluntario: 'Jane Smith',
    proyecto: 'Soup Kitchen',
    fecha: '2023-10-25',
    horas: 3,
    estado: 'Pendiente'
  },
  {
    id: '3',
    voluntario: 'Peter Jones',
    proyecto: 'Animal Shelter',
    fecha: '2023-10-24',
    horas: 5,
    estado: 'Rechazado'
  },
  {
    id: '4',
    voluntario: 'Mary Williams',
    proyecto: 'Community Garden',
    fecha: '2023-10-23',
    horas: 2,
    estado: 'Aprobado'
  }
]);

/**
 * Vuelve a la lista de proyectos
 */
const volver = () => {
  router.push({ name: 'proyectos' });
};

/**
 * Abre modal para registrar horas
 */
const abrirModalRegistro = () => {
  alert('Abrir formulario para registrar nuevas horas');
};

/**
 * Ver detalle del registro
 */
const verDetalle = (id: string) => {
  alert(`Ver detalle del registro ${id}`);
};

/**
 * Editar registro
 */
const editar = (id: string) => {
  alert(`Editar registro ${id}`);
};

/**
 * Eliminar registro
 */
const eliminar = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este registro?')) {
    alert(`Registro ${id} eliminado`);
  }
};
</script>

<style scoped>
.horas-view {
  min-height: 100vh;
  background: #F7F5F0;
}

.view-header {
  background: linear-gradient(135deg, #3a0066 0%, #4B0082 100%);
  border-bottom: 3px solid #79C99E;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: 2px solid #79C99E;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.btn-volver:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.btn-log-hours {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #4B0082;
  border: 2px solid #4B0082;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-log-hours:hover {
  background: #3a0066;
  border-color: #3a0066;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.3);
}

.btn-volver:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.icon-arrow-left {
  width: 1.125rem;
  height: 1.125rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.subtitulo {
  font-size: 1rem;
  color: #5a5a5a;
  margin: 0 0 2rem;
}

/* Estadísticas */
.estadisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-valor {
  font-size: 2rem;
  font-weight: 800;
  color: #4B0082;
}

/* Barra de controles */
.barra-controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.busqueda-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
}

.icon-search {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
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
}

.input-busqueda:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.filtros-container {
  display: flex;
  gap: 1rem;
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
}

.select-filtro:focus {
  outline: none;
  border-color: #79C99E;
  box-shadow: 0 0 0 3px rgba(121, 201, 158, 0.1);
}

.btn-exportar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #4B0082;
  border: 2px solid #4B0082;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-exportar:hover {
  background: #3a0066;
  border-color: #3a0066;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.3);
}

.icon-export {
  width: 1.125rem;
  height: 1.125rem;
}

/* Tabla */
.tabla-container {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tabla-horas {
  width: 100%;
  border-collapse: collapse;
}

.tabla-horas thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.tabla-horas th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-horas tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.tabla-horas tbody tr:hover {
  background: #f9fafb;
}

.tabla-horas td {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: #2E2E2E;
}

.celda-voluntario,
.celda-proyecto {
  font-weight: 600;
}

.celda-fecha {
  color: #6b7280;
}

.celda-horas {
  font-weight: 700;
  color: #4B0082;
}

/* Badge de Estado */
.badge-estado {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  text-align: center;
}

.estado-aprobado {
  background: #d1fae5;
  color: #065f46;
}

.estado-pendiente {
  background: #fef3c7;
  color: #92400e;
}

.estado-rechazado {
  background: #fee2e2;
  color: #991b1b;
}

/* Acciones */
.celda-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icono:hover {
  background: #79C99E;
  border-color: #79C99E;
  color: white;
}

.btn-icono svg {
  width: 1.125rem;
  height: 1.125rem;
}

/* Paginación */
.paginacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.paginacion-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.paginacion-controles {
  display: flex;
  gap: 0.5rem;
}

.btn-pagina {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
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

/* Responsive */
@media (max-width: 1024px) {
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

  .select-filtro,
  .btn-exportar {
    flex: 1;
  }

  .tabla-container {
    overflow-x: auto;
  }

  .tabla-horas {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-left {
    flex: 1;
    min-width: 100%;
  }

  .btn-log-hours {
    width: 100%;
  }

  .container {
    padding: 1rem;
  }

  .view-title {
    font-size: 1.25rem;
  }

  .estadisticas-grid {
    grid-template-columns: 1fr;
  }

  .paginacion {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
