<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-2">Resultados de búsqueda
    </h1>
    <p class="text-gray-600 mb-8" v-if="searchQuery">Mostrando resultados para: "{{ searchQuery }}"</p>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        <ProductCardSkeleton v-for="i in 12" :key="i" />
      </div>
    </div>

    <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in searchResults.filter((item, index) => index <= 50)" 
        :key="product.id" 
        :product="product" 
      />
      <ProductCardSkeleton v-if="loadingMore" v-for="i in 4" :key="i" />
      <ProductCard 
        v-else 
        v-for="product in searchResults.filter((item, index) => index > 50)" 
        :key="product.id" 
        :product="product"
      />
      <button 
        v-if="total > 50"
        @click="loadMore"
        class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 btn py-3 mt-6 mx-auto"
      >
        Ver más
      </button>
    </div>
    
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <Icon name="heroicons:magnifying-glass" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 class="text-2xl font-medium text-gray-500 mb-4">No se encontraron resultados</h2>
      <p class="text-gray-500 mb-6">Intenta con otra búsqueda o explora nuestras categorías</p>
      <NuxtLink to="/" class="btn px-6 py-3">Volver al inicio</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '~/stores/product';

const route = useRoute();
const searchQuery = computed(() => route.query.q || '');

const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const loading = ref(true);
const loadingMore = ref(false);
const searchResults = computed(() => {
  return productStore.products;
});
const total = computed(() => {
  return productStore.totalProducts;
});
const currentPage = ref(1);
// Ensure data is loaded
onMounted(async () => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  await productStore.searchProducts(query, currentPage.value);
  loading.value = false;
});
const loadMore = async () => {
  currentPage.value++;
  loadMore.value = true;
  await productStore.searchProducts(searchQuery.value, currentPage.value);
  loadMore.value = false;
};
// Update when search query changes
watch(() => route.query.q, () => {
  loading.value = true;
  // Simulate search delay
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>