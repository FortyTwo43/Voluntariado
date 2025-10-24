<template>
  <div class="login-form">
    <div class="form-header">
      <h1 class="form-title">Bienvenido de vuelta</h1>
      <p class="form-subtitle">Accede a tu panel de voluntario u organización.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <InputField
        id="email"
        label="Correo Electrónico"
        type="email"
        v-model="loginData.email"
        placeholder="tu@email.com"
        :error="errors.email"
        required
      />

      <InputField
        id="password"
        label="Contraseña"
        type="password"
        v-model="loginData.password"
        placeholder="Introduce tu contraseña"
        :error="errors.password"
        required
      />

      <div class="form-options">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="loginData.rememberUser"
            class="checkbox"
          />
          <span class="checkbox-text">Recordar usuario</span>
        </label>
        <router-link to="/forgot-password" class="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>

      <ButtonPrimary
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        variant="primary"
        class="submit-button"
      >
        <span v-if="isSubmitting">Iniciando sesión...</span>
        <span v-else>Iniciar Sesión</span>
      </ButtonPrimary>

      <div class="register-section">
        <p class="register-question">¿No tienes una cuenta?</p>
        <router-link to="/registro-voluntario" class="register-link">
          Regístrate aquí.
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAlert } from '../../composables/useAlert';
import { autenticarUsuario, type LoginCredentials } from '../../services/authService';
import InputField from '../ui/InputField.vue';
import ButtonPrimary from '../ui/ButtonPrimary.vue';

const router = useRouter();
const { showSuccess, showError } = useAlert();

// Estado del formulario
const loginData = reactive({
  email: '',
  password: '',
  rememberUser: false,
});

// Estado de validación
const errors = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
});

const isSubmitting = ref(false);

// Validación del formulario
const isFormValid = computed(() => {
  return loginData.email.trim() &&
         loginData.password.trim() &&
         Object.values(errors).every(error => !error);
});

// Validar campos individuales
const validateField = (field: keyof typeof loginData, value: string | boolean) => {
  switch (field) {
    case 'email':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.email = 'El correo electrónico es requerido';
      } else if (typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errors.email = 'Correo inválido';
        } else {
          errors.email = undefined;
        }
      } else {
        errors.email = undefined;
      }
      break;
    case 'password':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.password = 'La contraseña es requerida';
      } else if (typeof value === 'string') {
        if (value.length < 8) {
          errors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else {
          errors.password = undefined;
        }
      } else {
        errors.password = undefined;
      }
      break;
    case 'rememberUser':
      // No validación necesaria para el checkbox
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
    // Autenticación real usando el servicio
    const credentials: LoginCredentials = {
      email: loginData.email.trim(),
      password: loginData.password
    };
    
    const resultado = await autenticarUsuario(credentials);
    
    if (resultado.success && resultado.user) {
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(resultado.user));

      // Guardar email en localStorage si se marcó "Recordar usuario"
      if (loginData.rememberUser) {
        localStorage.setItem('rememberedEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Mensaje de éxito genérico
      showSuccess('¡Inicio de sesión exitoso!', `Bienvenido ${resultado.user.nombre}`);

      // Flujo de navegación según tipo de usuario
      if (resultado.user.tipo === 'organizacion') {
        // Redirigir a proyectos para organizaciones
        setTimeout(() => {
          router.push('/proyectos');
        }, 800);
      } else {
        // Voluntario: mantener en la vista actual (no hay vistas para él todavía)
        // Opcional: podemos limpiar el formulario o dejar un mensaje.
      }
    } else {
      showError('Error de autenticación', resultado.message);
    }
  } catch (error) {
    console.error('Error en el login:', error);
    showError('Error inesperado', 'Por favor, verifica tu conexión e intenta nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
};

// Cargar email recordado al montar el componente
const loadRememberedEmail = () => {
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    loginData.email = rememberedEmail;
    loginData.rememberUser = true;
  }
};

// Watchers para validación en tiempo real
watch(() => loginData.email, (value) => {
  validateField('email', value);
});

watch(() => loginData.password, (value) => {
  validateField('password', value);
});

// Cargar email recordado al montar
loadRememberedEmail();
</script>

<style scoped>
.login-form {
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


.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox {
  margin: 0;
  width: 1rem;
  height: 1rem;
  accent-color: #4f46e5;
}

.checkbox-text {
  color: #374151;
  font-weight: 500;
}

.forgot-password-link {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

.submit-button {
  margin-top: 1rem;
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.register-question {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.register-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
