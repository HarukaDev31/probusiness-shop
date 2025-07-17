<template>
  <div class="min-h-screen bg-[#f5f8fb] flex flex-col">
    <!-- Vista Desktop -->
    <div class="hidden md:flex flex-1 flex-col md:flex-row gap-8 p-6 md:p-12 max-w-[1200px] mx-auto w-full">
      <!-- Columna productos -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-xl font-bold mb-2">Tus productos</h2>
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <p class="text-gray-500 mb-6">No hay artículos seleccionados.</p>
            <NuxtLink to="/" class="btn px-6 py-3">Continuar comprando</NuxtLink>
          </div>
          <template v-else>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4"
            v-if="selectedItems.length === 0"
            >
              <span>No hay artículos seleccionados.</span>
              <button class="text-blue-500 hover:underline" @click="selectAll">Seleccionar todos los productos</button>
            </div>
            <!--add any selected items-->
            <div v-if="selectedItems.length > 0">
              <div class="flex items-center gap -2 text-sm text-gray-500 mb-4">
                <button class="text-blue-500 hover:underline" @click="deselectAll">Anular selección de todos los productos</button>
              </div>
            </div>
            <div>
              <CartItem v-for="item in cartItems" :key="item.id" :item="item" :showCheckbox="true" />
            </div>
            <div class="flex justify-start mt-6">
              <button
                class="bg-[#FF5000] text-white font-semibold px-8 py-3 rounded"
                @click="goToCheckout"
              >
                Continuar
              </button>
            </div>
          </template>
        </div>
      </div>
      <!-- Columna resumen -->
      <div class="w-full md:w-[340px] flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 class="text-lg font-bold mb-6">Resumen del pedido</h3>
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-2xl font-bold text-gray-800">{{ $formatPrice(selectedTotal) }}</span>
          </div>
          <button
            @click="goToCheckout"
            :disabled="selectedItems.length === 0"
            class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
          >
            Continuar ({{ selectedItems.length }} productos)
          </button>
        </div>
        <div class="bg-white rounded-lg shadow-md p-8">
          <h4 class="text-lg font-bold mb-4">Datos importantes:</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 mt-1" />
              <div>
                <span class="font-semibold">Sobre el precio</span><br>
                <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:clock" class="w-6 h-6 mt-1" />
              <div>
                <span class="font-semibold">Tiempo de entrega</span><br>
                <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2 meses</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Vista Mobile -->
    <div class="md:hidden flex flex-col min-h-screen">
      <!-- Contenido principal -->
      <div class="flex-1 overflow-y-auto p-4" :class="mobileSummaryOpen ? 'pb-80' : 'pb-20'">
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 class="text-xl font-bold mb-4">Tus productos</h2>
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <p class="text-gray-500 mb-4">No hay artículos seleccionados.</p>
            <NuxtLink to="/" class="btn px-6 py-3">Continuar comprando</NuxtLink>
          </div>
          <template v-else>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4"
            v-if="selectedItems.length === 0"
            >
              <span>No hay artículos seleccionados.</span>
              <button class="text-blue-500 hover:underline" @click="selectAll">Seleccionar todos</button>
            </div>
            <div v-if="selectedItems.length > 0">
              <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <button class="text-blue-500 hover:underline" @click="deselectAll">Anular selección</button>
              </div>
            </div>
            <div>
              <CartItem v-for="item in cartItems" :key="item.id" :item="item" :showCheckbox="true" />
            </div>
          </template>
        </div>
      </div>

      <!-- Panel inferior fijo -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <!-- Header del panel -->
        <div class="p-4 border-b border-gray-100">
          <button @click="toggleMobileSummary" class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-black-600 text-lg">Resumen de pedido</span>
            </div>
            <Icon 
              name="heroicons:chevron-up" 
              class="w-5 h-5 text-gray-500 transition-transform duration-300 animate-bounce-gentle"
              :class="mobileSummaryOpen ? 'rotate-180' : 'rotate-0'"
            />
          </button>
        </div>
        
        <!-- Contenido colapsable -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="transform translate-y-full opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-full opacity-0"
        >
          <div v-if="mobileSummaryOpen" class="p-4 space-y-4">
          <!-- Precio en soles -->
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-xl font-bold text-gray-800">{{ $formatPrice(selectedTotal) }}</span>
          </div>
          
          <!-- Botón continuar -->
          <button
            @click="goToCheckout"
            :disabled="selectedItems.length === 0"
            class="w-full bg-[#FF5000] text-white font-semibold py-4 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
          >
            Continuar ({{ selectedItems.length }} productos)
          </button>
          
          <!-- Datos importantes -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-bold mb-3">Datos importantes:</h4>
            <ul class="space-y-3 text-xs">
              <li class="flex items-start gap-2">
                <Icon name="heroicons:currency-dollar" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-semibold">Sobre el precio</span><br>
                  <span class="text-gray-500">Es puesto en Perú, incluye todo.</span>
                </div>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="heroicons:clock" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-semibold">Tiempo de entrega</span><br>
                  <span class="text-gray-500">Se tiene que realizar la importación, la entrega es en 2 meses</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </div>
  <!-- Modal de alerta de monto mínimo -->
