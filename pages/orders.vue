<template>
  <div class="min-h-screen bg-[#f5f8fb]">
    <div class="max-w-6xl mx-auto p-6">
      <!-- Filtro de año y contador de pedidos -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow-md p-6 mb-6 gap-4">
        <div class="flex items-center gap-2">
          <span class="font-bold text-lg text-gray-800">{{ orders.length }} pedidos</span>
          <span class="text-gray-600">realizados en</span>
          <select
            id="order-filter"
            v-model="selectedFilter"
            @change="loadOrders"
            class="border border-gray-300 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
          >
            <option value="last_30_days">Últimos 30 días</option>
            <option value="last_3_months">Últimos 3 meses</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
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
        <button @click="loadOrders" class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Intentar de nuevo
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No tienes pedidos aún</h3>
        <p class="text-gray-600 mb-6">Realiza tu primer pedido para verlo aquí</p>
        <NuxtLink to="/"
          class="inline-flex items-center bg-[#FF5000] text-white px-6 py-3 rounded-lg hover:bg-[#e04a00] transition">
          <Icon name="heroicons:shopping-cart" class="w-5 h-5 mr-2" />
          Ir a la tienda
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-8">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-2xl border border-gray-300 overflow-hidden">
          <!-- Order Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 px-6 py-4 border-b border-gray-200">
            <div>
              <div class="text-sm text-gray-500 font-medium">PEDIDO REALIZADO</div>
              <div class="text-lg text-gray-800 font-semibold">{{ new Date(order.orderDate).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
            </div>
            <div class="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
              <div class="text-sm text-gray-500 font-medium">TOTAL</div>
              <div class="text-xl text-gray-800 font-bold">{{ $formatPrice(order.total) }}</div>
            </div>
            <div class="flex flex-col md:items-end">
              <div class="text-sm text-gray-500 font-medium">N. PEDIDO</div>
              <div class="text-lg text-gray-800 font-semibold">{{ order.orderNumber }}</div>
            </div>
          </div>

          <!-- Order Content -->
          <div class="flex flex-col md:flex-row items-center gap-6 px-6 py-6">
            <!-- Product Image -->
            <div class="flex-shrink-0">
              <img :src="order.items[0]?.image" :alt="order.items[0]?.name" class="w-20 h-20 rounded object-cover border border-gray-200" />
            </div>
            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <div 
                class="font-bold text-lg text-gray-800 truncate cursor-pointer hover:text-[#FF5000] transition-colors"
                @click="goToProduct(order.items[0]?.productId)"
              >
              
                {{ order.items[0]?.name }}
              </div>
              <div class="text-gray-600 text-sm mt-1 truncate">
                {{ order.items.length > 1 ? `y ${order.items.length - 1} producto(s) más` : ' ' }}
              </div>
            </div>
            <!-- Actions -->
            <div class="flex flex-col gap-2 items-end min-w-[200px]">
              <button
                class="w-full min-w-[180px] px-6 py-2 border border-[#FF5000] text-[#FF5000] rounded-lg font-medium hover:bg-[#FF5000] hover:text-white transition"
                @click="toggleOrderDetails(order.id)"
              >
                {{ openDetails[order.id] ? 'Ocultar detalle' : 'Ver detalle de pedido' }}
              </button>
              <button :class="[getStatusClass(order.status), 'w-full min-w-[180px] px-6 py-2 rounded-lg font-medium border border-gray-300']">
                {{ getStatusText(order.status) }}
              </button>
            </div>
          </div>

          <!-- Accordion Detalle de Pedido -->
          <div v-if="openDetails[order.id]" class="px-6 pb-6">
            <div v-if="orderDetails[order.id]?.error" class="py-6 text-center text-red-500">{{ orderDetails[order.id].message }}</div>
            <div v-else>
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <!-- Skeleton mientras carga -->
                <div v-if="loadingDetails[order.id]">
                  <div class="bg-gray-200 flex w-full">
                    <div class="w-1/2 px-4 py-2 text-xl font-semibold">Descripción</div>
                    <div class="w-1/4 px-4 py-2 text-xl font-semibold text-center">Cant.</div>
                    <div class="w-1/4 px-4 py-2 text-xl font-semibold text-center">Precio</div>
                  </div>
                  <div>
                    <div v-for="i in 3" :key="i" class="flex items-center gap-4 border-b last:border-b-0 animate-pulse">
                      <div class="w-14 h-14 bg-gray-200 rounded ml-4" />
                      <div class="flex-1">
                        <div class="h-5 w-40 bg-gray-200 rounded mb-2" />
                        <div class="h-4 w-24 bg-gray-100 rounded" />
                      </div>
                      <div class="w-1/4 flex justify-center">
                        <div class="w-12 h-5 bg-gray-200 rounded" />
                      </div>
                      <div class="w-1/4 flex justify-center">
                        <div class="w-20 h-5 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Tabla real -->
                <table v-else class="min-w-full bg-white">
                  <thead>
                    <tr class="bg-gray-200">
                      <th class="text-left px-4 py-2 text-xl font-semibold">Descripción</th>
                      <th class="text-center px-4 py-2 text-xl font-semibold">Cant.</th>
                      <th class="text-center px-4 py-2 text-xl font-semibold">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in orderDetails[order.id].order.items" :key="item.id" class="border-b last:border-b-0">
                      <td class="flex items-center gap-4 px-4 py-3">
                        <img :src="item.image" :alt="item.name" class="w-14 h-14 rounded object-cover" />
                        <span 
                          class="font-bold text-lg text-gray-800 cursor-pointer hover:text-[#FF5000] transition-colors"
                          @click="goToProduct(item.productId)"
                        >
                          {{ item.name }}
                        </span>
                      </td>
                      <td class="text-center px-4 py-3 text-lg">{{ item.quantity }}</td>
                      <td class="text-center px-4 py-3 text-lg">{{ $formatPrice(item.price) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasOrders && hasMoreOrders" class="text-center mt-8">
        <button @click="loadMoreOrders" :disabled="isLoading"
          class="bg-[#FF5000] text-white px-6 py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50">
          {{ isLoading ? 'Cargando...' : 'Cargar más pedidos' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '~/composables/useOrders'
import orderService from '~/services/order-service'
import { useRouter } from 'vue-router'

const { $formatPrice } = useNuxtApp()
const router = useRouter()
const orders = ref([])

// Filtro de año y recientes
const years = ref([2025, 2024, 2023, 2022, 2021])
const selectedFilter = ref('last_30_days')

// Estado de los accordions abiertos y detalles cargados
const openDetails = ref({}) // { [orderId]: true/false }
const orderDetails = ref({}) // { [orderId]: detalle }
const loadingDetails = ref({}) // { [orderId]: true/false }

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
  try {
    const result = await getCustomerOrders({ filter: selectedFilter.value })
    orders.value = result.data.data
    if (!result.success) {
      console.error('Error al cargar pedidos:', result.message)
    }
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
  }
}

/**
 * Toggle y cargar detalle de pedido (accordion)
 */
async function toggleOrderDetails(orderId) {
  openDetails.value[orderId] = !openDetails.value[orderId]
  if (openDetails.value[orderId] && !orderDetails.value[orderId]) {
    loadingDetails.value[orderId] = true
    try {
      const result = await orderService.getOrderDetails(orderId)
      if (result.success) {
        orderDetails.value[orderId] = result.data.data
      } else {
        orderDetails.value[orderId] = { error: true, message: result.message }
      }
    } catch (e) {
      orderDetails.value[orderId] = { error: true, message: 'Error inesperado al cargar el detalle' }
    }
    loadingDetails.value[orderId] = false
  }
}

/**
 * Cargar más pedidos (paginación)
 */
async function loadMoreOrders() {
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
    pending: 'Pendiente pago',
    confirmed: 'Confirmado',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return statusTexts[status] || 'Desconocido'
}

/**
 * Navegar a la página del producto
 */
function goToProduct(productId) {
  console.log('Navegando a producto:', productId)
  if (productId) {
    router.push(`/product/${productId}`)
  }
}
</script>