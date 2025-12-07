<template>
  <div class="profile-header">
    <div class="profile-photo-container">
      <div class="profile-photo">
        <img 
          v-if="(user as any).foto_perfil" 
          :src="(user as any).foto_perfil" 
          :alt="`${t.photoOf} ${user.nombre} ${(user as any).apellido || ''}`"
          class="profile-image"
        />
        <div v-else class="profile-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <button 
          v-if="isEditing"
          class="edit-photo-btn"
          @click="$emit('edit-photo')"
          :aria-label="t.editPhoto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="profile-info">
      <h2 class="profile-name">{{ user.nombre }} {{ (user as any).apellido || '' }}</h2>
      <p class="profile-role">{{ (user as any).rol || t.defaultRole }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage';
interface Props {
  user: any;
  isEditing: boolean;
}

defineProps<Props>();

defineEmits<{
  'edit-photo': [];
}>();

const { t } = useLanguage();
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 3vw, 1.25rem);
  margin-bottom: clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
}

.profile-photo-container {
  position: relative;
  display: inline-block;
  margin: 0;
  flex-shrink: 0;
}

.profile-photo {
  position: relative;
  width: clamp(80px, 20vw, 120px);
  height: clamp(80px, 20vw, 120px);
  margin: 0;
}

.profile-image,
.profile-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #4f46e5;
  object-fit: cover;
}

.profile-placeholder {
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.profile-placeholder svg {
  width: 48px;
  height: 48px;
}

.edit-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: clamp(28px, 7vw, 36px);
  height: clamp(28px, 7vw, 36px);
  background: #4f46e5;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.edit-photo-btn:hover {
  background: #4338ca;
  transform: scale(1.05);
}

.edit-photo-btn svg {
  width: clamp(14px, 3.5vw, 18px);
  height: clamp(14px, 3.5vw, 18px);
}

.profile-info {
  text-align: left;
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: clamp(1.25rem, 4vw, 1.875rem);
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 clamp(0.25rem, 1vw, 0.5rem) 0;
  word-wrap: break-word;
}

.profile-role {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  .profile-info {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .profile-header {
    gap: clamp(0.5rem, 1.5vw, 1rem);
  }
  
  .profile-name {
    font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  }
  
  .edit-photo-btn {
    width: clamp(26px, 6.5vw, 32px);
    height: clamp(26px, 6.5vw, 32px);
  }
  
  .edit-photo-btn svg {
    width: clamp(13px, 3.25vw, 16px);
    height: clamp(13px, 3.25vw, 16px);
  }
}

@media (max-width: 480px) {
  .profile-header {
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
  }
  
  .profile-name {
    font-size: clamp(1rem, 3vw, 1.25rem);
  }
  
  .profile-role {
    font-size: clamp(0.8rem, 2vw, 0.875rem);
  }
}
</style>
