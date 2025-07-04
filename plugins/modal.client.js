import { ref, computed, h } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en el cliente
  if (process.server) return

  const isOpen = ref(false)
  const modalConfig = ref({
    title: '',
    message: '',
    type: 'info',
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

  // Componentes de iconos
  const CheckIcon = {
    render() {
      return h('svg', {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M5 13l4 4L19 7'
        })
      ])
    }
  }

  const XCircleIcon = {
    render() {
      return h('svg', {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        })
      ])
    }
  }

  const ExclamationTriangleIcon = {
    render() {
      return h('svg', {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        })
      ])
    }
  }

  const InformationCircleIcon = {
    render() {
      return h('svg', {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        })
      ])
    }
  }

  // Componente GlobalModal
  const GlobalModal = {
    render() {
      if (!isOpen.value) return null

      const iconComponent = computed(() => {
        const icons = {
          success: CheckIcon,
          error: XCircleIcon,
          warning: ExclamationTriangleIcon,
          info: InformationCircleIcon
        }
        return icons[modalConfig.value.type] || InformationCircleIcon
      })

      const iconClasses = computed(() => {
        const classes = {
          success: 'bg-green-100',
          error: 'bg-red-100',
          warning: 'bg-yellow-100',
          info: 'bg-blue-100'
        }
        return classes[modalConfig.value.type] || 'bg-blue-100'
      })

      const confirmButtonClasses = computed(() => {
        const classes = {
          success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
        return classes[modalConfig.value.type] || 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      })

      return h('div', { class: 'modal-container' }, [
        h('div', {
          class: 'fixed inset-0 z-50 flex items-center justify-center p-4',
          onClick: hideModal
        }, [
          // Backdrop
          h('div', { class: 'absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm' }),
          
          // Modal
          h('div', {
            class: 'relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl',
            onClick: (e) => e.stopPropagation()
          }, [
            // Icono
            h('div', { class: 'mb-4 flex items-center justify-center' }, [
              h('div', {
                class: `flex h-12 w-12 items-center justify-center rounded-full ${iconClasses.value}`
              }, [
                h(iconComponent.value, { class: 'h-6 w-6 text-white' })
              ])
            ]),

            // Título
            h('div', { class: 'mb-4 text-center' }, [
              h('h3', { class: 'text-lg font-semibold text-gray-900' }, modalConfig.value.title)
            ]),

            // Mensaje
            h('div', { class: 'mb-6 text-center' }, [
              h('p', { class: 'text-sm text-gray-600' }, modalConfig.value.message)
            ]),

            // Botones
            h('div', { class: 'flex justify-center space-x-3' }, [
              modalConfig.value.showCancel && h('button', {
                class: 'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                onClick: cancel
              }, modalConfig.value.cancelText),
              h('button', {
                class: `rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClasses.value}`,
                onClick: confirm
              }, modalConfig.value.confirmText)
            ]),

            // Botón cerrar
            h('button', {
              class: 'absolute right-4 top-4 text-gray-400 hover:text-gray-600',
              onClick: hideModal
            }, [
              h('svg', {
                class: 'h-6 w-6',
                fill: 'none',
                viewBox: '0 0 24 24',
                stroke: 'currentColor'
              }, [
                h('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  d: 'M6 18L18 6M6 6l12 12'
                })
              ])
            ])
          ])
        ])
      ])
    }
  }

  // Registrar el componente GlobalModal
  nuxtApp.vueApp.component('GlobalModal', GlobalModal)

  return {
    provide: {
      modal: {
        show: showModal,
        hide: hideModal,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm
      }
    }
  }
}) 