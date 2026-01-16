<template>
  <div class="detalle-proyecto-view">
    <!-- Contenedor principal -->
    <div class="container">
      <div class="page-header">
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
        <h1 class="view-title">Detalle del Proyecto</h1>
      </div>
      
      <!-- Estado: Cargando -->
      <div v-if="cargando" class="estado-carga">
        <div class="spinner-grande"></div>
        <p>Cargando proyecto...</p>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="error" class="estado-error">
        <svg class="icon-error-grande" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3>Error al cargar proyecto</h3>
        <p>{{ error }}</p>
        <button class="btn-volver" @click="volver">
          Volver a la Lista
        </button>
      </div>

      <!-- Contenido del proyecto -->
      <div v-else-if="proyecto" class="proyecto-detalle">
        <!-- Información del proyecto -->
        <div class="detalle-card">
          <div class="card-header">
              <div class="nombre-categoria header-content">
                <span :class="['categoria-badge', `badge-${proyecto.categoria}`]">
                  {{ getCategoriaLabel(proyecto.categoria) }}
                </span>
                <h2 class="proyecto-nombre header-name">{{ proyecto.nombre }}</h2>
              </div>
            </div>

          <div class="card-body">
            <!-- El nombre del proyecto se muestra ahora en el header -->
            <p v-if="proyecto.descripcion" class="proyecto-descripcion">
              {{ proyecto.descripcion }}
            </p>

            <div class="proyecto-detalles">
              <div class="detalle-item">
                <div class="detalle-label">Fecha de Inicio</div>
                <div class="detalle-valor">{{ formatearFecha(proyecto.fecha_inicio) }}</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Fecha de Fin</div>
                <div class="detalle-valor">{{ formatearFecha(proyecto.fecha_fin) }}</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Capacidad Máxima</div>
                <div class="detalle-valor">{{ proyecto.cupo_maximo }} voluntarios</div>
              </div>

              <div class="detalle-item">
                <div class="detalle-label">Organización</div>
                <div class="detalle-valor">{{ nombreOrganizacion || proyecto.id_organizacion }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de proyecto completado: ahora ubicado debajo de Mis Horas y Asistencia -->
        <div v-if="esEstadoCompletado" class="mensaje-estado completado mensaje-completo-rectangular">
          <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div class="mensaje-contenido">
            <h4>Proyecto Completado</h4>
            <p>Felicitaciones! Has completado exitosamente este proyecto de voluntariado.</p>
          </div>
        </div>

        <!-- Horario Semanal -->
        <div class="horario-card">
          <div class="horario-header">
            <svg class="icon-calendario" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            <h3 class="horario-titulo">Horario Semanal</h3>
          </div>

          <div v-if="cargandoHorario" class="horario-loading">
            <div class="spinner"></div>
            <p>Cargando horario...</p>
          </div>

          <div v-else-if="errorHorario" class="horario-sin-datos">
            <svg class="icon-alerta" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p>{{ errorHorario }}</p>
          </div>

          <div v-else-if="!horario || horasAgrupadas.length === 0" class="horario-sin-datos">
            <svg class="icon-info" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <p>Este proyecto aún no tiene horario asignado</p>
          </div>

          <div v-else class="horario-tabla">
            <div 
              v-for="dia in horasAgrupadas" 
              :key="dia.dia" 
              class="dia-row"
              :class="{ 'dia-sin-horas': dia.horas.length === 0 }"
            >
              <div class="dia-nombre">{{ dia.dia }}</div>
              <div class="dia-horas">
                <div v-if="dia.horas.length === 0" class="sin-horas">
                  Sin horario
                </div>
                <div v-else class="horas-lista">
                  <div 
                    v-for="hora in dia.horas" 
                    :key="hora.id_hora" 
                    class="hora-item"
                  >
                    <svg class="icon-reloj" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ formatearHora(hora.hora_inicio) }} - {{ formatearHora(hora.hora_fin) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de inscripción si no está inscrito -->
        <div v-if="!estaInscrito" class="seccion-inscripcion">
          <div class="inscripcion-card">
            <div class="inscripcion-contenido">
              <svg class="icon-inscripcion" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <h3>¿Te interesa este proyecto?</h3>
              <p>Inscríbete para participar y comenzar a contribuir como voluntario.</p>
            </div>
            <button class="btn-inscribirse" @click="inscribirse" :disabled="inscribiendo">
              {{ inscribiendo ? 'Inscribiendo...' : 'Inscribirse al Proyecto' }}
            </button>
          </div>
        </div>

        <!-- Sección de Horas y Asistencia (solo si está inscrito y aceptado) -->
        <div v-if="mostrarHorasYAsistencia" class="horas-asistencia-container">
          <!-- Mis Horas -->
          <div class="horas-card">
            <div class="horas-header">
              <svg class="icon-horas" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <h3 class="horas-titulo">Mis Horas</h3>
            </div>
            <div class="horas-contenido">
              <div class="horas-numero">{{ horasRegistradas }}</div>
              <div class="horas-texto">horas registradas</div>
            </div>
          </div>

          <!-- Asistencia -->
          <div class="asistencia-card">
            <div class="asistencia-header">
              <svg class="icon-asistencia" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <h3 class="asistencia-titulo">Asistencia</h3>
            </div>
            <div class="asistencia-contenido">
              <div class="asistencia-stats">
                <div class="stat-item">
                  <span class="stat-numero">{{ asistenciasRegistradas }}</span>
                  <span class="stat-label">asistencias</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-numero">{{ totalSesiones }}</span>
                  <span class="stat-label">total sesiones</span>
                </div>
              </div>
              <div class="asistencia-porcentaje">
                <div class="porcentaje-barra">
                  <div class="porcentaje-progreso" :style="{ width: porcentajeAsistencia + '%' }"></div>
                </div>
                <span class="porcentaje-texto">{{ porcentajeAsistencia }}% de asistencia</span>
              </div>
            </div>
            <button class="btn-ver-asistencia" @click="verAsistencia">
              Ver Historial
            </button>
          </div>
          
          <!-- Mensaje de proyecto completado (moved abajo) -->
        </div>

        <!-- Mensaje para inscripción en espera -->
        <div v-else-if="esEstadoEspera" class="mensaje-estado espera">
          <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          <h3>Inscripción Pendiente</h3>
          <p>Tu solicitud de inscripción está siendo revisada por la organización. Te notificaremos cuando sea aceptada.</p>
          <div class="info-espera">
            <svg class="icon-info" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <span>Una vez aceptado, podrás registrar tus horas y asistencias.</span>
          </div>
        </div>

        <!-- Mensaje para inscripción cancelada -->
        <div v-else-if="esEstadoCancelado" class="mensaje-estado cancelado">
          <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <h3>Inscripción Cancelada</h3>
          <p>Tu inscripción a este proyecto ha sido cancelada por la organización o un administrador.</p>
          <div class="info-cancelado">
            <p>Si tienes dudas sobre esta decisión, por favor contacta directamente con la organización.</p>
          </div>
        </div>

        <!-- Mensaje si está inscrito pero pendiente (fallback para lógica antigua) -->
        <div v-else-if="estaInscrito && !inscripcionAceptada && !estadoInscripcion" class="seccion-inscripcion">
          <!-- Mis Horas -->
          <div class="horas-card">
            <div class="horas-header">
              <svg class="icon-horas" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <h3 class="horas-titulo">Mis Horas</h3>
            </div>
            <div class="horas-contenido">
              <div class="horas-numero">{{ horasRegistradas }}</div>
              <div class="horas-texto">horas registradas</div>
            </div>
          </div>

          <!-- Asistencia -->
          <div class="asistencia-card">
            <div class="asistencia-header">
              <svg class="icon-asistencia" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <h3 class="asistencia-titulo">Asistencia</h3>
            </div>
            <div class="asistencia-contenido">
              <div class="asistencia-stats">
                <div class="stat-item">
                  <span class="stat-numero">{{ asistenciasRegistradas }}</span>
                  <span class="stat-label">asistencias</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-numero">{{ totalSesiones }}</span>
                  <span class="stat-label">total sesiones</span>
                </div>
              </div>
              <div class="asistencia-porcentaje">
                <div class="porcentaje-barra">
                  <div class="porcentaje-progreso" :style="{ width: porcentajeAsistencia + '%' }"></div>
                </div>
                <span class="porcentaje-texto">{{ porcentajeAsistencia }}% de asistencia</span>
              </div>
            </div>
            <button class="btn-ver-asistencia" @click="verAsistencia">
              Ver Historial
            </button>
          </div>
          
          <!-- Mensaje de proyecto completado -->
          <div v-if="estadoInscripcion === 'completado'" class="mensaje-estado completado">
            <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <h4>Proyecto Completado</h4>
            <p>Felicitaciones! Has completado exitosamente este proyecto de voluntariado.</p>
          </div>
        </div>

        <!-- Mensaje para inscripción en espera -->
        <div v-else-if="estadoInscripcion === 'espera'" class="mensaje-estado espera">
          <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          <h3>Inscripción Pendiente</h3>
          <p>Tu solicitud de inscripción está siendo revisada por la organización. Te notificaremos cuando sea aceptada.</p>
          <div class="info-espera">
            <svg class="icon-info" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <span>Una vez aceptado, podrás registrar tus horas y asistencias.</span>
          </div>
        </div>

        <!-- Mensaje para inscripción cancelada -->
        <div v-else-if="estadoInscripcion === 'cancelado'" class="mensaje-estado cancelado">
          <svg class="icon-estado" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <h3>Inscripción Cancelada</h3>
          <p>Tu inscripción a este proyecto ha sido cancelada por la organización o un administrador.</p>
          <div class="info-cancelado">
            <p>Si tienes dudas sobre esta decisión, por favor contacta directamente con la organización.</p>
          </div>
        </div>

        <!-- Mensaje si está inscrito pero pendiente (fallback para lógica antigua) -->
        <div v-else-if="estaInscrito && !inscripcionAceptada && !estadoInscripcion" class="seccion-inscripcion">
          <!-- Mis Horas -->
          <div class="horas-card">
            <div class="horas-header">
              <svg class="icon-horas" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <h3 class="horas-titulo">Mis Horas</h3>
            </div>
            <div class="horas-contenido">
              <div class="horas-numero">{{ horasRegistradas }}</div>
              <div class="horas-texto">horas registradas</div>
            </div>
          </div>

          <!-- Asistencia -->
          <div class="asistencia-card">
            <div class="asistencia-header">
              <svg class="icon-asistencia" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <h3 class="asistencia-titulo">Asistencia</h3>
            </div>
            <div class="asistencia-contenido">
              <div class="asistencia-stats">
                <div class="stat-item">
                  <span class="stat-numero">{{ asistenciasRegistradas }}</span>
                  <span class="stat-label">asistencias</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-numero">{{ totalSesiones }}</span>
                  <span class="stat-label">total sesiones</span>
                </div>
              </div>
              <div class="asistencia-porcentaje">
                <div class="porcentaje-barra">
                  <div class="porcentaje-progreso" :style="{ width: porcentajeAsistencia + '%' }"></div>
                </div>
                <span class="porcentaje-texto">{{ porcentajeAsistencia }}% de asistencia</span>
              </div>
            </div>
            <button class="btn-ver-asistencia" @click="verAsistencia">
              Ver Historial
            </button>
          </div>
        </div>

        <!-- Mensaje si está inscrito pero pendiente -->
        <div v-else-if="estaInscrito && !inscripcionAceptada" class="seccion-pendiente">
          <div class="pendiente-card">
            <svg class="icon-pendiente" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            <h3>Inscripción Pendiente</h3>
            <p>Tu inscripción está siendo revisada por la organización. Te notificaremos cuando sea aceptada.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Proyecto } from '../../types/proyecto';
import type { IHorario } from '../../types/IHorario';
import type { IHora } from '../../types/IHora';
import type { IInscripcion, EstadoInscripcion } from '../../types/IInscripcion';
import { ProyectosService } from '../../services/proyectos.service';
import HorariosService from '../../services/horarios.service';
import HorasService from '../../services/horas.service';
import InscripcionesService from '../../services/inscripciones.service';
import { RegistroHorasService } from '../../services/registroHoras.service';
import AsistenciasService from '../../services/asistencias.service';
import { obtenerOrganizacionPorId } from '../../services/organizationService';
import { useAlert } from '../../composables/useAlert';

const router = useRouter();
const route = useRoute();
const { showSuccess, showError } = useAlert();

// Estado del proyecto
const proyecto = ref<Proyecto | null>(null);
const nombreOrganizacion = ref<string>('');
const cargando = ref(true);
const error = ref('');
let orgId: string | null = null;

// Estado del horario
const horario = ref<IHorario | null>(null);
const horas = ref<IHora[]>([]);
const cargandoHorario = ref(false);
const errorHorario = ref('');

// Estado de inscripción
const inscripcion = ref<IInscripcion | null>(null);
const estaInscrito = ref(false);
const inscripcionAceptada = ref(false);
const inscribiendo = ref(false);
const idVoluntario = ref<string | null>(null);
const estadoInscripcion = ref<EstadoInscripcion | null>(null);

// Estado de horas y asistencia (datos reales de la BD)
const horasRegistradas = ref(0);
const asistenciasRegistradas = ref(0);
const totalSesiones = ref(0);
const porcentajeAsistencia = ref(0);
const cargandoEstadisticas = ref(false);

// Computed properties para evaluar estados
const esEstadoActiva = computed(() => estadoInscripcion.value === 'activa');
const esEstadoEspera = computed(() => estadoInscripcion.value === 'espera');
const esEstadoCompletado = computed(() => estadoInscripcion.value === 'completado');
const esEstadoCancelado = computed(() => estadoInscripcion.value === 'cancelado');
const mostrarHorasYAsistencia = computed(() => 
  esEstadoActiva.value || esEstadoCompletado.value || (inscripcionAceptada.value && !estadoInscripcion.value)
);

/**
 * Horas agrupadas por día de la semana
 */
const horasAgrupadas = computed(() => {
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const agrupado = HorasService.agruparHorasPorDia(horas.value);
  
  return diasSemana.map(dia => ({
    dia,
    horas: agrupado[dia.toLowerCase()] || []
  }));
});

/**
 * Verifica si el voluntario está inscrito en el proyecto
 */
const verificarInscripcion = async (idProyecto: string) => {
  if (!idVoluntario.value) return;

  try {
    const inscripcionEncontrada = await InscripcionesService.verificarInscripcionVoluntario(
      idProyecto,
      idVoluntario.value
    );
    
    if (inscripcionEncontrada) {
      inscripcion.value = inscripcionEncontrada;
      estaInscrito.value = true;
      // Guardar estado de la inscripción para las condiciones de la vista
      estadoInscripcion.value = inscripcionEncontrada.estado;

      // Considerar 'activa' y 'completado' como estados en los que debe cargarse estadística
      inscripcionAceptada.value = inscripcionEncontrada.estado === 'activa' || inscripcionEncontrada.estado === 'completado';

      // Si está inscrito y aceptado (o completado), cargar estadísticas
      if (inscripcionAceptada.value) {
        await cargarEstadisticas(inscripcionEncontrada.id_inscripcion, idProyecto);
      }
    }
  } catch (err) {
    console.error('Error al verificar inscripción:', err);
  }
};

/**
 * Carga las estadísticas de horas y asistencia del voluntario
 */
const cargarEstadisticas = async (idInscripcion: string, idProyecto: string) => {
  if (!idVoluntario.value) return;
  
  cargandoEstadisticas.value = true;
  
  try {
    // Cargar total de horas registradas
    const totalHoras = await RegistroHorasService.calcularTotalHoras(idInscripcion);
    horasRegistradas.value = totalHoras;
    
    // Cargar estadísticas de asistencia
    const estadisticas = await AsistenciasService.calcularEstadisticasAsistencia(
      idVoluntario.value,
      idProyecto
    );
    
    asistenciasRegistradas.value = estadisticas.asistencias;
    totalSesiones.value = estadisticas.totalSesiones;
    porcentajeAsistencia.value = estadisticas.porcentaje;
  } catch (err) {
    console.error('Error al cargar estadísticas:', err);
    // No lanzar error, solo mostrar valores en 0
  } finally {
    cargandoEstadisticas.value = false;
  }
};

/**
 * Carga el proyecto por ID
 */
const cargarProyecto = async () => {
  cargando.value = true;
  error.value = '';

  try {
    const id = route.params.id as string;
    
    // Obtener usuario logueado (organización o voluntario)
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.rol === 'organizacion') {
          orgId = user.id || user.id_organizacion || null;
        } else if (user?.rol === 'voluntario') {
          idVoluntario.value = user.id || user.id_voluntario || null;
        }
      }
    } catch {}

    proyecto.value = await ProyectosService.obtenerProyectoPorId(id);

    // Cargar nombre de la organización
    if (proyecto.value.id_organizacion) {
      try {
        const org = await obtenerOrganizacionPorId(proyecto.value.id_organizacion);
        nombreOrganizacion.value = org?.nombre || proyecto.value.id_organizacion;
      } catch {
        nombreOrganizacion.value = proyecto.value.id_organizacion;
      }
    }

    // Verificar que el proyecto pertenezca a la organización (solo si es organización)
    if (orgId && proyecto.value.id_organizacion !== orgId) {
      throw new Error('No estás autorizado para ver este proyecto');
    }

    // Si es voluntario, verificar inscripción
    if (idVoluntario.value) {
      await verificarInscripcion(id);
    }

    // Cargar horario después de cargar el proyecto
    await cargarHorario(id);
  } catch (err) {
    console.error('Error al cargar proyecto:', err);
    error.value = err instanceof Error 
      ? err.message 
      : 'No se pudo cargar el proyecto';
  } finally {
    cargando.value = false;
  }
};

