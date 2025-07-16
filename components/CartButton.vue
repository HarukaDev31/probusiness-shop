<template>
  <div class="relative">
    <!-- Icono del carrito -->
    <NuxtLink to="/cart" class="relative flex items-center text-gray-700 hover:text-primary cursor-pointer">
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
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const cartItemCount = computed(() => cartStore.cartItemCount);
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
