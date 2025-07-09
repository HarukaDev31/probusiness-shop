<template>
  <div class="min-h-screen bg-[#f5f8fb]">
    <div class="container-custom py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Mi Lista de Deseos</h1>
        <p class="text-gray-600">Guarda tus productos favoritos para comprarlos más tarde</p>
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

      <!-- Wishlist items -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in wishlistItems" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <!-- Product image -->
          <div class="relative">
            <NuxtLink :to="`/product/${item.id}`">
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
            <NuxtLink :to="`/product/${item.id}`">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-[#FF5000] transition-colors">
                {{ item.product?.nombre }}
              </h3>
            </NuxtLink>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-xl font-bold text-gray-800">{{ $formatPrice(item.price) }}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2">
              <button 
                @click="addToCart(item)"
                class="flex-1 bg-[#FF5000] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#e04a00] transition-colors"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear all button -->
      <div v-if="wishlistItems.length > 0" class="mt-8 text-center">
        <button 
          @click="clearWishlist"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpiar lista de deseos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})
const { $formatPrice } = useNuxtApp();
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const { items: wishlistItems, loading } = storeToRefs(wishlistStore)

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

// Función para agregar al carrito
const addToCart = (item) => {
  cartStore.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
    image: item.image
  })
  
  // Opcional: remover de lista de deseos después de agregar al carrito
  // removeFromWishlist(item.id)
}

// Función para limpiar toda la lista
const clearWishlist = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar toda tu lista de deseos?')) {
    try {
      const success = await wishlistStore.clearWishlist()
      if (success) {
        console.log('Lista de deseos limpiada')
      }
    } catch (error) {
      console.error('Error al limpiar lista de deseos:', error)
    }
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