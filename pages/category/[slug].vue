  <template>
    <div class="container-custom py-8">
      <div v-if="loading" class="flex justify-center mb-8 flex-col items-start w-full">
        <h1 class="text-3xl font-bold mb-8">{{ category?.name }}</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          <ProductCardSkeleton v-for="i in 12" :key="i" />
        </div>

      </div>

      <template v-else-if="category">
        <h1 class="text-3xl font-bold mb-8">{{ category?.name }}</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          <ProductCard v-for="product in products.filter((item, index) =>
            index <= 50
          )" :key="product.id" :product="product" />
          <ProductCardSkeleton v-if="loadingMore" v-for="i in 4" :key="i" />
          <ProductCard v-else v-for="product in products.filter((item, index) =>
            index > 50
          )" :key="product.id" :product="product" />
        </div>

        <div v-if="products.length === 0" class="text-center py-12">
          <p class="text-lg text-gray-500">No hay productos disponibles en esta categoría.</p>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-lg text-gray-500">Categoría no encontrada.</p>
        <NuxtLink to="/" class="mt-4 btn inline-block">Volver al inicio</NuxtLink>
      </div>
      <div v-if="total >= 50
        && products.length < total" class="flex justify-center mt-6">
        <button @click="loadMore" class="btn py-3">Ver más</button>
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
  const loadingMore = ref(false);
  const category = computed(() => {
    return categories.value.find(c => c.slug === slug);
  });
  const loadMore = async () => {
    loadingMore.value = true;
    currentPage.value++;
    await productStore.fetchProductsByCategory(slug, currentPage.value);
    loadingMore.value = false;
  };

  const currentPage = ref(1);
  const total = computed(() => {
    return productStore.totalProducts;
  });

  onMounted(async () => {
    await Promise.all([
      productStore.fetchProductsByCategory(slug, currentPage.value)
    ]);
    loading.value = false;
  });
  onBeforeRouteUpdate(async (to) => {
    console.log('onBeforeRouteUpdate');
    productStore.products = [];
    loading.value = true;
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