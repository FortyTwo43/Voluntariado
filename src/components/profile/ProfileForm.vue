<template>
  <div class="profile-form">
    <div class="form-fields">
      <ProfileField
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :value="user[field.key]"
        :error="errors[field.key]"
        :is-editing="isEditing"
        :field-type="field.type as 'text' | 'email' | 'tel'"
        :placeholder="field.placeholder"
        @update="handleFieldUpdate(field.key, $event)"
      />
    </div>
    
    <div class="form-actions">
      <ButtonPrimary
        v-if="!isEditing"
        @click="$emit('toggle-edit')"
        variant="primary"
        class="edit-button"
      >
        {{ t.edit }}
      </ButtonPrimary>
      
      <div v-else class="edit-actions">
        <ButtonPrimary
          @click="$emit('save-changes')"
          variant="primary"
          class="save-button"
        >
          {{ t.save }}
        </ButtonPrimary>
        
        <ButtonSecondary
          @click="$emit('cancel-edit')"
          variant="secondary"
          class="cancel-button"
        >
          {{ t.cancel }}
        </ButtonSecondary>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProfileField from '../profile/ProfileField.vue';
import ButtonPrimary from '../ui/ButtonPrimary.vue';
import ButtonSecondary from '../ui/ButtonSecondary.vue';
import { useLanguage } from '@/composables/useLanguage';

interface Props {
  user: any;
  isEditing: boolean;
  errors: Record<string, string>;
}

defineProps<Props>();

const emit = defineEmits<{
  'update-user': [field: string, value: string];
  'toggle-edit': [];
  'save-changes': [];
  'cancel-edit': [];
}>();

const { t } = useLanguage();

// Configuración de campos del formulario
const fields = computed(() => [
  {
    key: 'nombre',
    label: t.value.firstName,
    type: 'text',
    placeholder: t.value.firstNamePlaceholder
  },
  {
    key: 'apellido',
    label: t.value.lastName,
    type: 'text',
    placeholder: t.value.lastNamePlaceholder
  },
  {
    key: 'email',
    label: t.value.emailAddress,
    type: 'email',
    placeholder: t.value.emailPlaceholder
  },
  {
    key: 'telefono',
    label: t.value.phoneNumber,
    type: 'tel',
    placeholder: t.value.phonePlaceholder
  },
  {
    key: 'institucion_educativa',
    label: t.value.educationalInstitution,
    type: 'text',
    placeholder: t.value.institutionPlaceholder
  }
]);

// Manejar actualización de campos
const handleFieldUpdate = (field: string, value: string) => {
  emit('update-user', field, value);
};
</script>

<style scoped>
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.edit-button {
  min-width: 200px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.save-button,
.cancel-button {
  min-width: 140px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .edit-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .save-button,
  .cancel-button {
    width: 100%;
    max-width: 200px;
  }
  
  .edit-button {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 320px) {
  .form-actions {
    margin-top: 0.5rem;
  }
  
  .edit-actions {
    gap: 0.75rem;
  }
}
</style>
