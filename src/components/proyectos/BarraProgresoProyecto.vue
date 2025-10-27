<template>
  <div class="barra-progreso-container">
    <div class="progreso-info">
      <div class="paso-actual">
        <span class="paso-texto">{{ pasoTexto }}</span>
        <span class="paso-numero">{{ porcentaje }}%</span>
      </div>
    </div>
    
    <div class="barra-progreso">
      <div 
        class="barra-progreso-fill" 
        :style="{ width: `${porcentaje}%` }"
      ></div>
    </div>

    <div class="pasos-indicadores">
      <div 
        v-for="paso in totalPasos" 
        :key="paso"
        class="paso-indicador"
        :class="{
          'paso-completado': paso < pasoActual + 1,
          'paso-actual': paso === pasoActual + 1,
          'paso-pendiente': paso > pasoActual + 1
        }"
      >
        <div class="paso-circulo">
          <svg 
            v-if="paso < pasoActual + 1" 
            class="icon-check" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fill-rule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clip-rule="evenodd" 
            />
          </svg>
          <span v-else>{{ paso }}</span>
        </div>
        <span class="paso-label">{{ obtenerNombrePaso(paso) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pasoActual: number;
  totalPasos: number;
}

const props = withDefaults(defineProps<Props>(), {
  pasoActual: 0,
  totalPasos: 3,
});

const porcentaje = computed(() => {
  return Math.round(((props.pasoActual + 1) / props.totalPasos) * 100);
});

const pasoTexto = computed(() => {
  return `PASO ${props.pasoActual + 1} DE ${props.totalPasos}`;
});

const obtenerNombrePaso = (paso: number): string => {
  const nombres: Record<number, string> = {
    1: 'Nombre',
    2: 'Detalles',
    3: 'Confirmación',
  };
  return nombres[paso] || `Paso ${paso}`;
};
</script>

<style scoped>
.barra-progreso-container {
  margin-bottom: 2rem;
}

.progreso-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.paso-actual {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.paso-texto {
  font-size: 1rem;
  font-weight: 700;
  color: #4B0082;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.paso-numero {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
  background: #4B0082;
  padding: 0.25rem 0.75rem;
  border-radius: 0;
  border: none;
}

.barra-progreso {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.barra-progreso-fill {
  height: 100%;
  background: linear-gradient(90deg, #79C99E 0%, #5fb386 50%, #4B0082 100%);
  transition: width 0.4s ease;
}

.pasos-indicadores {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.paso-indicador {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.paso-circulo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  transition: all 0.3s ease;
}

.paso-completado .paso-circulo {
  background: #79C99E;
  color: #ffffff;
  border: 3px solid #79C99E;
}

.paso-actual .paso-circulo {
  background: #4B0082;
  color: #ffffff;
  border: 3px solid #4B0082;
  box-shadow: 0 0 0 4px rgba(75, 0, 130, 0.2);
}

.paso-pendiente .paso-circulo {
  background: #ffffff;
  color: #5a5a5a;
  border: 3px solid #e8e8e8;
}

.paso-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E2E2E;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.paso-completado .paso-label {
  color: #79C99E;
}

.paso-actual .paso-label {
  color: #4B0082;
  font-weight: 700;
}

.paso-pendiente .paso-label {
  color: #5a5a5a;
}

.icon-check {
  width: 1.5rem;
  height: 1.5rem;
}

@media (max-width: 768px) {
  .pasos-indicadores {
    gap: 0.5rem;
  }

  .paso-circulo {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .paso-label {
    font-size: 0.75rem;
  }

  .paso-texto {
    font-size: 0.875rem;
  }

  .paso-numero {
    font-size: 1.25rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>
