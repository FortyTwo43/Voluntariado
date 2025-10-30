import { ref } from 'vue';

export interface AlertOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  id?: number;
}

const alerts = ref<AlertOptions[]>([]);
let alertIdCounter = 0;

export function useAlert() {
  const showAlert = (options: AlertOptions) => {
    const alert = {
      type: 'info' as const,
      duration: 5000,
      ...options,
      id: alertIdCounter++,
    };
    
    alerts.value.push(alert);
    
    // Auto-remover después de la duración especificada
    if (alert.duration > 0) {
      setTimeout(() => {
        removeAlert(alert);
      }, alert.duration);
    }
  };

  const removeAlert = (alertToRemove: AlertOptions) => {
    const index = alerts.value.findIndex(alert => alert.id === alertToRemove.id);
    if (index > -1) {
      alerts.value.splice(index, 1);
    }
  };

  const showSuccess = (title: string, message?: string) => {
    showAlert({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    showAlert({ type: 'error', title, message });
  };

  const showWarning = (title: string, message?: string) => {
    showAlert({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    showAlert({ type: 'info', title, message });
  };

  return {
    alerts,
    showAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
