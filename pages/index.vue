<template>
  <ClientOnly>
    <Transition name="fade" mode="out-in">

      <div>
        <Hero />
        <CategorySection v-for="category in categories" :key="category.id" :title="category.name" :slug="category.slug"
          :products="getProductsByCategory(category.id)" :is-loading="isLoadingProducts" />
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';

const categoryStore = useCategoryStore();
const productStore = useProductStore();
const { categories } = storeToRefs(categoryStore);
const { products } = storeToRefs(productStore);
const isLoadingProducts = ref(true);
const getProductsByCategory = (categoryId) => {
  return products.value.filter(product => product.category_id === categoryId);
};
onMounted(async () => {
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