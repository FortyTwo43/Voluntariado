<template>
  <div class="organization-register-form">
    <div class="form-header">
      <h1 class="form-title">{{ t.createOrgAccount }}</h1>
      <p class="form-subtitle">{{ t.orgSubtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form grid-form three-col">
        <InputField
          id="nombre"
          :label="t.orgName"
          v-model="organizacion.nombre"
          :placeholder="t.orgNamePlaceholder"
          :error="errors.nombre"
          required
          class="nombre"
        />
      <div class="form-group">
        <label for="tipo" class="form-label">{{ t.orgType }}</label>
        <select
          id="tipo"
          v-model="organizacion.tipo"
          class="form-select"
          :class="{ 'error': errors.tipo }"
          required
        >
          <option value="">{{ t.orgTypePlaceholder }}</option>
          <option value="ONG">{{ t.ngo }}</option>
          <option value="Fundación">{{ t.foundation }}</option>
          <option value="Empresa">{{ currentLanguage === 'es' ? 'Empresa' : 'Company' }}</option>
          <option value="Comunidad">{{ currentLanguage === 'es' ? 'Comunidad' : 'Community' }}</option>
          <option value="Otro">{{ t.other }}</option>
        </select>
        <span v-if="errors.tipo" class="error-message">{{ errors.tipo }}</span>
      </div>
      <InputField
        id="direccion"
        :label="t.address"
        v-model="organizacion.direccion"
        :placeholder="t.addressPlaceholder"
        :error="errors.direccion"
        required
      />

      <InputField
        id="email"
        :label="t.emailLabel"
        type="email"
        v-model="organizacion.email"
        :placeholder="t.representativeEmailPlaceholder"
        :error="errors.email"
        required
      />

      <InputField
        id="contrasena"
        :label="t.password"
        type="password"
        v-model="organizacion.contrasena"
        :placeholder="t.passwordMin"
        :error="errors.contrasena"
        required
      />

      <InputField
        id="confirmarContrasena"
        :label="t.confirmPassword"
        type="password"
        v-model="organizacion.confirmarContrasena"
        :placeholder="t.confirmPasswordPlaceholder"
        :error="errors.confirmarContrasena"
        required
      />

      <div class="terms-section full">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="organizacion.aceptaTerminos"
            class="checkbox"
            required
          />
          <span class="checkbox-text">
            {{ t.acceptTerms }}
            <a href="#" class="terms-link">{{ t.termsOfService }}</a>
            {{ t.and }}
            <a href="#" class="terms-link">{{ t.privacyPolicy }}</a>.
          </span>
        </label>
        <span v-if="errors.aceptaTerminos" class="error-message">{{ t.mustAcceptTerms }}</span>
      </div>

      <ButtonOrganization
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        variant="primary"
        class="submit-button full"
      >
        <span v-if="isSubmitting">{{ t.creating }}</span>
        <span v-else>{{ t.create }}</span>
      </ButtonOrganization>

      <div class="login-section full">
        <p class="login-question">{{ t.alreadyHaveAccount }}</p>
        <router-link to="/login" class="login-link">{{ t.signInLink }}</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguage } from '../../composables/useLanguage';
import type { IOrganizacionRegistro } from '../../types/IOrganizacion';
import { registrarOrganizacion, validarCamposCompleto } from '../../services/organizationService';
import { useAlert } from '../../composables/useAlert';
import InputField from '../ui/InputField.vue';
import ButtonOrganization from '../buttons/ButtonOrganization.vue';
import type { IOrganizacion } from '../../types/IOrganizacion';

const router = useRouter();
const { showSuccess, showError } = useAlert();
const { t, currentLanguage } = useLanguage();

// Estado del formulario
const organizacion = reactive<IOrganizacionRegistro>({
  nombre: '',
  tipo: '',
  direccion: '',
  email: '',
  contrasena: '',
  confirmarContrasena: '',
  aceptaTerminos: false,
});

// Estado de validación
const errors = reactive<Partial<IOrganizacionRegistro>>({});
const isSubmitting = ref(false);

// Validación del formulario
const isFormValid = computed(() => {
  return organizacion.nombre.trim() &&
         organizacion.tipo.trim() &&
         organizacion.direccion.trim() &&
         organizacion.email.trim() &&
         organizacion.contrasena.trim() &&
         organizacion.confirmarContrasena.trim() &&
         organizacion.aceptaTerminos &&
         Object.values(errors).every(error => !error);
});


// Validar campos individuales
const validateField = (field: keyof IOrganizacionRegistro, value: string | boolean) => {
  switch (field) {
    case 'nombre':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.nombre = 'El nombre de la organización es requerido';
      } else {
        errors.nombre = undefined;
      }
      break;
    case 'tipo':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.tipo = 'El tipo de organización es requerido';
      } else {
        errors.tipo = undefined;
      }
      break;
    case 'direccion':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.direccion = 'La dirección es requerida';
      } else {
        errors.direccion = undefined;
      }
      break;
    case 'email':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.email = 'El correo electrónico es requerido';
      } else if (typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errors.email = 'El formato del correo electrónico no es válido';
        } else {
          errors.email = undefined;
        }
      } else {
        errors.email = undefined;
      }
      break;
    case 'contrasena':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.contrasena = 'La contraseña es requerida';
      } else if (typeof value === 'string') {
        const lengthOk = value.length >= 8;
        const numberOk = /\d/.test(value);
        const uppercaseOk = /[A-Z]/.test(value);
        const lowercaseOk = /[a-z]/.test(value);
        const specialOk = /[^A-Za-z0-9]/.test(value);
        if (!lengthOk || !numberOk || !uppercaseOk || !lowercaseOk || !specialOk) {
          errors.contrasena = 'La contraseña debe tener al menos 8 caracteres, incluir 1 número, 1 mayúscula, 1 minúscula y 1 carácter especial';
        } else {
          errors.contrasena = undefined;
        }
      } else {
        errors.contrasena = undefined;
      }
      // También validar confirmación cuando cambia la contraseña
      if (organizacion.confirmarContrasena) {
        validateField('confirmarContrasena', organizacion.confirmarContrasena);
      }
      break;
    case 'confirmarContrasena':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.confirmarContrasena = 'Debe confirmar la contraseña';
      } else if (typeof value === 'string') {
        if (organizacion.contrasena !== value) {
          errors.confirmarContrasena = 'Las contraseñas no coinciden';
        } else {
          errors.confirmarContrasena = undefined;
        }
      } else {
        errors.confirmarContrasena = undefined;
      }
      break;
    case 'aceptaTerminos':
      if (!value) {
        errors.aceptaTerminos = true;
      } else {
        errors.aceptaTerminos = undefined;
      }
      break;
  }
};

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Validación completa incluyendo verificación de email existente
    const erroresCompletos = await validarCamposCompleto(organizacion);
    if (erroresCompletos.length > 0) {
      // Mostrar el primer error encontrado
      showError('Error de validación', erroresCompletos[0]);
      return;
    }
    
    // Crear objeto sin campos de validación para el servicio
    const { confirmarContrasena, aceptaTerminos, ...organizacionData } = organizacion;
    const response = await registrarOrganizacion(organizacionData as IOrganizacion);
    
    if (response.success) {
      showSuccess('¡Organización registrada exitosamente!', 'Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      showError('Error al registrar', response.message);
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    showError('Error inesperado', 'Por favor, intenta nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

// Watchers para validación en tiempo real
watch(() => organizacion.nombre, (value) => {
  validateField('nombre', value);
});

watch(() => organizacion.tipo, (value) => {
  validateField('tipo', value);
});

watch(() => organizacion.direccion, (value) => {
  validateField('direccion', value);
});

watch(() => organizacion.email, (value) => {
  validateField('email', value);
});

watch(() => organizacion.contrasena, (value) => {
  validateField('contrasena', value);
});

watch(() => organizacion.confirmarContrasena, (value) => {
  validateField('confirmarContrasena', value);
});

watch(() => organizacion.aceptaTerminos, (value) => {
  validateField('aceptaTerminos', value);
});
</script>

<style scoped>
.organization-register-form {
  background: white;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: min(96vw, 1100px);
  max-width: 1100px;
  box-sizing: border-box;
}

.form-header {
  text-align: center;
  margin-bottom: 1rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.form-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem 2rem;
  align-items: start;
}

.form-group {
  margin-bottom: 10;
  width: 103%;
}

.nombre{
  width: 103%;
  grid-column: span 3;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #f9fafb;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-select.error {
  border-color: #ef4444;
}

.terms-section {
  margin: 0.2rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.5;
}

.checkbox {
  margin: 0;
  width: 1rem;
  height: 1rem;
  accent-color: #4f46e5;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-text {
  color: #374151;
}

.terms-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.submit-button {
  margin-top: 1rem;
}

.login-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-question {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.login-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.login-link:hover {
  text-decoration: underline;
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}

@media (max-width: 1024px) {
  .form { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .organization-register-form { padding: 1rem; }
  .form { grid-template-columns: 1fr; gap: 0.5rem 0.5rem; }
  .form-title { font-size: 1.25rem; }
}

/* When using three columns, some elements should still span 2 cols */
.three-col .span-2 {
  grid-column: span 2;
}

/* Helpers for grid layout */
.grid-form .full {
  grid-column: 1 / -1;
  width: 100%;
}

.form-select,
.checkbox-label,
.submit-button.full,
.login-section.full {
  width: 100%;
}

</style>
