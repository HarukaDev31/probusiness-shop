<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        
        <!-- Modal -->
        <div
          class="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl"
          @click.stop
        >
          <!-- Icono según el tipo -->
          <div class="mb-4 flex items-center justify-center">
            <div
              :class="[
                'flex h-12 w-12 items-center justify-center rounded-full',
                iconClasses
              ]"
            >
              <component :is="iconComponent" class="h-6 w-6 text-white" />
            </div>
          </div>

          <!-- Título -->
          <div class="mb-4 text-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ modalConfig.title }}
            </h3>
          </div>

          <!-- Mensaje -->
          <div class="mb-6 text-center">
            <p class="text-sm text-gray-600">
              {{ modalConfig.message }}
            </p>
          </div>

          <!-- Botones -->
          <div class="flex justify-center space-x-3">
            <button
              v-if="modalConfig.showCancel"
              @click="cancel"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {{ modalConfig.cancelText }}
            </button>
            <button
              @click="confirm"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
                confirmButtonClasses
              ]"
            >
              {{ modalConfig.confirmText }}
            </button>
          </div>

          <!-- Botón de cerrar -->
          <button
            @click="hideModal"
            class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  modalConfig: {
    type: Object,
    default: () => ({
      title: '',
      message: '',
      type: 'info',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: false,
      onConfirm: null,
      onCancel: null
    })
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const iconComponent = computed(() => {
  const icons = {
    success: 'CheckIcon',
    error: 'XCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon'
  }
  return icons[props.modalConfig.type] || 'InformationCircleIcon'
})

const iconClasses = computed(() => {
  const classes = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classes[props.modalConfig.type] || 'bg-blue-100'
})

const confirmButtonClasses = computed(() => {
  const classes = {
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
  return classes[props.modalConfig.type] || 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}

const hideModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  hideModal()
}
</script>

<script>
// Iconos SVG como componentes
export default {
  components: {
    CheckIcon: {
      template: `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      `
    },
    XCircleIcon: {
      template: `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `
    },
    ExclamationTriangleIcon: {
      template: `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      `
    },
    InformationCircleIcon: {
      template: `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `
    }
  }
}
</script> 