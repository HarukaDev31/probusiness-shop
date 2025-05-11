<template>
  <div class="relative">
    <!-- Icono del carrito -->
    <div class="relative flex items-center text-gray-700 hover:text-primary cursor-pointer" @click="togglePreviewCart">
      <Icon name="lucide:shopping-cart" class="w-6 h-6" />
      <span v-if="cartItemCount > 0"
        class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ cartItemCount }}
      </span>
    </div>

    <!-- Panel desplegable del carrito -->
    <div v-show="previewCart"
      class="  bg-white rounded-lg shadow-lg z-50 overflow-hidden"
      style="position: fixed; top: 0; right: 0; width: 350px; max-height: 80vh; overflow-y:auto;min-width: 500px;">
      <!-- Contenido del carrito -->
      <div class="max-h-80 overflow-y-auto p-4">
        <div v-if="cartItems.length > 0" class="space-y-3">
          <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
        </div>
        <div v-else class="py-6 text-center text-gray-500">
          El carrito está vacío
        </div>
      </div>

      <!-- Footer del carrito -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
    
        
        <div class="flex items-center justify-between gap-2">
          <button class="block  w-1/2 py-3 px-2 text-center text-gray-400 rounded-full border-2  hover:underline border-gray-300"
            @click="previewCart = false">
            Agregar más productos
          </button>
          <NuxtLink to="/cart"
            class="btn px-2 w-1/2 py-3 text-lg  rounded-full text-center  border-2 "
            @click="previewCart = false">
            Ir al carrito

          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar el carrito al hacer clic fuera -->
    <div v-if="previewCart" class="fixed inset-0 z-40" @click="previewCart = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { cartItemCount } = storeToRefs(cartStore);
const previewCart = ref(false);

const cartItems = computed(() => {
  return cartStore.cartItems;
});

const cartTotal = computed(() => {
  return cartStore.cartTotal;
});

function togglePreviewCart() {
  previewCart.value = !previewCart.value;
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Cerrar el carrito cuando se presiona ESC
if (process.client) {
  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewCart.value) {
        previewCart.value = false;
      }
    });
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewCart.value) {
        previewCart.value = false;
      }
    });
  });
}
</script>