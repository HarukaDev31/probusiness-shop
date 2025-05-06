<template>
  <ClientOnly>
    <Transition name="fade" mode="out-in">
      <Loader v-if="pending" />
      <div v-else>
        <Hero />
        <CategorySection v-for="category in categories" :key="category.id" :title="category.name"
          :slug="category.slug" :products="getProductsByCategory(category.id).slice(0, 4)" />
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const { categories } = storeToRefs(categoryStore);
const { products } = storeToRefs(productStore);

// Limit to a few featured categories for homepage


const getProductsByCategory = (categoryId) => {
  return products.value.filter(product => product.categoryId === categoryId);
};

const loadingStore = useLoadingStore();

const { data, pending, error } = await useAsyncData(
  'init',
  async () => {
    await Promise.all([
      // Ejecuta tus stores/métodos asíncronos aquí
      categoryStore.fetchCategories(),
      productStore.fetchProducts()
    ]);
  }
)
onMounted(async () => {

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