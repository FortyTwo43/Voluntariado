<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">{{ t.resetTitle }}</h1>
          <p class="auth-subtitle">
            {{ t.resetSubtitle }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <InputField
            id="email"
            :label="t.emailAddress"
            type="email"
            v-model="email"
            :disabled="true"
            class="disabled-field"
          />

          <div class="code-field">
            <label for="code" class="field-label">{{ t.verificationCode }}</label>
            <input
              id="code"
              type="tel"
              v-model="code"
              :placeholder="t.codePlaceholder"
              maxlength="6"
              class="code-input"
              :class="{ 'input-error': codeError }"
              :disabled="isSubmitting"
              @input="handleCodeInput"
              required
            />
            <p v-if="codeError" class="error-message">{{ codeError }}</p>
            <p class="field-hint">{{ t.enterSixDigitCode }}</p>
          </div>

          <InputField
            id="newPassword"
            :label="t.newPasswordLabel"
            type="password"
            v-model="newPassword"
            placeholder="••••••••"
            :error="passwordError"
            :disabled="isSubmitting"
            required
          />

          <InputField
            id="confirmPassword"
            :label="t.confirmNewPassword"
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
            <p>{{ t.attemptsLeftPrefix }} {{ attemptsLeft }} {{ t.attemptsLeftSuffix }}</p>
          </div>

          <ButtonPrimary
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="submit-button"
          >
            <span v-if="isSubmitting">{{ t.resetting }}</span>
            <span v-else>{{ t.resetPassword }}</span>
          </ButtonPrimary>

          <div class="form-actions">
            <button
              type="button"
              @click="requestNewCode"
              :disabled="isResending || resendCountdown > 0"
              class="resend-button"
            >
              <span v-if="isResending">{{ t.resending }}</span>
              <span v-else-if="resendCountdown > 0">
                {{ t.resendInPrefix }} {{ resendCountdown }}s
              </span>
              <span v-else>{{ t.resendCode }}</span>
            </button>

            <router-link to="/login" class="back-link">
              {{ t.backToLogin }}
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
import { useLanguage } from '@/composables/useLanguage';
import { requestPasswordCode, resetPasswordWithCode } from '@/services/passwordReset.service';
import InputField from '@/components/ui/InputField.vue';
import ButtonPrimary from '@/components/ui/ButtonPrimary.vue';

const route = useRoute();
const router = useRouter();
const { showSuccess, showError } = useAlert();
const { t } = useLanguage();

const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const codeErrorKey = ref<string | undefined>(undefined);
const passwordErrorKey = ref<string | undefined>(undefined);
const confirmErrorKey = ref<string | undefined>(undefined);

// Computed que traduce las claves de error dinámicamente
const codeError = computed(() => 
  codeErrorKey.value ? (t.value as any)[codeErrorKey.value] : undefined
);
const passwordError = computed(() => 
  passwordErrorKey.value ? (t.value as any)[passwordErrorKey.value] : undefined
);
const confirmError = computed(() => 
  confirmErrorKey.value ? (t.value as any)[confirmErrorKey.value] : undefined
);

const isSubmitting = ref(false);
const isResending = ref(false);
const attemptsLeft = ref(3);
const resendCountdown = ref(0);

let countdownTimer: number | undefined;

onMounted(() => {
  email.value = (route.query.email as string) || '';
  if (!email.value) {
    showError(t.value.errorTitle, t.value.emailNotProvided);
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
  codeErrorKey.value = undefined;
};

const validatePassword = () => {
  if (!newPassword.value) {
    passwordErrorKey.value = 'fieldRequired';
    return false;
  }
  
  const lengthOk = newPassword.value.length >= 8;
  const numberOk = /\d/.test(newPassword.value);
  const uppercaseOk = /[A-Z]/.test(newPassword.value);
  const lowercaseOk = /[a-z]/.test(newPassword.value);
  const specialOk = /[^A-Za-z0-9]/.test(newPassword.value);
  
  if (!lengthOk) {
    passwordErrorKey.value = 'passwordTooShort';
    return false;
  }
  if (!uppercaseOk || !lowercaseOk || !numberOk || !specialOk) {
    passwordErrorKey.value = 'passwordRequirements';
    return false;
  }
  
  passwordErrorKey.value = undefined;
  return true;
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmErrorKey.value = 'fieldRequired';
    return false;
  }
  if (confirmPassword.value !== newPassword.value) {
    confirmErrorKey.value = 'passwordsMismatch';
    return false;
  }
  confirmErrorKey.value = undefined;
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
    codeErrorKey.value = 'codeMustBeSixDigits';
    return;
  }

  try {
    isSubmitting.value = true;
    codeErrorKey.value = undefined;

    await resetPasswordWithCode({
      email: email.value.trim(),
      code: code.value.trim(),
      newPassword: newPassword.value,
    });

    showSuccess(
      t.value.passwordUpdatedTitle,
      t.value.passwordUpdatedDesc
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
        t.value.invalidCodeTitle,
        t.value.attemptsExceededDesc
      );
      setTimeout(() => {
        router.push({ name: 'password-forgot' });
      }, 3000);
    } else {
      // Si hay un mensaje de error del servidor, usar la clave genérica
      codeErrorKey.value = 'invalidOrExpiredCode';
      const errorMessage = error?.message || t.value.invalidOrExpiredCode;
      showError(t.value.errorTitle, errorMessage);
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
      t.value.codeResentTitle,
      t.value.codeResentDesc
    );

    // Resetear intentos y código
    attemptsLeft.value = 3;
    code.value = '';
    codeErrorKey.value = undefined;

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
    showError(t.value.errorTitle, t.value.resendCodeError);
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
