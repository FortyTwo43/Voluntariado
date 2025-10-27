<template>
  <div class="register-form">
    <div class="form-header">
      <h1 class="form-title">{{ t.createVolunteerAccount }}</h1>
      <p class="form-subtitle">{{ t.registerSubtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form grid-form three-col">
      <InputField
        id="nombre"
        :label="t.firstName"
        v-model="voluntario.nombre"
        :placeholder="t.firstNamePlaceholder"
        :error="errors.nombre"
        required
        class="span-1"
      />
      <InputField
        id="apellido"
        :label="t.lastName"
        v-model="voluntario.apellido"
        :placeholder="t.lastNamePlaceholder"
        :error="errors.apellido"
        required
        class="span-1"
      />

      <InputField
        id="correo"
        :label="t.emailLabel"
        type="email"
        v-model="voluntario.email"
        :placeholder="t.emailPlaceholder"
        :error="errors.email"
        required
        class="span-1"
      />

      <InputField
        id="telefono"
        :label="t.phone"
        type="tel"
        v-model="voluntario.telefono"
        :placeholder="t.phonePlaceholder"
        :error="errors.telefono"
        required
      />

      <InputField
        id="institucion"
        :label="t.institution"
        v-model="voluntario.institucion_educativa"
        :placeholder="t.institutionPlaceholder"
        :error="errors.institucion_educativa"
        required
      />

      <InputField
        id="contrasena"
        :label="t.password"
        type="password"
        v-model="voluntario.contrasena"
        :placeholder="t.passwordMin"
        :error="errors.contrasena"
        required
      />

      <InputField
        id="confirmarContrasena"
        :label="t.confirmPassword"
        type="password"
        v-model="voluntario.confirmarContrasena"
        :placeholder="t.confirmPasswordPlaceholder"
        :error="errors.confirmarContrasena"
        required
      />

      <div class="terms-section full">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="voluntario.aceptaTerminos"
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

      <ButtonPrimary
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        variant="primary"
        class="submit-button full"
      >
        <span v-if="isSubmitting">{{ t.registering }}</span>
        <span v-else>{{ t.registerButton }}</span>
      </ButtonPrimary>

      <div class="login-section full">
        <p class="login-question">{{ t.alreadyHaveAccount }}</p>
        <router-link to="/login" class="login-link">{{ t.signInLink }}</router-link>
      </div>

      <div class="organization-section full">
        <p class="organization-question">{{ t.areYouOrganization }}</p>
        <ButtonPrimary
          type="button"
          variant="secondary"
          @click="goToOrganizationRegister"
        >
          {{ t.registerAsOrganization }}
        </ButtonPrimary>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguage } from '../../composables/useLanguage';
import type { IVoluntarioRegistro } from '../../types/IVoluntario';
import { registrarVoluntario, validarCamposCompleto, validarEmail } from '../../services/authService';
import InputField from '../../components/ui/InputField.vue';
import ButtonPrimary from '../../components/ui/ButtonPrimary.vue';

const router = useRouter();
const { t } = useLanguage();

// Estado del formulario
const voluntario = reactive<IVoluntarioRegistro>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  institucion_educativa: '',
  contrasena: '',
  confirmarContrasena: '',
  aceptaTerminos: false,
});

// Estado de validación
const errors = reactive<Partial<IVoluntarioRegistro>>({});
const isSubmitting = ref(false);

// Validación del formulario
const isFormValid = computed(() => {
  return voluntario.nombre.trim() &&
         voluntario.apellido.trim() &&
         voluntario.email.trim() &&
         voluntario.telefono.trim() &&
         voluntario.institucion_educativa.trim() &&
         voluntario.contrasena.trim() &&
         voluntario.confirmarContrasena.trim() &&
         voluntario.aceptaTerminos &&
         Object.values(errors).every(error => !error);
});


