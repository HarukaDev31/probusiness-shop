import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
import { categoryService } from '@/services/category-service';
export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);

  async function fetchCategories(initialData = null) {
    // Intentar leer de sessionStorage
    const cached = sessionStorage.getItem('categories');
    if (cached) {
      try {
        categories.value = JSON.parse(cached);
        return categories.value;
      } catch (e) {
        // Si hay error, limpiar y continuar
        sessionStorage.removeItem('categories');
      }
    }
    // Si no hay en sessionStorage, llamar al servicio
    const data = await categoryService.getCategories();
    categories.value = data.map(category => ({
      ...category,
      slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
      meta: {
        total: category.meta?.total || 0,
        currentPage: category.meta?.current_page || 1,
        perPage: category.meta?.per_page || 10
      }
    }));
    // Guardar en sessionStorage
    sessionStorage.setItem('categories', JSON.stringify(categories.value));
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