<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
    <p class="text-gray-600 mb-8" v-if="searchQuery">Mostrando resultados para: "{{ searchQuery }}"</p>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in searchResults" 
        :key="product.id" 
        :product="product" 
      />
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

const searchResults = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query) || 
    (product.description && product.description.toLowerCase().includes(query))
  );
});

// Ensure data is loaded
onMounted(async () => {
  await productStore.fetchProducts();
  loading.value = false;
});

// Update when search query changes
watch(() => route.query.q, () => {
  loading.value = true;
  // Simulate search delay
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>