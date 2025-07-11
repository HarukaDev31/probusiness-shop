<template>
  <div class="min-h-screen bg-[#f5f8fb]">
    <div class="container-custom py-8">
      <!-- Header -->
      <div class="mb-8 flex flex-row items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-gray-800">Lista de deseos</h1>
          <Icon name="heroicons:heart" class="w-8 h-8 " />
        </div>

        <!-- Controles de vista -->
        <div v-if="wishlistItems.length > 0" class="flex items-center gap-4">
          <span class="text-gray-500 text-sm">Ver</span>
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              class="p-2 rounded-md transition-all duration-200" title="Vista de cuadrícula">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                <rect y="4.9082" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                <rect x="4.90918" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                <rect x="4.90918" y="4.9082" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
              </svg>
            </button>
            <button @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              class="p-2 rounded-md transition-all duration-200" title="Vista de lista">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                <rect width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                <rect y="3" width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                <rect y="6" width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                <rect x="3" y="3" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                <rect x="3" y="6" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5000]"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="wishlistItems.length === 0" class="text-center py-12">
        <div class="mb-6">
          <Icon name="heroicons:heart" class="w-24 h-24 text-gray-300 mx-auto" />
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Tu lista de deseos está vacía</h3>
        <p class="text-gray-500 mb-6">Explora nuestros productos y agrega los que más te gusten a tu lista de deseos</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-[#FF5000] text-white font-semibold rounded-lg hover:bg-[#e04a00] transition-colors"
        >
          <Icon name="heroicons:shopping-bag" class="w-5 h-5 mr-2" />
          Explorar productos
        </NuxtLink>
      </div>

      <!-- Wishlist items - Vista GRID -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div 
          v-for="item in wishlistItems" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <!-- Product image -->
          <div class="relative">
            <NuxtLink :to="`/product/${item?.product?.id}`">
              <img 
                :src="item.product?.main_image_url || '/images/logo.png'" 
                :alt="item.product?.nombre"
                class="w-full h-48 object-cover rounded-t-lg"
              />
            </NuxtLink>
            
            <!-- Remove from wishlist button -->
            <button 
              @click="removeFromWishlist(item.id)"
              class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
              title="Remover de lista de deseos"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <!-- Product info -->
          <div class="p-4">
            <NuxtLink :to="`/product/${item?.product?.id}`">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-[#FF5000] transition-colors">
                {{ item.product?.nombre }}
              </h3>
            </NuxtLink>
            <div class="text-sm text-gray-500 mb-3">
              Orden mínima: {{ getMinimumOrderQuantity(item.product) || 1 }}
            </div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xl font-bold text-gray-800">{{ $formatPrice(getPrecioPuestoEnPeru(item?.product)) }}</span>
            </div>

            <!-- MOQ info -->
            
          </div>
        </div>
      </div>

      <!-- Wishlist items - Vista LISTA -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="item in wishlistItems" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4"
        >
          <!-- Product image -->
          <div class="relative">
            <NuxtLink :to="`/product/${item?.product?.id}`">
              <img 
                :src="item.product?.main_image_url || '/images/logo.png'" 
                :alt="item.product?.nombre"
                class="w-20 h-20 object-cover rounded-lg"
              />
            </NuxtLink>
          </div>

          <!-- Product info -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <NuxtLink :to="`/product/${item?.product?.id}`">
                  <h3 class="font-semibold text-gray-800 mb-2 hover:text-[#FF5000] transition-colors">
                    {{ item.product?.nombre }}
                  </h3>
                </NuxtLink>
                
                <div class="flex flex-col gap-1">
                  <span class="text-sm text-gray-500">Orden mínima: {{ getMinimumOrderQuantity(item?.product) || 1 }}</span>

                  <span class="text-xl font-bold text-gray-800">{{ $formatPrice(getPrecioPuestoEnPeru(item?.product)) }}</span>
                </div>
              </div>

              <!-- Remove from wishlist button -->
              <button 
                @click="removeFromWishlist(item.id)"
                class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Remover de lista de deseos"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { useWishlistStore } from '~/stores/wishlist'

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const { $formatPrice } = useNuxtApp();
const wishlistStore = useWishlistStore()

const wishlistItems = computed(() => wishlistStore.items)
const loading = computed(() => wishlistStore.loading)
const viewMode = ref('grid')
const getPrecioPuestoEnPeru = (product) => {
  if (!product) return 0;
  console.log(product);
  const precios = JSON.parse(product.prices_range || '[]');
  console.log(precios);
  if (!precios.length) return 0;
  const minPrice = precios[0].price;
  return minPrice;
};
// Función para obtener el MOQ (Minimum Order Quantity)
function getMinimumOrderQuantity(product) {
  if (!product) return 1;
  try {
    const prices = JSON.parse(product.prices_range || '[]');
    if (!prices.length) return 1;
    let minQty = Infinity;
    for (const price of prices) {
      const quantityRange = price.quantity.trim();
      // Caso 1: Rango "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 2: Mínimo ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)/);
      if (minMatch) {
        const start = parseInt(minMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 3: Cantidad fija "100 conjuntos"
      const fixedMatch = quantityRange.match(/^(\d+)/);
      if (fixedMatch) {
        const start = parseInt(fixedMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
    }
    return isFinite(minQty) ? minQty : 1;
  } catch (error) {
    console.error('Error calculating minimum order quantity:', error);
    return 1;
  }
}

// Cargar lista de deseos al montar el componente
onMounted(async () => {
  await wishlistStore.fetchWishlist()
})

// Función para remover de lista de deseos
const removeFromWishlist = async (productId) => {
  try {
    const success = await wishlistStore.removeFromWishlist(productId)
    if (success) {
      // Aquí podrías mostrar una notificación de éxito
      console.log('Producto removido de lista de deseos')
    }
  } catch (error) {
    console.error('Error al remover de lista de deseos:', error)
  }
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 