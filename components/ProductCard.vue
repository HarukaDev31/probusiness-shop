<template>
  <div class="product-card flex flex-col h-full">
    <div class="relative pb-[100%] overflow-hidden relative">
      <NuxtLink :to="`/product/${product.id}`">
        <NuxtImg  
          :src="getProductImage()" 
          :alt="product.nombre"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-contain p-1 md:p-4 hover:scale-105 transition-transform duration-300"
        />
      </NuxtLink>
      
      <!-- Wishlist button -->
      
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <!--badge from category-->
 
      <NuxtLink :to="`/product/${product.id}`">
        <h3 class="font-medium mb-2 line-clamp-2 hover:text-[#FF5000] leading-1 transition-colors h-12 flex items-start">{{ truncateName(product.nombre) }}</h3>
      </NuxtLink>
      <div class="text-sm text-gray-500 mb-2">Orden mínima: {{ product.moq }}</div>
      <div class="text-2xl font-bold text-black mt-auto">{{ $formatPrice(product.precio) }}</div>
    </div>

    </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const { $formatPrice } = useNuxtApp();

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



const addToCart = () => {
  cartStore.addItem(props.product);
};

const truncateName = (name) => {
  if (!name) return '';
  return name.length > 50 ? name.substring(0, 50) + '...' : name;
};
</script>