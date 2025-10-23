<template>
  <div class="crear-proyecto-view">
    <!-- Header con título y botones de navegación -->
    <header class="view-header">
      <div class="header-content">
        <div class="header-title-container">
          <button 
            type="button" 
            class="btn-back"
            @click="volverALista"
            title="Volver a la lista"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <svg class="icon-project" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 class="view-title">Creación de Proyecto</h1>
        </div>
        
        <button 
          v-if="pasoActual < 3"
          type="button" 
          class="save-draft-button"
          @click="guardarBorrador"
        >
          Guardar Borrador
        </button>
      </div>
    </header>

    <!-- Contenedor del asistente -->
    <div class="wizard-container">
      <div class="wizard-card">
        <!-- Título principal -->
        <h2 class="wizard-title">Crear un Nuevo Proyecto</h2>
        
        <!-- Barra de progreso mejorada -->
        <BarraProgresoProyecto 
          :pasoActual="pasoActual - 1" 
          :totalPasos="3" 
        />

        <!-- Contenido del formulario -->
        <div class="form-content">
          <!-- Paso 1: Nombre del proyecto -->
          <FormPaso1
            v-if="pasoActual === 1"
            v-model="formData.nombre"
            @validacion-cambio="(valido: boolean) => validacionPasos.paso1 = valido"
            @siguiente-paso="pasoSiguiente"
          />

          <!-- Paso 2: Detalles y fechas -->
          <FormPaso2
            v-if="pasoActual === 2"
            v-model="paso2Data"
            @validacion-cambio="(valido) => validacionPasos.paso2 = valido"
          />

          <!-- Paso 3: Capacidad y resumen -->
          <FormPaso3
            v-if="pasoActual === 3"
            v-model="paso3Data"
            :resumen="{
              nombre: formData.nombre,
              categoria: formData.categoria,
              fecha_inicio: formData.fecha_inicio,
              fecha_fin: formData.fecha_fin,
            }"
            @validacion-cambio="(valido) => validacionPasos.paso3 = valido"
            @editar-detalles="irAPaso(2)"
          />
        </div>

        <!-- Botones de navegación (no se muestran en paso 1) -->
        <div v-if="pasoActual > 1" class="wizard-actions">
          <button
            v-if="pasoActual > 1"
            type="button"
            class="btn-secondary"
            @click="pasoPrevio"
          >
            <svg class="icon-arrow-left" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Paso Anterior
          </button>

          <button
            v-if="pasoActual < 3"
            type="button"
            class="btn-primary"
            :disabled="!esPasoValido"
            @click="pasoSiguiente"
          >
            Siguiente Paso
            <svg class="icon-arrow-right" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
            v-if="pasoActual === 3"
            type="button"
            class="btn-primary btn-create"
            :disabled="!esPasoValido || enviando"
            @click="confirmarCreacion"
          >
            <svg v-if="!enviando" class="icon-check" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span v-if="enviando" class="spinner"></span>
            {{ enviando ? 'Creando...' : 'Confirmar y Crear Proyecto' }}
          </button>
        </div>

        <!-- Mensaje de error -->
        <div v-if="mensajeError" class="error-message">
          <svg class="icon-error" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ mensajeError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FormPaso1 from '../../components/proyectos/FormPaso1.vue';
import FormPaso2 from '../../components/proyectos/FormPaso2.vue';
import FormPaso3 from '../../components/proyectos/FormPaso3.vue';
import BarraProgresoProyecto from '../../components/proyectos/BarraProgresoProyecto.vue';
import ProyectosService from '../../services/proyectos.service';
import type { ProyectoNuevo, CategoriaProyecto, BorradorProyecto } from '../../types/proyecto';

const router = useRouter();

// Estado del formulario
const pasoActual = ref(1);
const enviando = ref(false);
const mensajeError = ref('');

const formData = reactive<ProyectoNuevo>({
  nombre: '',
  descripcion: '',
  categoria: '' as CategoriaProyecto,
  fecha_inicio: '',
  fecha_fin: '',
  cupo_maximo: 0,
  id_organizacion: '',
});

// Estados de validación por paso
const validacionPasos = reactive({
  paso1: false,
  paso2: false,
  paso3: false,
});

// Datos computados para los pasos 2 y 3
const paso2Data = computed({
  get: () => ({
    descripcion: formData.descripcion,
    categoria: formData.categoria,
    fecha_inicio: formData.fecha_inicio,
    fecha_fin: formData.fecha_fin,
  }),
  set: (value) => {
    formData.descripcion = value.descripcion;
    formData.categoria = value.categoria as CategoriaProyecto;
    formData.fecha_inicio = value.fecha_inicio;
    formData.fecha_fin = value.fecha_fin;
  },
});

const paso3Data = computed({
  get: () => ({
    cupo_maximo: formData.cupo_maximo,
    id_organizacion: formData.id_organizacion,
  }),
  set: (value) => {
    formData.cupo_maximo = value.cupo_maximo;
    formData.id_organizacion = value.id_organizacion;
  },
});

// Computados
const esPasoValido = computed(() => {
  const validaciones = {
    1: validacionPasos.paso1,
    2: validacionPasos.paso2,
    3: validacionPasos.paso3,
  };
  return validaciones[pasoActual.value as keyof typeof validaciones] || false;
});

