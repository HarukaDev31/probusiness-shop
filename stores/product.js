import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
import { productService } from '../services/product-service';
export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const relatedProducts = ref([]);
  async function fetchProducts() {
    console.log('fetchProducts');
    const data = await productService.getProducts();
    products.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));

  }
  async function fetchProductsByCategory(categorySlug) {
    const data = await productService.getProductsByCategory(categorySlug);
    products.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));

  }
  async function fetchProductById(id) {
    const data = await productService.getProductById(id);
    products.value = [data]
  }
  async function fetchRelatedProducts(category) {
    const data = await productService.getRelatedProducts(category);
    relatedProducts.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));
  }

  return {
    products,
    relatedProducts,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    fetchRelatedProducts
  };
});