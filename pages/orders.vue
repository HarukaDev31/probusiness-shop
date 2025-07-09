<template>
  <div class="min-h-screen bg-[#f5f8fb]">
    <div class="max-w-6xl mx-auto p-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Mis Pedidos</h1>
        <p class="text-gray-600">Historial de todos tus pedidos en ProBusiness</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="w-8 h-8 border-4 border-[#FF5000] border-t-transparent rounded-full animate-spin"></div>
        <span class="ml-3 text-gray-600">Cargando pedidos...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-500 mr-3" />
          <div>
            <h3 class="text-red-800 font-semibold">Error al cargar pedidos</h3>
            <p class="text-red-600 mt-1">{{ error }}</p>
          </div>
        </div>
        <button 
          @click="loadOrders" 
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No tienes pedidos aún</h3>
        <p class="text-gray-600 mb-6">Realiza tu primer pedido para verlo aquí</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center bg-[#FF5000] text-white px-6 py-3 rounded-lg hover:bg-[#e04a00] transition"
        >
          <Icon name="heroicons:shopping-cart" class="w-5 h-5 mr-2" />
          Ir a la tienda
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Order Header -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">
                  Pedido #{{ order.orderNumber }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ new Date(order.orderDate).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-800">
                  {{ $formatPrice(order.total) }}
                </div>
                <div class="mt-2">
                  <span 
                    :class="getStatusClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <h4 class="font-semibold text-gray-800 mb-4">Productos</h4>
            <div class="space-y-3">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-12 h-12 rounded object-cover"
                />
                <div class="flex-1">
                  <h5 class="font-medium text-gray-800">{{ item.name }}</h5>
                  <p class="text-sm text-gray-500">
                    Cantidad: {{ item.quantity }} | Precio: {{ $formatPrice(item.price) }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-800">
                    {{ $formatPrice(item.total) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="p-6 bg-gray-50 border-t border-gray-100">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                <p v-if="order.estimatedDelivery">
                  Entrega estimada: {{ new Date(order.estimatedDelivery).toLocaleDateString('es-PE') }}
                </p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="viewOrderDetails(order.id)"
                  class="px-4 py-2 text-[#FF5000] border border-[#FF5000] rounded hover:bg-[#FF5000] hover:text-white transition"
                >
                  Ver detalles
                </button>
                <button 
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasOrders && hasMoreOrders" class="text-center mt-8">
        <button 
          @click="loadMoreOrders"
          :disabled="isLoading"
          class="bg-[#FF5000] text-white px-6 py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
        >
          {{ isLoading ? 'Cargando...' : 'Cargar más pedidos' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '~/composables/useOrders'

const { $formatPrice } = useNuxtApp()
const orders = ref([])
// Usar el composable de órdenes
const { 
  loading: isLoading, 
  error, 
  hasOrders, 
  hasError, 
  getCustomerOrders, 
  getOrderDetails, 
  cancelOrder: cancelOrderAction,
  clearError 
} = useOrders()

// Estado para paginación
const hasMoreOrders = ref(true)
const currentPage = ref(1)

// Cargar pedidos al montar el componente
onMounted(() => {
  loadOrders()
})

/**
 * Cargar pedidos del cliente
 */
async function loadOrders() {
  clearError()
  
  const result = await getCustomerOrders()
  orders.value = result.data
  
  if (!result.success) {
    console.error('Error al cargar pedidos:', result.message)
  }
}

/**
 * Cargar más pedidos (paginación)
 */
async function loadMoreOrders() {
  // Implementar lógica de paginación
  currentPage.value++
  // Aquí cargarías más pedidos
}

/**
 * Ver detalles de un pedido específico
 */
async function viewOrderDetails(orderId) {
  const result = await getOrderDetails(orderId)
  
  if (result.success) {
    // Aquí podrías navegar a una página de detalles o abrir un modal
    console.log('Detalles del pedido:', result.data)
  } else {
    alert('Error al cargar los detalles del pedido')
  }
}

/**
 * Cancelar un pedido
 */
async function cancelOrder(orderId) {
  if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
    const result = await cancelOrderAction(orderId, 'Cancelado por el cliente')
    
    if (result.success) {
      alert('Pedido cancelado exitosamente')
      // Recargar la lista de pedidos
      await loadOrders()
    } else {
      alert('Error al cancelar el pedido: ' + result.message)
    }
  }
}

/**
 * Obtener clase CSS para el estado del pedido
 */
function getStatusClass(status) {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Obtener texto del estado del pedido
 */
function getStatusText(status) {
  const statusTexts = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  
  return statusTexts[status] || 'Desconocido'
}
</script> 