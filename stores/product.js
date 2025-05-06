import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);

  async function fetchProducts(initialData = null) {
    if (initialData) {
      products.value = initialData;
    }else{
      products.value = useInitialData().products;
    }
    return products.value;
  }

  function getProductById(id) {
    return products.value.find(product => product.id === id);
  }

  function getProductsByCategory(categoryId) {
    return products.value.filter(product => product.categoryId === categoryId);
  }

  return {
    products,
    fetchProducts,
    getProductById,
    getProductsByCategory
  };
});