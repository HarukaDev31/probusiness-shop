<template>
  <NuxtLink class="product-card flex flex-col h-full"
  :to="`/product/${product.id}`"
  >
    <div class="relative pb-[100%] overflow-hidden relative">
      <NuxtImg  
        :src="getProductImage()" 
        :alt="product.nombre"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
      />
      <div class="text-sm text-gray-500 mb-2 absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
        <span >{{ product.category_name }}</span>
      </div>
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <!--badge from category-->
 
      <h3 :class="getTitleClass()" class="font-semibold mb-2 line-clamp-2">{{ product.nombre }}</h3>
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

const getProductImage = () => {
  // Si hay media array y tiene elementos, usar la primera imagen
  if (props.product.media && Array.isArray(props.product.media) && props.product.media.length > 0) {
    const firstMedia = props.product.media[0];
    if (firstMedia.url) {
      return firstMedia.url;
    }
  }
  
  // Fallback a main_image_url
  return props.product.main_image_url || '/images/logo.png';
};

const getTitleClass = () => {
  const titleLength = props.product.nombre?.length || 0;
  
  if (titleLength > 80) {
    return 'text-sm'; // Muy largo
  } else if (titleLength > 50) {
    return 'text-base'; // Largo
  } else if (titleLength > 30) {
    return 'text-lg'; // Mediano
  } else {
    return 'text-xl'; // Corto
  }
};

const addToCart = () => {
  cartStore.addItem(props.product);
};
</script>