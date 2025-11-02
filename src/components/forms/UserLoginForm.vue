<template>
  <div class="login-form">
    <div class="form-header">
      <h1 class="form-title">{{ t.welcomeBack }}</h1>
      <p class="form-subtitle">{{ t.loginSubtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <InputField
        id="email"
        :label="t.emailLabel"
        type="email"
        v-model="loginData.email"
        :placeholder="t.emailPlaceholder"
        :error="errors.email"
        :disabled="isLocked || isSubmitting"
        required
      />

      <InputField
        id="password"
        :label="t.passwordLabel"
        type="password"
        v-model="loginData.password"
        :placeholder="t.passwordPlaceholder"
        :error="errors.password"
        :disabled="isLocked || isSubmitting"
        required
      />

      <div class="form-options">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="loginData.rememberUser"
            class="checkbox"
          />
          <span class="checkbox-text">{{ t.rememberMe }}</span>
        </label>
        <router-link to="/recuperar" class="forgot-password-link">
          {{ t.forgotPassword }}
        </router-link>
      </div>

      <ButtonPrimary
        type="submit"
        :disabled="!isFormValid || isSubmitting || isLocked"
        variant="primary"
        class="submit-button"
      >
        <span v-if="isSubmitting">{{ t.loggingIn }}</span>
        <span v-else>{{ t.loginButton }}</span>
      </ButtonPrimary>

      <!-- Indicador de intentos (aparece desde el primer fallo, se oculta cuando hay bloqueo) -->
      <p
        v-if="failedAttempts > 0 && !isLocked"
        class="attempts-hint"
        role="status"
        aria-live="polite"
      >
        Intento {{ failedAttempts }} de 3. Tras 3 intentos fallidos, el acceso se bloqueará por 15 s.
      </p>

      <div class="register-section">
        <p class="register-question">{{ t.noAccount }}</p>
        <router-link to="/registro-voluntario" class="register-link">
          {{ t.registerHere }}
        </router-link>
      </div>
      
      <!-- Bloqueo por intentos: contador -->
      <div v-if="isLocked" class="lockout-banner" role="status" aria-live="polite">
        <svg class="lock-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8H9V7a3 3 0 116 0v3z" />
        </svg>
        <span>Demasiados intentos fallidos. Vuelve a intentarlo en {{ lockRemaining }} s.</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAlert } from '../../composables/useAlert';
import { useLanguage } from '../../composables/useLanguage';
import { autenticarUsuario, type LoginCredentials, persistUserSession } from '../../services/authService';
import InputField from '../ui/InputField.vue';
import ButtonPrimary from '../ui/ButtonPrimary.vue';

const router = useRouter();
const { showSuccess, showError } = useAlert();
const { t } = useLanguage();

// Estado del formulario
const loginData = reactive({
  email: '',
  password: '',
  rememberUser: false,
});

// Estado de validación (almacena claves de traducción)
const errorKeys = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
});

// Computed que traduce las claves de error dinámicamente
const errors = computed(() => ({
  email: errorKeys.email ? (t.value as any)[errorKeys.email] : undefined,
  password: errorKeys.password ? (t.value as any)[errorKeys.password] : undefined,
}));

const isSubmitting = ref(false);

// Estado de bloqueo por intentos fallidos
const failedAttempts = ref(0);
const isLocked = ref(false);
const lockRemaining = ref(0); // segundos
let lockTimer: number | undefined;

const clearLockTimer = () => {
  if (lockTimer) {
    clearInterval(lockTimer);
    lockTimer = undefined;
  }
};

const startLockout = (seconds = 15) => {
  isLocked.value = true;
  lockRemaining.value = seconds;
  showError('Demasiados intentos', `Has superado el número de intentos. Inténtalo nuevamente en ${seconds} segundos.`);
  clearLockTimer();
  lockTimer = window.setInterval(() => {
    lockRemaining.value -= 1;
    if (lockRemaining.value <= 0) {
      clearLockTimer();
      isLocked.value = false;
      failedAttempts.value = 0;
    }
  }, 1000);
};

// Validación del formulario
const isFormValid = computed(() => {
  return !isLocked.value &&
         loginData.email.trim() &&
         loginData.password.trim() &&
         Object.values(errorKeys).every(error => !error);
});

// Validar campos individuales (almacena claves, no textos)
const validateField = (field: keyof typeof loginData, value: string | boolean) => {
  switch (field) {
    case 'email':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errorKeys.email = 'fieldRequired';
      } else if (typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errorKeys.email = 'invalidEmail';
        } else {
          errorKeys.email = undefined;
        }
      } else {
        errorKeys.email = undefined;
      }
      break;
    case 'password':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errorKeys.password = 'fieldRequired';
      } else {
        // En este formulario específico no validamos longitud mínima
        errorKeys.password = undefined;
      }
      break;
    case 'rememberUser':
      // No validación necesaria para el checkbox
      break;
  }
};


// Manejar envío del formulario
const handleSubmit = async () => {
  if (isLocked.value) {
    return;
  }
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
  failedAttempts.value = 0;
  // Persistir sesión con TTL y compatibilidad
  persistUserSession(resultado.user, loginData.rememberUser);

      // Guardar email en localStorage si se marcó "Recordar usuario"
      if (loginData.rememberUser) {
        localStorage.setItem('rememberedEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Mensaje de éxito
      showSuccess(
        '¡Inicio de sesión exitoso!', 
        `Bienvenido/a ${resultado.user.nombre}`
      );

      // Flujo de navegación según rol de usuario
      if (resultado.user.rol === 'organizacion') {
        // Redirigir a proyectos para organizaciones
        setTimeout(() => {
          router.push('/proyectos');
        }, 1000);
      } else if (resultado.user.rol === 'voluntario') {
        // Redirigir a explorar proyectos para voluntarios
        setTimeout(() => {
          router.push('/explorar-proyectos');
        }, 1000);
      }
    } else {
      // Mensaje de error específico
      showError(
        'Error de inicio de sesión', 
        'El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus credenciales e intenta nuevamente.'
      );
      failedAttempts.value += 1;
      if (failedAttempts.value >= 3) {
        startLockout(15);
      }
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

onBeforeUnmount(() => {
  clearLockTimer();
});
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

/* Lockout banner */
.lockout-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: #fff7ed; /* orange-50 */
  border: 1px solid #fed7aa; /* orange-200 */
  color: #9a3412; /* orange-800 */
}

.lock-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Texto pequeño para intentos */
.attempts-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem; /* text-xs */
  color: #6b7280; /* gray-500 */
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