// Navegación entre pasos
const pasoSiguiente = () => {
  if (esPasoValido.value && pasoActual.value < 3) {
    pasoActual.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const pasoPrevio = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const irAPaso = (paso: number) => {
  if (paso >= 1 && paso <= 3) {
    pasoActual.value = paso;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Navegación
const volverALista = () => {
  if (pasoActual.value > 1 || formData.nombre) {
    if (confirm('¿Deseas salir? Los cambios no guardados se perderán.')) {
      router.push('/proyectos');
    }
  } else {
    router.push('/proyectos');
  }
};

// Gestión de borradores
const STORAGE_KEY = 'borrador_proyecto';

const guardarBorrador = () => {
  const borrador: BorradorProyecto = {
    paso: pasoActual.value,
    datos: { ...formData },
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(borrador));
    alert('Borrador guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar borrador:', error);
    alert('No se pudo guardar el borrador');
  }
};

const cargarBorrador = () => {
  try {
    const borradorStr = localStorage.getItem(STORAGE_KEY);
    if (!borradorStr) return;

    const borrador: BorradorProyecto = JSON.parse(borradorStr);
    
    // Verificar si el borrador no es muy antiguo (7 días)
    const diasTranscurridos = (Date.now() - borrador.timestamp) / (1000 * 60 * 60 * 24);
    if (diasTranscurridos > 7) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    if (confirm('Se encontró un borrador guardado. ¿Deseas continuar desde donde lo dejaste?')) {
      Object.assign(formData, borrador.datos);
      pasoActual.value = borrador.paso;
    }
  } catch (error) {
    console.error('Error al cargar borrador:', error);
  }
};

const eliminarBorrador = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al eliminar borrador:', error);
  }
};

// Confirmación y creación del proyecto
const confirmarCreacion = async () => {
  if (!esPasoValido.value || enviando.value) return;

  enviando.value = true;
  mensajeError.value = '';

  try {
    // Validar que la categoría no esté vacía
    if (!formData.categoria) {
      throw new Error('Debe seleccionar una categoría');
    }

    await ProyectosService.crearProyecto(formData);
    
    // Eliminar borrador después de crear exitosamente
    eliminarBorrador();
    
    // Mostrar mensaje de éxito
    alert('¡Proyecto creado exitosamente!');
    
    // Redirigir a la lista de proyectos o al detalle
    router.push({ name: 'proyectos' });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    mensajeError.value = error instanceof Error 
      ? error.message 
      : 'Ocurrió un error al crear el proyecto. Por favor, intenta nuevamente.';
  } finally {
    enviando.value = false;
  }
};

// Cargar borrador al montar
onMounted(() => {
  cargarBorrador();
});
</script>

<style scoped>
.crear-proyecto-view {
  min-height: 100vh;
  background: #F7F5F0;
  padding: 0;
}

.view-header {
  background: linear-gradient(135deg, #3a0066 0%, #4B0082 100%);
  border-bottom: 3px solid #79C99E;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-2px);
}

.btn-back svg {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-project {
  width: 2.5rem;
  height: 2.5rem;
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.view-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.save-draft-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: #79C99E;
  border: 2px solid #79C99E;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.save-draft-button:hover {
  background: #5fb386;
  border-color: #5fb386;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.wizard-container {
  max-width: 950px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

.wizard-card {
  background: transparent;
  border-radius: 0;
  padding: 2rem 0;
  box-shadow: none;
  border: none;
  position: relative;
}

.wizard-title {
  font-size: 2rem;
  font-weight: 800;
  color: #4B0082;
  text-align: center;
  margin: 0 0 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.step-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0;
  border: none;
}

.step-text {
  font-size: 1rem;
  font-weight: 700;
  color: #4B0082;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-percentage {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
  background: #4B0082;
  padding: 0.25rem 0.75rem;
  border-radius: 0;
  border: none;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 3rem;
  border: none;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #79C99E 0%, #5fb386 50%, #4B0082 100%);
  transition: width 0.4s ease;
}

.form-content {
  min-height: 400px;
  margin-bottom: 2rem;
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary {
  color: #4B0082;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #79C99E;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #5fb386;
  transform: translateY(-1px);
}

.btn-primary {
  color: white;
  background: #79C99E;
  border: none;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #5fb386;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
  border-color: #6b7280;
}

.btn-create {
  padding: 0.875rem 2rem;
  background: #4B0082;
  border: none;
  color: #ffffff;
}

.btn-create:hover:not(:disabled) {
  background: #3a0066;
}

.icon-arrow-left,
.icon-arrow-right,
.icon-check {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.95rem;
}

.icon-error {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .crear-proyecto-view {
    padding: 1rem 0.5rem;
  }

  .view-header {
    margin-bottom: 1rem;
  }

  .header-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .view-title {
    font-size: 1.5rem;
  }

  .wizard-card {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .wizard-title {
    font-size: 1.5rem;
  }

  .wizard-actions {
    flex-direction: column;
  }

  .btn-primary {
    margin-left: 0;
    width: 100%;
  }
}
</style>
