<template>
  <MainLayout>
    <div class="profile-page">
      <div class="profile-container">
        <h1 class="page-title">Mi Perfil</h1>
        
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
import MainLayout from '../layouts/MainLayout.vue';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import ProfileForm from '../components/profile/ProfileForm.vue';

const { showSuccess, showError } = useAlert();

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
    Object.assign(userData, user);
  }
};

// Manejar edición de foto
const handleEditPhoto = () => {
  // Implementar lógica de cambio de foto
  showSuccess('Función en desarrollo', 'La edición de foto estará disponible próximamente');
};

// Actualizar datos del usuario
const handleUpdateUser = (field: string, value: string) => {
  (userData as any)[field] = value;
  // Limpiar error del campo si existe
  if (errors[field]) {
    errors[field] = '';
  }
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
    Object.assign(errors, validationErrors);
    return;
  }

  try {
    // Aquí iría la lógica para guardar en la base de datos
    // Por ahora simulamos el guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    isEditing.value = false;
    showSuccess('Perfil actualizado', 'Tus datos se han guardado correctamente');
  } catch (error) {
    showError('Error al guardar', 'No se pudieron guardar los cambios. Intenta nuevamente.');
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

// Validar datos del usuario
const validateUserData = (): Record<string, string> => {
  const validationErrors: Record<string, string> = {};
  
  if (!userData.nombre.trim()) {
    validationErrors.nombre = 'El nombre es requerido';
  }
  
  if (!userData.apellido.trim()) {
    validationErrors.apellido = 'El apellido es requerido';
  }
  
  if (!userData.email.trim()) {
    validationErrors.email = 'El correo electrónico es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    validationErrors.email = 'El formato del correo no es válido';
  }
  
  if (!userData.telefono.trim()) {
    validationErrors.telefono = 'El teléfono es requerido';
  }
  
  if (!userData.institucion_educativa.trim()) {
    validationErrors.institucion_educativa = 'La institución educativa es requerida';
  }
  
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
