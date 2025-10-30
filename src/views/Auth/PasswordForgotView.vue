<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">{{ t.forgotTitle }}</h1>
          <p class="auth-subtitle">
            {{ t.forgotSubtitle }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <InputField
            id="email"
            :label="t.emailAddress"
            type="email"
            v-model="email"
            :placeholder="t.emailPlaceholder"
            :error="emailError"
            :disabled="isSubmitting"
            required
          />

          <div class="info-box" v-if="!isSubmitting && !emailSent">
            <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <p>{{ t.codeExpiresInfo }}</p>
          </div>

          <ButtonPrimary
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="submit-button"
          >
            <span v-if="isSubmitting">{{ t.sendingCode }}</span>
            <span v-else>{{ t.sendCode }}</span>
          </ButtonPrimary>

          <div class="back-to-login">
            <router-link to="/login" class="back-link">
              <svg class="back-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              {{ t.backToLogin }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAlert } from '@/composables/useAlert';
import { useLanguage } from '@/composables/useLanguage';
import { requestPasswordCode } from '@/services/passwordReset.service';
import InputField from '@/components/ui/InputField.vue';
import ButtonPrimary from '@/components/ui/ButtonPrimary.vue';

const router = useRouter();
const { showSuccess, showError } = useAlert();
const { t } = useLanguage();

const email = ref('');
const emailErrorKey = ref<string | undefined>(undefined);
const isSubmitting = ref(false);
const emailSent = ref(false);

// Computed que traduce la clave de error dinámicamente
const emailError = computed(() => 
  emailErrorKey.value ? (t.value as any)[emailErrorKey.value] : undefined
);

const isFormValid = computed(() => {
  if (!email.value.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value.trim());
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    emailErrorKey.value = email.value.trim() === '' ? 'fieldRequired' : 'invalidEmail';
    return;
  }

  try {
    isSubmitting.value = true;
    emailErrorKey.value = undefined;
    
    await requestPasswordCode(email.value.trim());
    
    emailSent.value = true;
    showSuccess(
      t.value.codeSentTitle,
      t.value.codeSentDesc
    );

    // Redirigir a la pantalla de ingreso de código
    setTimeout(() => {
      router.push({
        name: 'password-reset-otp',
        query: { email: email.value.trim() }
      });
    }, 2000);
  } catch (error: any) {
    console.error('Error al solicitar código:', error);
    showError(
      t.value.errorTitle,
      error?.message || t.value.codeSendError
    );
  } finally {
    isSubmitting.value = false;
  }
};
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

.info-box {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;
  font-size: 0.875rem;
  line-height: 1.5;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-box p {
  margin: 0;
}

.submit-button {
  margin-top: 0.5rem;
}

.back-to-login {
  text-align: center;
  margin-top: 0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4f46e5;
}

.back-icon {
  width: 1rem;
  height: 1rem;
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
}
</style>
