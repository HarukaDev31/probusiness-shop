<template>
  <NuxtLink to="/cart" class="relative flex items-center text-gray-700 hover:text-primary">
    <Icon name="lucide:shopping-cart" class="w-6 h-6" />
    <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {{ cartItemCount }}
    </span>
  </NuxtLink>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { cartItemCount } = storeToRefs(cartStore);
</script>