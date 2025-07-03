import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
import { categoryService } from '@/services/category-service';
export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);

  async function fetchCategories(initialData = null) {
    const  data  = await categoryService.getCategories();
    categories.value = data.map(category => ({
      ...category,
      slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
      meta:null
    }));
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