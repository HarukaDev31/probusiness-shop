import { ref } from 'vue'

export const useModal = () => {
  const isOpen = ref(false)
  const modalConfig = ref({
    title: '',
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: false,
    onConfirm: null,
    onCancel: null
  })

  const showModal = (config) => {
    modalConfig.value = {
      ...modalConfig.value,
      ...config
    }
    isOpen.value = true
  }

  const hideModal = () => {
    isOpen.value = false
  }

  const confirm = () => {
    if (modalConfig.value.onConfirm) {
      modalConfig.value.onConfirm()
    }
    hideModal()
  }

  const cancel = () => {
    if (modalConfig.value.onCancel) {
      modalConfig.value.onCancel()
    }
    hideModal()
  }

  // Métodos de conveniencia para diferentes tipos de alertas
  const showSuccess = (message, title = 'Éxito') => {
    showModal({
      title,
      message,
      type: 'success',
      showCancel: false
    })
  }

  const showError = (message, title = 'Error') => {
    showModal({
      title,
      message,
      type: 'error',
      showCancel: false
    })
  }

  const showWarning = (message, title = 'Advertencia') => {
    showModal({
      title,
      message,
      type: 'warning',
      showCancel: false
    })
  }

  const showInfo = (message, title = 'Información') => {
    showModal({
      title,
      message,
      type: 'info',
      showCancel: false
    })
  }

  const showConfirm = (message, title = 'Confirmar', onConfirm, onCancel) => {
    showModal({
      title,
      message,
      type: 'info',
      showCancel: true,
      onConfirm,
      onCancel
    })
  }

  return {
    isOpen,
    modalConfig,
    showModal,
    hideModal,
    confirm,
    cancel,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  }
} 