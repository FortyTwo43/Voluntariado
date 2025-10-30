<template>
  <MainLayout>
    <div class="profile-page">
      <div class="profile-container">
        <h1 class="page-title">{{ t.myProfileTitle }}</h1>
        
        <div class="profile-card">
          <ProfileHeader 
            :user="userData"
            :is-editing="isEditing"
            @edit-photo="handleEditPhoto"
          />
          
          <ProfileForm 
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
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAlert } from '../composables/useAlert';
import { useLanguage } from '../composables/useLanguage';
import { actualizarVoluntario } from '../services/authService';
import MainLayout from '../layouts/MainLayout.vue';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import ProfileForm from '../components/profile/ProfileForm.vue';

const { showSuccess, showError } = useAlert();
const { t, currentLanguage } = useLanguage();

// Estado del usuario
const userData = reactive<any>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  institucion_educativa: '',
  contrasena: ''
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
    userData.apellido = user.apellido || '';
    userData.email = user.email || user.correo || '';
    userData.telefono = user.telefono || '';
    userData.institucion_educativa = user.institucion_educativa || '';
    userData.contrasena = user.contrasena || '';
    
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
  showSuccess(t.value.infoTitle, currentLanguage.value === 'es' ? 'La edición de foto estará disponible próximamente' : 'Photo editing will be available soon');
};

// Actualizar datos del usuario
const handleUpdateUser = (field: string, value: string) => {
  // Si es teléfono, filtrar solo números
  if (field === 'telefono') {
    value = value.replace(/\D/g, '');
  }
  
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
      showError('Error', 'No se encontró la información del usuario');
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Preparar datos para actualizar (sin incluir contraseña ni tipo)
    const datosActualizar = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      telefono: userData.telefono,
      institucion_educativa: userData.institucion_educativa
    };

    // Actualizar en la base de datos
    const success = await actualizarVoluntario(user.id, datosActualizar);
    
    if (success) {
      // Actualizar localStorage con los nuevos datos
      const updatedUser = {
        ...user,
        ...datosActualizar
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      isEditing.value = false;
      showSuccess('¡Perfil actualizado!', 'Tus datos se han guardado correctamente');
    } else {
      showError('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    showError('Error', 'Ocurrió un error al actualizar el perfil. Por favor, intenta nuevamente.');
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
        errors.nombre = 'El nombre es requerido';
      } else {
        errors.nombre = '';
      }
      break;
      
    case 'apellido':
      if (!value || !value.trim()) {
        errors.apellido = 'El apellido es requerido';
      } else {
        errors.apellido = '';
      }
      break;
      
    case 'email':
      if (!value || !value.trim()) {
        errors.email = 'El correo electrónico es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        errors.email = 'El formato del correo no es válido';
      } else {
        errors.email = '';
      }
      break;
      
    case 'telefono':
      if (!value || !value.trim()) {
        errors.telefono = 'El teléfono es requerido';
      } else if (!/^\d+$/.test(value.trim())) {
        errors.telefono = 'El teléfono debe contener solo números';
      } else if (value.trim().length !== 10) {
        errors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
      } else {
        errors.telefono = '';
      }
      break;
      
    case 'institucion_educativa':
      if (!value || !value.trim()) {
        errors.institucion_educativa = 'La institución educativa es requerida';
      } else {
        errors.institucion_educativa = '';
      }
      break;
  }
};

// Validar datos del usuario
const validateUserData = (): Record<string, string> => {
  // Validar todos los campos
  validateField('nombre', userData.nombre);
  validateField('apellido', userData.apellido);
  validateField('email', userData.email);
  validateField('telefono', userData.telefono);
  validateField('institucion_educativa', userData.institucion_educativa);
  
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
  padding: 2rem 1rem;
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
