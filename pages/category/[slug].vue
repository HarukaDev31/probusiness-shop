<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="category">
      <h1 class="text-3xl font-bold mb-8">{{ category.name }}</h1>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in categoryProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>

      <div v-if="categoryProducts.length === 0" class="text-center py-12">
        <p class="text-lg text-gray-500">No hay productos disponibles en esta categoría.</p>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-lg text-gray-500">Categoría no encontrada.</p>
      <NuxtLink to="/" class="mt-4 btn inline-block">Volver al inicio</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';

const route = useRoute();
const slug = route.params.slug;

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const { categories } = storeToRefs(categoryStore);
const { products } = storeToRefs(productStore);

const loading = ref(true);

// Get the current category
const category = computed(() => {
  return categories.value.find(c => c.slug === slug);
});

// Get products for this category
const categoryProducts = computed(() => {
  if (!category.value) return [];
  return products.value.filter(product => product.categoryId === category.value.id);
});

// Ensure data is loaded
onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    productStore.fetchProducts()
  ]);
  loading.value = false;
});

// Update when route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug && newSlug !== slug) {
    loading.value = true;
    await Promise.all([
      categoryStore.fetchCategories(),
      productStore.fetchProducts()
    ]);
    loading.value = false;
  }
});
</script>