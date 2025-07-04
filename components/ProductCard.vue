<template>
  <NuxtLink class="product-card flex flex-col h-full"
  :to="`/product/${product.id}`"
  >
    <div class="relative pb-[100%] overflow-hidden relative">
      <NuxtImg  
        :src="product.main_image_url" 
        :alt="product.nombre"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
      />
      <!-- Eliminado el span de la categoría en la esquina superior derecha -->
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <!--badge from category-->
 
      <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ product.nombre }}</h3>
      <div class="text-sm text-gray-500 mb-2">Orden mínima: {{ product.moq }}</div>
      <div class="text-2xl font-bold text-black mt-auto ">S/{{ product.precio }}</div>
      <!-- <button 
        @click="addToCart"
        class="mt-3 btn w-full"
      >
        Añadir al carrito
      </button> -->
    </div>
  </NuxtLink>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addItem(props.product);
};
</script>