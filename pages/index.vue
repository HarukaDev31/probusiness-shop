<template>
  <ClientOnly>
    <Transition name="fade" mode="out-in">

      <div>
        <Hero />
        <!-- Destacadas al inicio -->
        <CategoryDestacadas :categories="destacadasGroups[0]" />
        <template v-for="(category, idx) in categories" :key="category.id">
          <CategorySection
            :title="category.name"
            :slug="category.slug"
            :products="getProductsByCategory(category.id)"
            :is-loading="isLoadingProducts"
            :slider-id="`slider-${category.id}`"
          />
          <!-- Destacadas después de cada 3 categorías -->
          <CategoryDestacadas
            v-if="(idx + 1) % 3 === 0 && destacadasGroups[(idx + 1) / 3]"
            :categories="destacadasGroups[(idx + 1) / 3]"
          />
        </template> 
        <TestimoniosSection />
        <ImportadoresSection />
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';
import CategoryDestacadas from '~/components/CategoryDestacadas.vue';
import TestimoniosSection from '~/components/TestimoniosSection.vue';
import ImportadoresSection from '~/components/ImportadoresSection.vue';

const categoryStore = useCategoryStore();
const productStore = useProductStore();
const { categories } = storeToRefs(categoryStore);
const { products } = storeToRefs(productStore);
const isLoadingProducts = ref(true);
const getProductsByCategory = (categoryId) => {
  return products.value.filter(product => product.category_id === categoryId);
};

// Agrupa las categorías en chunks de 3 para destacadas sin repetir
const destacadasGroups = computed(() => {
  if (!categories.value || categories.value.length === 0) return [];
  const shuffled = [...categories.value].sort(() => Math.random() - 0.5);
  const groups = [];
  for (let i = 0; i < shuffled.length; i += 3) {
    groups.push(shuffled.slice(i, i + 3));
  }
  return groups;
});

onMounted(async () => {
  await categoryStore.fetchCategories();
  await productStore.fetchProducts();
  isLoadingProducts.value = false;
});
onUnmounted(async (to) => {
  productStore.products = [];
  isLoadingProducts.value = true;
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>