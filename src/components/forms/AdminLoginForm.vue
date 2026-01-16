<template>
  <div class="admin-login-form">
    <div class="form-header">
      <h1 class="form-title">Acceso de Administrador</h1>
      <p class="form-subtitle">Ingresa tus credenciales de administrador</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <InputField
        id="email"
        label="Correo Electrónico"
        type="email"
        v-model="loginData.email"
        placeholder="admin@ejemplo.com"
        :error="errors.email"
        :disabled="isSubmitting"
        required
      />

      <InputField
        id="password"
        label="Contraseña"
        type="password"
        v-model="loginData.password"
        placeholder="Ingresa tu contraseña"
        :error="errors.password"
        :disabled="isSubmitting"
        required
      />

      <ButtonPrimary
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        variant="primary"
        class="submit-button"
      >
        <span v-if="isSubmitting">Iniciando sesión...</span>
        <span v-else>Iniciar Sesión</span>
      </ButtonPrimary>

      <div class="back-section">
        <router-link to="/login" class="back-link">
          ← Volver al login normal
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAlert } from '../../composables/useAlert';
import { autenticarAdministrador, type LoginCredentials, persistUserSession } from '../../services/authService';
import InputField from '../ui/InputField.vue';
import ButtonPrimary from '../ui/ButtonPrimary.vue';

const router = useRouter();
const { showSuccess, showError } = useAlert();

// Estado del formulario
const loginData = reactive({
  email: '',
  password: '',
});

// Estado de validación
const errorKeys = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
});

// Computed que traduce las claves de error dinámicamente
const errors = computed(() => ({
  email: errorKeys.email,
  password: errorKeys.password,
}));

const isSubmitting = ref(false);

// Validación del formulario
const isFormValid = computed(() => {
  return (
    loginData.email.trim() &&
    loginData.password.trim() &&
    Object.values(errorKeys).every((error) => !error)
  );
});

// Validar campos individuales
const validateField = (field: keyof typeof loginData, value: string) => {
  switch (field) {
    case 'email':
      if (!value || !value.trim()) {
        errorKeys.email = 'El correo electrónico es requerido';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errorKeys.email = 'El formato del correo electrónico no es válido';
        } else {
          errorKeys.email = undefined;
        }
      }
      break;
    case 'password':
      if (!value || !value.trim()) {
        errorKeys.password = 'La contraseña es requerida';
      } else {
        errorKeys.password = undefined;
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
    const credentials: LoginCredentials = {
      email: loginData.email.trim(),
      password: loginData.password,
    };

    const resultado = await autenticarAdministrador(credentials);

    if (resultado.success && resultado.user) {
      // Persistir sesión
      persistUserSession(resultado.user, true);

      showSuccess('¡Inicio de sesión exitoso!', `Bienvenido/a ${resultado.user.nombre}`);

      // Redirigir a panel de administración
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } else {
      showError('Error de inicio de sesión', resultado.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error en el login:', error);
    showError(
      'Error de conexión',
      'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.'
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Watchers para validación en tiempo real
watch(
  () => loginData.email,
  (value) => {
    validateField('email', value);
  }
);

watch(
  () => loginData.password,
  (value) => {
    validateField('password', value);
  }
);
</script>

<style scoped>
.admin-login-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 28rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submit-button {
  margin-top: 1rem;
}

.back-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.back-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .admin-login-form {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }
}
</style>

