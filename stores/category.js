import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);

  async function fetchCategories(initialData = null) {
    if (initialData) {
      categories.value = initialData;
    }
    else {
      categories.value = useInitialData().categories;
    }
    
    return categories.value;
  }

  function getCategoryBySlug(slug) {
    return categories.value.find(category => category.slug === slug);
  }

  return {
    categories,
    fetchCategories,
    getCategoryBySlug
  };
});