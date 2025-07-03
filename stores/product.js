import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInitialData } from '@/composables/useInitialData';
import { productService } from '../services/product-service';
export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const relatedProducts = ref([]);
  const supplierProducts = ref([]);
  const totalProducts = ref(0);
  async function fetchProducts() {
    const data = await productService.getProducts();
    products.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));

  }
  async function fetchProductsByCategory(categorySlug,currentPage = 1) {
    const {data,total} = await productService.getProductsByCategory(categorySlug,currentPage);
    totalProducts.value = total;
    products.value.push(...data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    })));

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
  async function fetchProductBySupplierId(supplierId) {
    const data = await productService.getProductBySupplierId(supplierId);
    supplierProducts.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));
    console.log('supplierProducts', supplierProducts.value);

  }
  async function searchProducts(searchTerm,currentPage = 1) {
    const {data,total} = await productService.searchProducts(searchTerm,currentPage);
    totalProducts.value = total;
    products.value.push(...data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    })));
  }

  return {
    products,
    relatedProducts,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    fetchRelatedProducts,
    fetchProductBySupplierId,
    searchProducts,
    totalProducts,
    supplierProducts
  };
});