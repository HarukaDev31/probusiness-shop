<template>
  <div class="relative">
    <!-- Icono del carrito -->
    <div class="relative flex items-center text-gray-700 hover:text-primary cursor-pointer" @click="togglePreviewCart">
      <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.2857 25.0006C11.9169 25.0006 12.4285 24.4889 12.4285 23.8577C12.4285 23.2265 11.9169 22.7148 11.2857 22.7148C10.6545 22.7148 10.1428 23.2265 10.1428 23.8577C10.1428 24.4889 10.6545 25.0006 11.2857 25.0006Z"
          stroke="#272A30" stroke-width="2.90909" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M22.2857 25.0006C22.9169 25.0006 23.4285 24.4889 23.4285 23.8577C23.4285 23.2265 22.9169 22.7148 22.2857 22.7148C21.6545 22.7148 21.1428 23.2265 21.1428 23.8577C21.1428 24.4889 21.6545 25.0006 22.2857 25.0006Z"
          stroke="#272A30" stroke-width="2.90909" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M1.5 1H6.07143L9.13429 16.3029C9.23879 16.829 9.52504 17.3017 9.94291 17.6381C10.3608 17.9744 10.8837 18.1531 11.42 18.1429H22.5286C23.0649 18.1531 23.5878 17.9744 24.0057 17.6381C24.4235 17.3017 24.7098 16.829 24.8143 16.3029L26.6429 6.71429H7.21429"
          stroke="#272A30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <span v-if="cartItemCount > 0"
        class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ cartItemCount }}
      </span>
    </div>

    <!-- Panel lateral del carrito -->
    <transition name="slide">
      <div v-if="previewCart"
        class="fixed top-0 right-0 h-full w-[550px] min-w-[20px] max-w-full bg-white shadow-2xl z-50 flex flex-col"
        style="transition: right 0.2s;">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <span class="font-bold text-lg">Tu carrito</span>
          <button @click="previewCart = false" class="text-gray-500 hover:text-red-500">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        <!-- Contenido del carrito -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartItems.length > 0" class="space-y-3">
            <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
          </div>
          <div v-else class="py-6 text-center text-gray-500">
            El carrito está vacío
          </div>
        </div>
        <!-- Footer del carrito -->
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between mb-4">
            <span class="font-semibold">Total:</span>
            <span class="font-bold text-lg">{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              class="block w-1/2 py-3 px-2 text-center text-gray-400 rounded-full border-2 hover:underline border-gray-300"
              @click="previewCart = false">
              Agregar más productos
            </button>
            <NuxtLink to="/cart" class="btn px-2 w-1/2 py-3 text-lg rounded-full text-center border-2"
              @click="previewCart = false">
              Ir al carrito
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay para cerrar el carrito al hacer clic fuera -->
    <div v-if="previewCart" class="fixed inset-0 z-40" @click="previewCart = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { cartItemCount } = storeToRefs(cartStore);
const previewCart = ref(false);

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);

function togglePreviewCart() {
  previewCart.value = !previewCart.value;
}

function formatPrice(price) {
  return `S/${price.toFixed(2)}`;
}

// Cerrar el carrito cuando se presiona ESC
onMounted(() => {
  window.addEventListener('keydown', handleEsc);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc);
});
function handleEsc(e) {
  if (e.key === 'Escape' && previewCart.value) {
    previewCart.value = false;
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: right 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  right: -400px;
  position: fixed;
}
</style>