// Validar campos individuales
const validateField = (field: keyof IVoluntarioRegistro, value: string | boolean) => {
  switch (field) {
    case 'nombre':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.nombre = t.value.fieldRequired;
      } else {
        errors.nombre = undefined;
      }
      break;
    case 'apellido':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.apellido = t.value.fieldRequired;
      } else {
        errors.apellido = undefined;
      }
      break;
    case 'email':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.email = t.value.fieldRequired;
      } else if (typeof value === 'string') {
        if (!validarEmail(value.trim())) {
          errors.email = t.value.invalidEmail;
        } else {
          errors.email = undefined;
        }
      } else {
        errors.email = undefined;
      }
      break;
    case 'telefono':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.telefono = t.value.fieldRequired;
      } else {
        errors.telefono = undefined;
      }
      break;
    case 'institucion_educativa':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.institucion_educativa = t.value.fieldRequired;
      } else {
        errors.institucion_educativa = undefined;
      }
      break;
    case 'contrasena':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.contrasena = t.value.fieldRequired;
      } else if (typeof value === 'string') {
        const lengthOk = value.length >= 8;
        const numberOk = /\d/.test(value);
        const uppercaseOk = /[A-Z]/.test(value);
        const lowercaseOk = /[a-z]/.test(value);
        const specialOk = /[^A-Za-z0-9]/.test(value);
        if (!lengthOk || !numberOk || !uppercaseOk || !lowercaseOk || !specialOk) {
          errors.contrasena = t.value.passwordRequirements;
        } else {
          errors.contrasena = undefined;
        }
      } else {
        errors.contrasena = undefined;
      }
      // También validar confirmación cuando cambia la contraseña
      if (voluntario.confirmarContrasena) {
        validateField('confirmarContrasena', voluntario.confirmarContrasena);
      }
      break;
    case 'confirmarContrasena':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.confirmarContrasena = t.value.fieldRequired;
      } else if (typeof value === 'string') {
        if (voluntario.contrasena !== value) {
          errors.confirmarContrasena = t.value.passwordsMismatch;
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
};6

// Validar todo el formulario
const validateForm = (): boolean => {
  // Limpiar errores anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof IVoluntarioRegistro] = undefined;
  });

  // Validar cada campo
  Object.keys(voluntario).forEach(key => {
    const field = key as keyof IVoluntarioRegistro;
    validateField(field, voluntario[field]);
  });

  // Verificar si hay errores
  return !Object.values(errors).some(error => error !== undefined);
};

// Manejar envío del formulario
const handleSubmit = async () => {
  // Validación local primero
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
  // Crear objeto sin aceptaTerminos ni confirmarContrasena para el servicio
  const { aceptaTerminos, confirmarContrasena, ...voluntarioData } = voluntario;
    
    // Validación completa incluyendo verificación de correo existente
  const erroresCompletos = await validarCamposCompleto(voluntarioData);
    if (erroresCompletos.length > 0) {
      // Mostrar el primer error encontrado
      alert(erroresCompletos[0]);
      return;
    }
    
    const success = await registrarVoluntario(voluntarioData);
    
    if (success) {
      alert(t.value.registerSuccess);
      // Redirigir a la pantalla de login
      router.push('/login');
    } else {
      alert(t.value.projectCreateError);
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Error inesperado. Por favor, verifica tu conexión e intenta nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

// Redirigir al registro de organización
const goToOrganizationRegister = () => {
  router.push('/register-organization');
};

// Watchers para validación en tiempo real

watch(() => voluntario.nombre, (value) => {
  validateField('nombre', value);
});

watch(() => voluntario.apellido, (value) => {
  validateField('apellido', value);
});

watch(() => voluntario.email, (value) => {
  validateField('email', value);
});

watch(() => voluntario.telefono, (value) => {
  validateField('telefono', value);
});

watch(() => voluntario.institucion_educativa, (value) => {
  validateField('institucion_educativa', value);
});

watch(() => voluntario.contrasena, (value) => {
  validateField('contrasena', value);
});

watch(() => voluntario.confirmarContrasena, (value) => {
  validateField('confirmarContrasena', value);
});

watch(() => voluntario.aceptaTerminos, (value) => {
  validateField('aceptaTerminos', value);
});
</script>

<style scoped>
.register-form {
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

.grid-form .full {
  grid-column: 1 / -1;
}

/* helpers for three col layout */
.three-col .span-1 { grid-column: auto; }
.three-col .span-2 { grid-column: span 2; }

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
  margin-top: 0.2rem;
}

.login-section {
  display: flex;
  column-gap: 5px;
  padding: 0px;
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin: 0 auto;
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

.organization-section {
  text-align: center;
  margin-top: 0rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.organization-question {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  margin-bottom: 8px;
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
  .register-form { padding: 1rem; }
  .form { grid-template-columns: 1fr; gap: 0.5rem 0.5rem; }
  .form-title { font-size: 1.25rem; }
}
</style>
