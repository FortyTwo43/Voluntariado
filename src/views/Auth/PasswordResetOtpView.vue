<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Restablecer contraseña</h1>
          <p class="auth-subtitle">
            Ingresa el código de 6 dígitos que enviamos a tu correo y tu nueva contraseña.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <InputField
            id="email"
            label="Correo electrónico"
            type="email"
            v-model="email"
            :disabled="true"
            class="disabled-field"
          />

          <div class="code-field">
            <label for="code" class="field-label">Código de verificación</label>
            <input
              id="code"
              type="tel"
              v-model="code"
              placeholder="123456"
              maxlength="6"
              class="code-input"
              :class="{ 'input-error': codeError }"
              :disabled="isSubmitting"
              @input="handleCodeInput"
              required
            />
            <p v-if="codeError" class="error-message">{{ codeError }}</p>
            <p class="field-hint">Ingresa el código de 6 dígitos que recibiste por correo</p>
          </div>

          <InputField
            id="newPassword"
            label="Nueva contraseña"
            type="password"
            v-model="newPassword"
            placeholder="••••••••"
            :error="passwordError"
            :disabled="isSubmitting"
            required
          />

          <InputField
            id="confirmPassword"
            label="Confirmar nueva contraseña"
            type="password"
            v-model="confirmPassword"
            placeholder="••••••••"
            :error="confirmError"
            :disabled="isSubmitting"
            required
          />

          <div class="warning-box" v-if="attemptsLeft < 3">
            <svg class="warning-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p>Te quedan {{ attemptsLeft }} intentos. Después tendrás que solicitar un nuevo código.</p>
          </div>

          <ButtonPrimary
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="submit-button"
          >
            <span v-if="isSubmitting">Restableciendo...</span>
            <span v-else>Restablecer contraseña</span>
          </ButtonPrimary>

          <div class="form-actions">
            <button
              type="button"
              @click="requestNewCode"
              :disabled="isResending || resendCountdown > 0"
              class="resend-button"
            >
              <span v-if="isResending">Reenviando...</span>
              <span v-else-if="resendCountdown > 0">
                Reenviar código en {{ resendCountdown }}s
              </span>
              <span v-else>Reenviar código</span>
            </button>

            <router-link to="/login" class="back-link">
              Volver al inicio de sesión
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlert } from '@/composables/useAlert';
import { requestPasswordCode, resetPasswordWithCode } from '@/services/passwordReset.service';
import InputField from '@/components/ui/InputField.vue';
import ButtonPrimary from '@/components/ui/ButtonPrimary.vue';

const route = useRoute();
const router = useRouter();
const { showSuccess, showError } = useAlert();

const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const codeError = ref<string | undefined>(undefined);
const passwordError = ref<string | undefined>(undefined);
const confirmError = ref<string | undefined>(undefined);

const isSubmitting = ref(false);
const isResending = ref(false);
const attemptsLeft = ref(3);
const resendCountdown = ref(0);

let countdownTimer: number | undefined;

onMounted(() => {
  email.value = (route.query.email as string) || '';
  if (!email.value) {
    showError('Error', 'Email no especificado');
    router.push({ name: 'password-forgot' });
  }
});

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

const handleCodeInput = () => {
  // Solo permitir dígitos y máximo 6 caracteres
  code.value = code.value.replace(/\D/g, '').slice(0, 6);
  codeError.value = undefined;
};

const validatePassword = () => {
  if (!newPassword.value) {
    passwordError.value = 'La contraseña es requerida';
    return false;
  }
  
  const lengthOk = newPassword.value.length >= 8;
  const numberOk = /\d/.test(newPassword.value);
  const uppercaseOk = /[A-Z]/.test(newPassword.value);
  const lowercaseOk = /[a-z]/.test(newPassword.value);
  const specialOk = /[^A-Za-z0-9]/.test(newPassword.value);
  
  if (!lengthOk) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres';
    return false;
  }
  if (!uppercaseOk) {
    passwordError.value = 'La contraseña debe contener al menos una letra mayúscula';
    return false;
  }
  if (!lowercaseOk) {
    passwordError.value = 'La contraseña debe contener al menos una letra minúscula';
    return false;
  }
  if (!numberOk) {
    passwordError.value = 'La contraseña debe contener al menos un número';
    return false;
  }
  if (!specialOk) {
    passwordError.value = 'La contraseña debe contener al menos un carácter especial';
    return false;
  }
  
  passwordError.value = undefined;
  return true;
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmError.value = 'Debes confirmar la contraseña';
    return false;
  }
  if (confirmPassword.value !== newPassword.value) {
    confirmError.value = 'Las contraseñas no coinciden';
    return false;
  }
  confirmError.value = undefined;
  return true;
};

