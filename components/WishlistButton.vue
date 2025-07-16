<template>
  <div class="">
    <!-- Partículas de efecto -->
    <div v-if="showParticles" class="absolute inset-0 pointer-events-none">
      <div 
        v-for="i in 8" 
        :key="i"
        class="particle absolute w-1 h-1 bg-red-400 rounded-full"
        :style="{
          left: '50%',
          top: '50%',
          animationDelay: `${i * 0.08}s`,
          transform: 'translate(-50%, -50%)',
          '--angle': `${i * 45}deg`
        }"
      ></div>
      <!-- Confeti adicional -->
      <div 
        v-for="i in 4" 
        :key="`confeti-${i}`"
        class="confeti absolute w-1 h-1 bg-pink-400 rounded-full"
        :style="{
          left: '50%',
          top: '50%',
          animationDelay: `${i * 0.12}s`,
          transform: 'translate(-50%, -50%)',
          '--angle': `${i * 90 + 22.5}deg`
        }"
      ></div>
    </div>

    <!-- Botón principal -->
    <button 
      @click="handleWishlistClick"
      :class="[
        'wishlist-button w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out relative overflow-hidden group',
        isInWishlist 
          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-110' 
          : 'bg-white text-gray-500 hover:text-red-500 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:scale-105 shadow-md hover:shadow-lg'
      ]"
      :title="isInWishlist ? 'Remover de lista de deseos' : 'Agregar a lista de deseos'"
    >
      <!-- Efecto de brillo en hover -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine"></div>
      
      <!-- Icono con animación -->
      <Icon 
        :name="isInWishlist ? 'heroicons:heart-solid' : 'heroicons:heart'" 
        :class="[
          'w-6 h-6 transition-all duration-300',
          isInWishlist 
            ? 'animate-heart-beat' 
            : 'group-hover:scale-110 group-hover:animate-pulse'
        ]"
      />
      
      <!-- Efecto de ondas al hacer clic -->
      <div 
        v-if="showRipple" 
        class="ripple absolute w-full h-full rounded-full bg-red-300 opacity-50 animate-ripple"
      ></div>
    </button>


  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
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

// Estados para animaciones
const showParticles = ref(false)
const showRipple = ref(false)

const isInWishlist = computed(() => {
  return props.product.is_in_wishlist
})

const handleWishlistClick = async () => {
  // Verificar si el usuario está autenticado
  if (!userStore.token) {
    // Redirigir al login
    navigateTo('/login')
    return
  }

  try {
    // Mostrar efecto de ondas
    showRipple.value = true
    setTimeout(() => {
      showRipple.value = false
    }, 600)

    const success = await wishlistStore.toggleWishlist(props.product)
    if (success) {
      props.product.is_in_wishlist = !props.product.is_in_wishlist
      // Mostrar partículas si se agregó a favoritos
      if (!isInWishlist.value) {
        showParticles.value = true
        setTimeout(() => {
          showParticles.value = false
        }, 1000)
        
        // Efecto de vibración sutil
        const button = document.querySelector('.wishlist-button')
        if (button) {
          button.style.animation = 'vibrate 0.3s ease-in-out'
          setTimeout(() => {
            button.style.animation = ''
          }, 300)
        }
      }
      
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

<style scoped>
/* Animación de partículas */
.particle {
  animation: particle-explosion 1s ease-out forwards;
}

.confeti {
  animation: confeti-explosion 1.2s ease-out forwards;
}

@keyframes particle-explosion {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1) translate(
      calc(cos(var(--angle, 0deg)) * 30px),
      calc(sin(var(--angle, 0deg)) * 30px)
    );
  }
}

@keyframes confeti-explosion {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1) translate(
      calc(cos(var(--angle, 0deg)) * 35px),
      calc(sin(var(--angle, 0deg)) * 35px)
    ) rotate(360deg);
  }
}

/* Animación de ondas */
.animate-ripple {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Animación de brillo */
.animate-shine {
  animation: shine 0.6s ease-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Animación de corazón latiendo */
.animate-heart-beat {
  animation: heart-beat 1.5s ease-in-out infinite;
}

@keyframes heart-beat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Animación de fade in para tooltip */
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translate(-50%, 5px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Efectos hover adicionales */
.group:hover .animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto de profundidad */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradiente mejorado para el estado activo */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-red-500 {
  --tw-gradient-from: #ef4444;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(239, 68, 68, 0));
}

.to-red-600 {
  --tw-gradient-to: #dc2626;
}

/* Animación de vibración */
@keyframes vibrate {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* Efecto de resplandor para el estado activo */
.wishlist-button.bg-gradient-to-br {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.wishlist-button.bg-gradient-to-br:hover {
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}
</style> 