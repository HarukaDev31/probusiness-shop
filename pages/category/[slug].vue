  <template>
    <div>
      <!-- Banner de la categoría -->
      <div v-if="category && !loading" class="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="relative container-custom py-16 md:py-24">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <!-- Contenido del banner -->
            <div class="space-y-4">
              <nav class="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                <NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink>
                <Icon name="heroicons:chevron-right" class="w-4 h-4" />
                <span class="text-white">{{ category.name }}</span>
              </nav>
              <h1 class="text-4xl md:text-5xl font-bold leading-tight">{{ category.name }}</h1>
              <p v-if="category.description" class="text-lg text-gray-200 leading-relaxed">
                {{ category.description }}
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-300">
                <span class="flex items-center gap-2">
                  <Icon name="heroicons:cube" class="w-4 h-4" />
                  {{ products.length }} productos
                </span>
                <span v-if="category.meta?.total" class="flex items-center gap-2">
                  <Icon name="heroicons:tag" class="w-4 h-4" />
                  {{ category.meta.total }} disponibles
                </span>
              </div>
            </div>
            
            <!-- Imagen de la categoría -->
            <div class="relative">
              <div v-if="category.image_url" class="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <NuxtImg 
                  :src="category.image_url" 
                  :alt="category.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div v-else class="aspect-video rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl">
                <div class="text-center">
                  <Icon name="heroicons:cube" class="w-16 h-16 mx-auto mb-4 text-white/80" />
                  <p class="text-white/80 font-medium">{{ category.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="container-custom py-8">
        <div v-if="loading" class="flex justify-center mb-8 flex-col items-start w-full">
          <h1 class="text-3xl font-bold mb-8">{{ category?.name }}</h1>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            <ProductCardSkeleton v-for="i in 12" :key="i" />
          </div>
        </div>

        <template v-else-if="category">
          <!-- Controles de vista -->
          <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-bold text-gray-800">Productos</h2>
              <span class="text-gray-500">({{ products.length }})</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
                  class="p-2 rounded-md transition-all duration-200"
                  title="Vista de cuadrícula"
                >
                  <Icon name="lucide:grid-3x3" class="w-4 h-4" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
                  class="p-2 rounded-md transition-all duration-200"
                  title="Vista de lista"
                >
                  <Icon name="lucide:list" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Vista GRID -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard v-for="product in products.filter((item, index) =>
              index <= 50
            )" :key="product.id" :product="product" />
            <ProductCardSkeleton v-if="loadingMore" v-for="i in 4" :key="i" />
            <ProductCard v-else v-for="product in products.filter((item, index) =>
              index > 50
            )" :key="product.id" :product="product" />
          </div>
          
          <!-- Vista LISTA -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4">
              <img :src="product.main_image_url" :alt="product.nombre" class="w-20 h-20 object-cover rounded-lg" />
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1">{{ product.nombre.slice(0, 30) + '...' }}</h3>
                <div class="flex items-center gap-4">
                  <span class="text-lg font-bold text-primary">{{ $formatPrice(product.price) }}</span>
                  <span class="text-sm text-gray-500">MOQ: {{ getMinimumOrderQuantity(product) || 1 }}</span>
                </div>
              </div>
              <WishlistButton :product="product" />
            </div>
            <ProductCardSkeleton v-if="loadingMore" v-for="i in 4" :key="i" />
          </div>

          <div v-if="products.length === 0" class="text-center py-12">
            <p class="text-lg text-gray-500">No hay productos disponibles en esta categoría.</p>
          </div>
        </template>

        <div v-else class="text-center py-12">
          <p class="text-lg text-gray-500">Categoría no encontrada.</p>
          <NuxtLink to="/" class="mt-4 btn inline-block">Volver al inicio</NuxtLink>
        </div>
        
        <div v-if="total >= 50 && products.length < total" class="flex justify-center mt-6">
          <button @click="loadMore" class="btn py-3">Ver más</button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { storeToRefs } from 'pinia';
  import { useCategoryStore } from '~/stores/category';
  import { useProductStore } from '~/stores/product';

  const { $formatPrice } = useNuxtApp();
  function getMinimumOrderQuantity(product) {
  try {
    const prices = JSON.parse(product.value.prices_range || '[]');
    if (!prices.length) return 1;
    let minQty = Infinity;
    for (const price of prices) {
      const quantityRange = price.quantity.trim();
      // Caso 1: Rango "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 2: Mínimo ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)/);
      if (minMatch) {
        const start = parseInt(minMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 3: Cantidad fija "100 conjuntos"
      const fixedMatch = quantityRange.match(/^(\d+)/);
      if (fixedMatch) {
        const start = parseInt(fixedMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
    }
    return isFinite(minQty) ? minQty : 1;
  } catch (error) {
    console.error('Error calculating minimum order quantity:', error);
    return 1;
  }
}

  const route = useRoute();
  const slug = route.params.slug;

  const categoryStore = useCategoryStore();
  const productStore = useProductStore();

  const { categories } = storeToRefs(categoryStore);
  const { products } = storeToRefs(productStore);
  const loading = ref(true);
  const loadingMore = ref(false);
  const viewMode = ref('grid');
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