<template>
  <button 
    @click="handleWishlistClick"
    :class="[
      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
      isInWishlist 
        ? 'bg-red-500 text-white hover:bg-red-600' 
        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
    ]"
    :title="isInWishlist ? 'Remover de lista de deseos' : 'Agregar a lista de deseos'"
  >
    <Icon 
      :name="isInWishlist ? 'heroicons:heart-solid' : 'heroicons:heart'" 
      class="w-10 h-10" 
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '~/stores/wishlist'
import { useUserStore } from '~/stores/user'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const wishlistStore = useWishlistStore()
const userStore = useUserStore()

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.product.id)
})

const handleWishlistClick = async () => {
  // Verificar si el usuario está autenticado
  if (!userStore.token) {
    // Redirigir al login
    navigateTo('/login')
    return
  }

  try {
    const success = await wishlistStore.toggleWishlist(props.product)
    if (success) {
      // Mostrar notificación
      const message = isInWishlist.value 
        ? 'Removido de lista de deseos' 
        : 'Agregado a lista de deseos'
      
      // Aquí podrías usar un sistema de notificaciones
      console.log(message)
    }
  } catch (error) {
    console.error('Error al manejar lista de deseos:', error)
  }
}
</script> 