const isFormValid = computed(() => {
  const lengthOk = newPassword.value.length >= 8;
  const numberOk = /\d/.test(newPassword.value);
  const uppercaseOk = /[A-Z]/.test(newPassword.value);
  const lowercaseOk = /[a-z]/.test(newPassword.value);
  const specialOk = /[^A-Za-z0-9]/.test(newPassword.value);
  
  return (
    email.value.trim() !== '' &&
    code.value.length === 6 &&
    lengthOk &&
    numberOk &&
    uppercaseOk &&
    lowercaseOk &&
    specialOk &&
    confirmPassword.value === newPassword.value &&
    !codeError.value &&
    !passwordError.value &&
    !confirmError.value
  );
});

const handleSubmit = async () => {
  // Validar todos los campos
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (!isPasswordValid || !isConfirmValid) {
    return;
  }

  if (code.value.length !== 6) {
    codeError.value = 'El código debe tener 6 dígitos';
    return;
  }

  try {
    isSubmitting.value = true;
    codeError.value = undefined;

    await resetPasswordWithCode({
      email: email.value.trim(),
      code: code.value.trim(),
      newPassword: newPassword.value,
    });

    showSuccess(
      '¡Contraseña actualizada!',
      'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.'
    );

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push({ name: 'UserLogin' });
    }, 2000);
  } catch (error: any) {
    console.error('Error al restablecer contraseña:', error);
    
    attemptsLeft.value--;
    
    if (attemptsLeft.value <= 0) {
      showError(
        'Código inválido',
        'Has excedido el número de intentos. Solicita un nuevo código.'
      );
      setTimeout(() => {
        router.push({ name: 'password-forgot' });
      }, 3000);
    } else {
      const errorMessage = error?.message || 'Código inválido o expirado';
      codeError.value = errorMessage;
      showError('Error', errorMessage);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const requestNewCode = async () => {
  try {
    isResending.value = true;
    await requestPasswordCode(email.value.trim());
    
    showSuccess(
      'Código reenviado',
      'Se ha enviado un nuevo código a tu correo electrónico.'
    );

    // Resetear intentos y código
    attemptsLeft.value = 3;
    code.value = '';
    codeError.value = undefined;

    // Iniciar countdown de 60 segundos
    resendCountdown.value = 60;
    countdownTimer = window.setInterval(() => {
      resendCountdown.value--;
      if (resendCountdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer);
        }
      }
    }, 1000);
  } catch (error: any) {
    showError('Error', 'No se pudo reenviar el código. Intenta nuevamente.');
  } finally {
    isResending.value = false;
  }
};

// Watchers para validación en tiempo real
watch(() => newPassword.value, () => {
  if (newPassword.value) {
    validatePassword();
  }
  // También revalidar confirmación si ya tiene valor
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
});

watch(() => confirmPassword.value, () => {
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
}

.auth-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.disabled-field {
  opacity: 0.7;
}

.code-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.code-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-family: 'Courier New', monospace;
}

.code-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.code-input.input-error {
  border-color: #ef4444;
}

.code-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
  margin: 0;
}

.warning-box {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.5;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-box p {
  margin: 0;
}

.submit-button {
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.resend-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.resend-button:hover:not(:disabled) {
  background: #4f46e5;
  color: white;
}

.resend-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4f46e5;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.75rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-subtitle {
    font-size: 0.875rem;
  }

  .code-input {
    font-size: 1.25rem;
    letter-spacing: 0.35rem;
  }
}
</style>
