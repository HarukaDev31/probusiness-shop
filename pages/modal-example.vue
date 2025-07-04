<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="mx-auto max-w-4xl px-4">
      <h1 class="mb-8 text-center text-3xl font-bold text-gray-900">
        Ejemplos de Modales
      </h1>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Modal de Éxito -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal de Éxito</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra una alerta de éxito con un mensaje personalizado.
          </p>
          <button
            @click="showSuccessExample"
            class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Mostrar Éxito
          </button>
        </div>

        <!-- Modal de Error -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal de Error</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra una alerta de error con un mensaje personalizado.
          </p>
          <button
            @click="showErrorExample"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Mostrar Error
          </button>
        </div>

        <!-- Modal de Advertencia -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal de Advertencia</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra una alerta de advertencia con un mensaje personalizado.
          </p>
          <button
            @click="showWarningExample"
            class="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Mostrar Advertencia
          </button>
        </div>

        <!-- Modal de Información -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal de Información</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra una alerta de información con un mensaje personalizado.
          </p>
          <button
            @click="showInfoExample"
            class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Mostrar Información
          </button>
        </div>

        <!-- Modal de Confirmación -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal de Confirmación</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra una alerta de confirmación con botones de aceptar y cancelar.
          </p>
          <button
            @click="showConfirmExample"
            class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Mostrar Confirmación
          </button>
        </div>

        <!-- Modal Personalizado -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Modal Personalizado</h3>
          <p class="mb-4 text-sm text-gray-600">
            Muestra un modal con configuración personalizada.
          </p>
          <button
            @click="showCustomExample"
            class="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Mostrar Personalizado
          </button>
        </div>
      </div>
    </div>

    <!-- Componente Modal -->
    <Modal
      :is-open="isOpen"
      :modal-config="modalConfig"
      @confirm="confirm"
      @cancel="cancel"
      @close="hideModal"
    />
  </div>
</template>

<script setup>
import { useModal } from '~/composables/useModal'

const { $modal } = useNuxtApp()
const { isOpen, modalConfig, showModal, hideModal, confirm, cancel } = useModal()

// Ejemplos de uso
const showSuccessExample = () => {
  $modal.showSuccess('¡Operación completada exitosamente!', 'Éxito')
}

const showErrorExample = () => {
  $modal.showError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.', 'Error')
}

const showWarningExample = () => {
  $modal.showWarning('Esta acción no se puede deshacer. ¿Estás seguro?', 'Advertencia')
}

const showInfoExample = () => {
  $modal.showInfo('Esta es una información importante que debes conocer.', 'Información')
}

const showConfirmExample = () => {
  $modal.showConfirm(
    '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.',
    'Confirmar Eliminación',
    () => {
      console.log('Usuario confirmó la acción')
      $modal.showSuccess('Elemento eliminado correctamente')
    },
    () => {
      console.log('Usuario canceló la acción')
    }
  )
}

const showCustomExample = () => {
  showModal({
    title: 'Modal Personalizado',
    message: 'Este es un modal con configuración personalizada. Puedes personalizar el título, mensaje, botones y acciones.',
    type: 'info',
    confirmText: 'Entendido',
    cancelText: 'Cerrar',
    showCancel: true,
    onConfirm: () => {
      console.log('Usuario hizo clic en Entendido')
    },
    onCancel: () => {
      console.log('Usuario hizo clic en Cerrar')
    }
  })
}
</script> 