/**
 * Carga el horario y las horas del proyecto
 */
const cargarHorario = async (idProyecto: string) => {
  cargandoHorario.value = true;
  errorHorario.value = '';

  try {
    // Obtener horario del proyecto
    const horarioObtenido = await HorariosService.obtenerHorarioPorProyecto(idProyecto);
    horario.value = horarioObtenido;

    if (horarioObtenido) {
      // Obtener horas del horario
      const horasObtenidas = await HorasService.obtenerHorasPorHorario(horarioObtenido.id_horario);
      horas.value = horasObtenidas;
    } else {
      horas.value = [];
    }
  } catch (err) {
    console.error('Error al cargar horario:', err);
    errorHorario.value = 'No se pudo cargar el horario del proyecto';
  } finally {
    cargandoHorario.value = false;
  }
};

/**
 * Vuelve a la lista de proyectos
 */
const volver = () => {
  router.back();
};

/**
 * Obtiene el label de la categoría
 */
const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    social: 'Social',
    educativo: 'Educativo',
    ambiental: 'Ambiental',
  };
  return labels[categoria] || categoria;
};

/**
 * Formatea una fecha
 */
const formatearFecha = (fecha: string): string => {
  if (!fecha) return '-';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return fecha;
  }
};

/**
 * Formatea una hora de formato HH:MM:SS a HH:MM
 */
