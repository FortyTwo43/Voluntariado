<template>
  <UsuarioLayout>
    <div class="profile-page">
      <div class="profile-container">
        <!-- <h1 class="page-title">{{ t.myProfileTitle }}</h1> -->
        
        <div class="profile-card">
          <ProfileHeader 
            :user="userData"
            :is-editing="isEditing"
            @edit-photo="handleEditPhoto"
          />
          
          <ProfileOrganizacionForm
            :user="userData"
            :is-editing="isEditing"
            :errors="errors"
            @update-user="handleUpdateUser"
            @toggle-edit="toggleEditMode"
            @save-changes="handleSaveChanges"
            @cancel-edit="handleCancelEdit"
          />
          
        </div>
      </div>
    </div>
  </UsuarioLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAlert } from '../composables/useAlert';
import { useLanguage } from '../composables/useLanguage';
import { actualizarOrganizacion } from '../services/authService';
import UsuarioLayout from '../layouts/UsuarioLayout.vue';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import ProfileOrganizacionForm from '@/components/profile/organizacion/ProfileOrganizacionForm.vue';

const { showSuccess, showError } = useAlert();
const { t } = useLanguage();

// Estado del usuario
const userData = reactive<any>({
  nombre: '',
  tipo: '',
  direccion: '',
  email: '',
});

// Estado de edición
const isEditing = ref(false);
const errors = reactive<Record<string, string>>({});

// Cargar datos del usuario al montar
onMounted(() => {
  loadUserData();
});

// Cargar datos del usuario desde localStorage
const loadUserData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    
    // Asignar todos los campos disponibles
    userData.nombre = user.nombre || '';
    userData.tipo = user.tipo || '';
    userData.direccion = user.direccion || '';
    userData.email = user.email || '';
    
    // Mantener otros campos que puedan existir
    Object.keys(user).forEach(key => {
      if (!(key in userData)) {
        (userData as any)[key] = user[key];
      }
    });
  }
};

// Manejar edición de foto
const handleEditPhoto = () => {
  // Implementar lógica de cambio de foto
  showSuccess(t.value.infoTitle, t.value.photoEditSoon);
};

// Actualizar datos del usuario
const handleUpdateUser = (field: string, value: string) => {
  (userData as any)[field] = value;
  
  // Validar el campo en tiempo real
  validateField(field, value);
};

// Alternar modo de edición
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // Limpiar errores al cancelar edición
    Object.keys(errors).forEach(key => {
      errors[key] = '';
    });
  }
};

// Guardar cambios
const handleSaveChanges = async () => {
  // Validar campos
  const validationErrors = validateUserData();
  if (Object.keys(validationErrors).length > 0) {
    // Los errores ya están en el objeto reactive 'errors'
    return;
  }

  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
  showError(t.value.errorTitle, t.value.noUserInfoFound);
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Preparar datos para actualizar (campos de organización)
    const datosActualizar = {
      nombre: userData.nombre,
      tipo: userData.tipo,
      direccion: userData.direccion,
      email: userData.email
    };

    // Actualizar en la base de datos
    const success = await actualizarOrganizacion(user.id, datosActualizar);
    
    if (success) {
      // Actualizar localStorage con los nuevos datos
      const updatedUser = {
        ...user,
        ...datosActualizar
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      isEditing.value = false;
      showSuccess(t.value.successTitle, t.value.profileUpdated);
    } else {
      showError(t.value.errorTitle, t.value.profileUpdateError);
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    showError(t.value.errorTitle, t.value.profileUpdateError);
  }
};

// Cancelar edición
const handleCancelEdit = () => {
  // Recargar datos originales
  loadUserData();
  isEditing.value = false;
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

// Validar campo individual en tiempo real
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'nombre':
      if (!value || !value.trim()) {
        errors.nombre = t.value.fieldRequired;
      } else {
        errors.nombre = '';
      }
      break;
      
    case 'tipo':
      if (!value || !value.trim()) {
        errors.tipo = t.value.fieldRequired;
      } else {
        errors.tipo = '';
      }
      break;
      
    case 'direccion':
      if (!value || !value.trim()) {
        errors.direccion = t.value.fieldRequired;
      } else {
        errors.direccion = '';
      }
      break;
      
    case 'email':
      if (!value || !value.trim()) {
        errors.email = t.value.fieldRequired;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        errors.email = t.value.invalidEmail;
      } else {
        errors.email = '';
      }
      break;
  }
};

// Validar datos del usuario
const validateUserData = (): Record<string, string> => {
  // Validar todos los campos de organización
  validateField('nombre', userData.nombre);
  validateField('tipo', userData.tipo);
  validateField('direccion', userData.direccion);
  validateField('email', userData.email);
  
  // Retornar solo los errores que no estén vacíos
  const validationErrors: Record<string, string> = {};
  Object.keys(errors).forEach(key => {
    if (errors[key]) {
      validationErrors[key] = errors[key];
    }
  });
  
  return validationErrors;
};
</script>

<style scoped>
.profile-page {
  padding: 0rem 1rem;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
}

.profile-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
}

@media (max-width: 640px) {
  .profile-page {
    padding: 1rem 0.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
}

@media (max-width: 320px) {
  .profile-page {
    padding: 0.5rem;
  }
  
  .profile-card {
    padding: 1rem;
  }
}
</style>