<div
  v-if="showMinAlert"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
>
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative text-center">
    <button
      class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
      @click="showMinAlert = false"
    >&times;</button>
    <div class="flex flex-col items-center mb-4">
      <div class="w-14 h-14 flex items-center justify-center rounded-full border-2 border-[#FF5000] mb-2">
        <span class="text-4xl text-[#FF5000]">!</span>
      </div>
      <div class="text-lg font-semibold mb-2">
        El monto mínimo de importación es de s/3000 para este pedido
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4"></div>
    <div class="flex flex-col gap-3 mb-2 text-left">
      <div>
        Tu pedido actual:
        <b>{{ $formatPrice(selectedTotal) }}</b>
      </div>
      <div>
        Importe pendiente:
        <b class="text-[#FF5000]">{{ $formatPrice(3000 - selectedTotal) }}</b>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4"></div>
    <div class="text-xs text-gray-500 mt-3">
      *Puedes aumentar unidades o agregar más productos
    </div>
  </div>
</div>
</template>



<script setup>
definePageMeta({
  middleware: ['cart-init']
})

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useCartStore } from '~/stores/cart';
import { useUserStore } from '~/stores/user'

const { $formatPrice } = useNuxtApp();

const router = useRouter(); 
const cartStore = useCartStore();
const userStore = useUserStore()
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.cartTotal)
const cartItemCount = computed(() => cartStore.cartItemCount)
const selectedItems = computed(() => cartStore.cartItems.filter(item => cartStore.selectedIds.includes(item.id)))
const selectedTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const showMinAlert = ref(false)
const mobileSummaryOpen = ref(false)

const selectAll = () => {
  cartStore.selectedIds = cartStore.cartItems.map(item => item.id)
}
const deselectAll = () => { 
  cartStore.selectedIds = []
}
const toggleMobileSummary = () => {
  mobileSummaryOpen.value = !mobileSummaryOpen.value
}

// Función para abrir el panel sin causar scroll
const openMobileSummary = async () => {
  if (!mobileSummaryOpen.value) {
    const currentScrollY = window.scrollY
    mobileSummaryOpen.value = true
    
    // Esperar a que el DOM se actualice y luego restaurar la posición de scroll
    await nextTick()
    window.scrollTo(0, currentScrollY)
  }
}

// Variables para detectar scroll
let lastScrollY = 0
let scrollTimeout = null

// Función para detectar scroll hacia arriba y abrir el panel
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Si está cerca del top, abrir el panel
  if (currentScrollY < 50) {
    openMobileSummary()
  }
  
  // Detectar scroll hacia arriba
  if (currentScrollY < lastScrollY && currentScrollY > 100) {
    // Limpiar timeout anterior
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    
    // Abrir panel después de un pequeño delay
    scrollTimeout = setTimeout(() => {
      openMobileSummary()
    }, 300)
  }
  
  lastScrollY = currentScrollY
}

// Agregar event listener para scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
async function goToCheckout() {
  cartStore.checkoutItems = selectedItems.value
  if (!userStore.token) {
    router.push('/register')
    return
  }
  router.push('/checkout')
}

onMounted(() => {
  cartStore.loadCartForUser();
});

</script>

<style scoped>
.text-primary {
  color: #FF5000;
}
.btn {
  background: #FF5000;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  transition: background 0.2s;
}
.btn:hover {
  background: #e04a00;
}

/* Animaciones para el resumen móvil */
.mobile-summary-enter-active,
.mobile-summary-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-summary-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.mobile-summary-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.mobile-summary-enter-to,
.mobile-summary-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Animación suave de bounce para la flecha */
@keyframes bounce-gentle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s infinite;
}
</style>