const formatearHora = (hora: string): string => {
  if (!hora) return '-';
  
  try {
    // Si viene en formato HH:MM:SS, extraer solo HH:MM
    const partes = hora.split(':');
    return `${partes[0]}:${partes[1]}`;
  } catch {
    return hora;
  }
};

/**
 * Ver historial de asistencia del voluntario
 */
const verAsistencia = () => {
  if (proyecto.value && idVoluntario.value) {
    router.push({ 
      name: 'voluntario-historial-asistencias', 
      params: { idProyecto: proyecto.value.id } 
    });
  }
};

/**
 * Inscribirse al proyecto
 */
const inscribirse = async () => {
  if (!proyecto.value || !idVoluntario.value) return;
  
  inscribiendo.value = true;
  
  try {
    // Se asegura que la fecha sea YYYY-MM-DD y tipo string
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}-${mm}-${dd}`;
    // Guardar la inscripción en estado 'espera' para que la organización la revise
    const nuevaInscripcion: Omit<IInscripcion, 'id_inscripcion'> = {
      id_voluntario: idVoluntario.value,
      id_proyecto: proyecto.value.id,
      fecha_inscripcion: fechaFormateada,
      estado: 'espera'
    };

    const inscripcionCreada = await InscripcionesService.crearInscripcion(nuevaInscripcion);
    
    inscripcion.value = inscripcionCreada;
    estaInscrito.value = true;
    // Guardar el estado recibido desde el backend (espera/activa/completado/cancelado)
    estadoInscripcion.value = inscripcionCreada.estado;
    inscripcionAceptada.value = inscripcionCreada.estado === 'activa' || inscripcionCreada.estado === 'completado';
    // Si la inscripción se considera aceptada (ej. backend devolvió 'activa' o 'completado'), cargar estadísticas
    if (inscripcionAceptada.value) {
      await cargarEstadisticas(inscripcionCreada.id_inscripcion, proyecto.value.id);
    }
    
    showSuccess('¡Inscripción exitosa! La organización revisará tu solicitud.');
  } catch (err) {
    console.error('Error al inscribirse:', err);
    showError('No se pudo completar la inscripción. Intenta nuevamente.');
  } finally {
    inscribiendo.value = false;
  }
};

// Cargar proyecto al montar
onMounted(() => {
  // Obtener estado de inscripción desde la query string
  const estadoQuery = route.query.estado as EstadoInscripcion | undefined;
  if (estadoQuery) {
    estadoInscripcion.value = estadoQuery;
  }
  cargarProyecto();
});
</script>

<style scoped>
.detalle-proyecto-view {
  background: #F7F5F0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.page-header {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2rem);
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 2vw, 1.25rem);
  font-size: clamp(0.8rem, 2vw, 0.95rem);
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
  white-space: nowrap;
}

/* .btn-volver:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
} */

.icon-arrow-left {
  width: clamp(0.9rem, 2vw, 1.125rem);
  height: clamp(0.9rem, 2vw, 1.125rem);
  flex-shrink: 0;
}

/* .view-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
} */

.estado-carga,
.estado-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
  text-align: center;
}

.spinner-grande,
.spinner {
  width: clamp(2rem, 5vw, 3rem);
  height: clamp(2rem, 5vw, 3rem);
  border: 4px solid #e5e7eb;
  border-top-color: #4B0082;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-error-grande {
  width: clamp(3rem, 7vw, 4rem);
  height: clamp(3rem, 7vw, 4rem);
  color: #ef4444;
  margin-bottom: 1rem;
}

.estado-error h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
}

.estado-error p {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #6b7280;
  margin: 0.5rem 0 1.5rem;
}

.proyecto-detalle {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
}

.detalle-card,
.horario-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  padding: clamp(1rem, 2vw, 1.5rem);
  background: #f3eeff;
  border-bottom: 2px solid #79C99E;
  /* Alineamos nombre y badge */
  justify-content: space-between;
}

.categoria-badge {
  display: inline-block;
  padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem);
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  font-weight: 600;
  border-radius: 6px;
}

.badge-social {
  background: #dbeafe;
  color: #1e40af;
}

.badge-educativo {
  background: #fef3c7;
  color: #92400e;
}

.badge-ambiental {
  background: #d1fae5;
  color: #065f46;
}

.card-body {
  padding: clamp(1.5rem, 3vw, 2rem);
}

/* Header específico: nombre + badge dentro del card-header */
.card-header .nombre-categoria {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.card-header .proyecto-nombre.header-name {
  font-size: clamp(1.25rem, 3vw, 1.6rem);
  margin: 0;
  font-weight: 800;
  color: #4B0082;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.proyecto-descripcion {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #5a5a5a;
  line-height: 1.7;
  margin: 0 0 clamp(1.5rem, 3vw, 2rem) 0;
}

.proyecto-detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(180px, 40vw, 200px), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.detalle-item {
  padding: clamp(1rem, 2vw, 1.25rem);
  background: #e8f5ed;
  border-radius: 6px;
  border: 2px solid #79C99E;
}

.detalle-label {
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 700;
  color: #5a5a5a;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalle-valor {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  font-weight: 700;
  color: #2E2E2E;
  word-break: break-word;
}

/* Horario Semanal */
.horario-header {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  padding: clamp(1rem, 2vw, 1.5rem);
  background: #f3eeff;
  border-bottom: 2px solid #79C99E;
}

.icon-calendario {
  width: clamp(1.5rem, 4vw, 2rem);
  height: clamp(1.5rem, 4vw, 2rem);
  color: #4B0082;
  flex-shrink: 0;
}

.horario-titulo {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.horario-loading,
.horario-sin-datos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: clamp(2rem, 4vw, 3rem);
  text-align: center;
}

.horario-loading p,
.horario-sin-datos p {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #6b7280;
  margin: 0;
}

.icon-alerta,
.icon-info {
  width: clamp(2.5rem, 5vw, 3rem);
  height: clamp(2.5rem, 5vw, 3rem);
  color: #f59e0b;
}

.icon-info {
  color: #3b82f6;
}

.horario-tabla {
  padding: clamp(1rem, 2vw, 1.5rem);
}

.dia-row {
  display: grid;
  grid-template-columns: clamp(100px, 20vw, 150px) 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid #e5e7eb;
  align-items: start;
}

.dia-row:last-child {
  border-bottom: none;
}

.dia-row.dia-sin-horas {
  opacity: 0.6;
}

.dia-nombre {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  font-weight: 700;
  color: #4B0082;
  text-transform: capitalize;
  padding-top: 0.25rem;
}

.dia-horas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sin-horas {
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: #9ca3af;
  font-style: italic;
  padding: 0.25rem 0;
}

.horas-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hora-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
  background: #e8f5ed;
  border-radius: 6px;
  border: 1px solid #79C99E;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 600;
  color: #2E2E2E;
}

.icon-reloj {
  width: clamp(1rem, 2vw, 1.125rem);
  height: clamp(1rem, 2vw, 1.125rem);
  color: #4B0082;
  flex-shrink: 0;
}

/* Horas y Asistencia */
.horas-asistencia-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 45vw, 300px), 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
}

.horas-card,
.asistencia-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.horas-header,
.asistencia-header {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  padding-bottom: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 2px solid #e8f5ed;
}

.icon-horas,
.icon-asistencia {
  width: clamp(1.5rem, 4vw, 2rem);
  height: clamp(1.5rem, 4vw, 2rem);
  color: #4B0082;
  flex-shrink: 0;
}

.horas-titulo,
.asistencia-titulo {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.horas-contenido {
  text-align: center;
  padding: clamp(1rem, 2vw, 1.5rem) 0;
}

.horas-numero {
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.horas-texto {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #5a5a5a;
  font-weight: 600;
}

.btn-registrar-horas,
.btn-ver-asistencia {
  width: 100%;
  padding: clamp(0.7rem, 2vw, 0.875rem);
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-registrar-horas:hover,
.btn-ver-asistencia:hover {
  background: #66b388;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.asistencia-contenido {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.asistencia-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: clamp(0.75rem, 2vw, 1rem);
  background: #f3eeff;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-numero {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
}

.stat-label {
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  color: #5a5a5a;
  font-weight: 600;
}

.stat-divider {
  width: 2px;
  height: clamp(2.5rem, 6vw, 3rem);
  background: #79C99E;
}

.asistencia-porcentaje {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.porcentaje-barra {
  width: 100%;
  height: clamp(1.25rem, 3vw, 1.5rem);
  background: #e8f5ed;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #79C99E;
}

.porcentaje-progreso {
  height: 100%;
  background: linear-gradient(90deg, #79C99E 0%, #4B0082 100%);
  transition: width 0.3s ease;
}

.porcentaje-texto {
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 700;
  color: #4B0082;
  text-align: center;
}

/* Responsive para tablets */
@media (max-width: 1024px) {
  .proyecto-detalles {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .dia-row {
    grid-template-columns: 120px 1fr;
  }
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-volver {
    width: 100%;
    justify-content: center;
  }

  .proyecto-detalles {
    grid-template-columns: 1fr;
  }

  .horas-asistencia-container {
    grid-template-columns: 1fr;
  }

  .dia-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .dia-nombre {
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #e8f5ed;
  }
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #79C99E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.70rem;
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: 0px solid #79C99E;
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

.icon-arrow-left {
  width: 1.125rem;
  height: 1.125rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.estado-carga,
.estado-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
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

.icon-error-grande {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.estado-error h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
}

.estado-error p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.5rem 0 1.5rem;
}

.detalle-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  padding: 1.5rem;
  background: #f3eeff;
  border-bottom: 2px solid #79C99E;
}

.categoria-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
}

.badge-social {
  background: #dbeafe;
  color: #1e40af;
}

.badge-educativo {
  background: #fef3c7;
  color: #92400e;
}

.badge-ambiental {
  background: #d1fae5;
  color: #065f46;
}

.card-body {
  padding: 2rem;
}

.proyecto-nombre {
  font-size: 1.65rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.proyecto-descripcion {
  font-size: 1rem;
  color: #5a5a5a;
  line-height: 1.7;
  margin: 0;
}

.proyecto-detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detalle-item {
  padding: 1.25rem;
  background: #e8f5ed;
  border-radius: 6px;
  border: 2px solid #79C99E;
}

.detalle-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #5a5a5a;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalle-valor {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2E2E2E;
}

/* Horas y Asistencia */
.horas-asistencia-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.horas-card,
.asistencia-card {
  background: white;
  border: 2px solid #79C99E;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.horas-header,
.asistencia-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8f5ed;
}

.icon-horas,
.icon-asistencia {
  width: 2rem;
  height: 2rem;
  color: #4B0082;
}

.horas-titulo,
.asistencia-titulo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4B0082;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.horas-contenido {
  text-align: center;
  padding: 1.5rem 0;
}

.horas-numero {
  font-size: 4rem;
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.horas-texto {
  font-size: 1rem;
  color: #5a5a5a;
  font-weight: 600;
}

.btn-registrar-horas,
.btn-ver-asistencia {
  width: 100%;
  padding: 0.875rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: #79C99E;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-registrar-horas:hover,
.btn-ver-asistencia:hover {
  background: #66b388;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(121, 201, 158, 0.3);
}

.asistencia-contenido {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.asistencia-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  background: #f3eeff;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-numero {
  font-size: 2.5rem;
  font-weight: 800;
  color: #4B0082;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #5a5a5a;
  font-weight: 600;
}

.stat-divider {
  width: 2px;
  height: 3rem;
  background: #79C99E;
}

.asistencia-porcentaje {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.porcentaje-barra {
  width: 100%;
  height: 1.5rem;
  background: #e8f5ed;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #79C99E;
}

.porcentaje-progreso {
  height: 100%;
  background: linear-gradient(90deg, #79C99E 0%, #4B0082 100%);
  transition: width 0.3s ease;
}

.porcentaje-texto {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4B0082;
  text-align: center;
}

/* Sección de inscripción */
.seccion-inscripcion {
  margin-top: clamp(1.5rem, 3vw, 2rem);
}

.inscripcion-card {
  background: white;
  border-radius: 12px;
  padding: clamp(2rem, 4vw, 3rem);
  border: 2px solid #79C99E;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.inscripcion-contenido {
  margin-bottom: 2rem;
}

.icon-inscripcion {
  width: clamp(3rem, 6vw, 4rem);
  height: clamp(3rem, 6vw, 4rem);
  color: #79C99E;
  margin: 0 auto 1.5rem;
}

.inscripcion-card h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #4B0082;
  margin-bottom: 1rem;
}

.inscripcion-card p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: #5a5a5a;
  line-height: 1.6;
}

.btn-inscribirse {
  background: linear-gradient(135deg, #79C99E 0%, #4B0082 100%);
  color: white;
  border: none;
  padding: clamp(0.875rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
  border-radius: 8px;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-inscribirse:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(121, 201, 158, 0.4);
}

.btn-inscribirse:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sección pendiente */
.seccion-pendiente {
  margin-top: clamp(1.5rem, 3vw, 2rem);
}

.pendiente-card {
  background: #FFF9E6;
  border-radius: 12px;
  padding: clamp(2rem, 4vw, 3rem);
  border: 2px solid #FFD700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.icon-pendiente {
  width: clamp(3rem, 6vw, 4rem);
  height: clamp(3rem, 6vw, 4rem);
  color: #FFD700;
  margin: 0 auto 1.5rem;
}

.pendiente-card h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #D4A017;
  margin-bottom: 1rem;
}

.pendiente-card p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: #8B7500;
  line-height: 1.6;
}

/* Mensajes de estado */
.mensaje-estado {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mensaje-estado.espera {
  border: 2px solid #ffc107;
  background: #fff9e6;
}

.mensaje-estado.completado {
  border: 2px solid #28a745;
  background: #e8f5e9;
}

/* Estilo rectangular, más ancho y menos alto para el mensaje de proyecto completado */
.mensaje-completo-rectangular {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  min-height: 56px;
}

.mensaje-completo-rectangular .icon-estado {
  width: 2.25rem;
  height: 2.25rem;
}

.mensaje-completo-rectangular .mensaje-contenido {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.mensaje-completo-rectangular h4 {
  font-size: 1.125rem;
  margin: 0;
  font-weight: 800;
  color: #155724;
}

.mensaje-completo-rectangular p {
  margin: 0;
  font-size: 0.95rem;
  color: #155724;
  opacity: 0.95;
}

.mensaje-estado.cancelado {
  border: 2px solid #dc3545;
  background: #ffe6e8;
}

.icon-estado {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.mensaje-estado.espera .icon-estado {
  color: #ffc107;
}

.mensaje-estado.completado .icon-estado {
  color: #28a745;
}

.mensaje-estado.cancelado .icon-estado {
  color: #dc3545;
}

.mensaje-estado h3,
.mensaje-estado h4 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}

.mensaje-estado.espera h3 {
  color: #856404;
}

.mensaje-estado.completado h4 {
  color: #155724;
}

.mensaje-estado.cancelado h3 {
  color: #721c24;
}

.mensaje-estado p {
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
}

.mensaje-estado.espera p {
  color: #856404;
}

.mensaje-estado.completado p {
  color: #155724;
}

.mensaje-estado.cancelado p {
  color: #721c24;
}

.info-espera,
.info-cancelado {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.icon-info {
  width: 1.5rem;
  height: 1.5rem;
  color: #17a2b8;
  flex-shrink: 0;
}

.info-espera span {
  font-size: 0.9375rem;
  color: #4a5568;
}

.info-cancelado p {
  font-size: 0.9375rem;
  color: #4a5568;
  margin: 0;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .proyecto-nombre {
    font-size: 1.5rem;
  }

  .proyecto-detalles {
    grid-template-columns: 1fr;
  }

  .horas-asistencia-container {
    grid-template-columns: 1fr;
  }

  .horas-numero {
    font-size: 3rem;
  }

  .stat-numero {
    font-size: 2rem;
  }
}
</style>
