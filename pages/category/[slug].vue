  <template>
    <div>
      <!-- Hero de la categoría -->
      <div v-if="category && !loading" class="container-custom py-8">
        <div class="bg-white rounded-lg shadow-sm border  md:h-[280px]h-[340px]">
          <div class="flex flex-row md:flex-row items-center gap-6 justify-between">
            <div class="w-full md:w-2/3 text-center md:text-center">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-800">{{ category.name }}</h1>
            </div>
            <!-- Imagen de la categoría -->
            <div class="w-full flex flex-row  items-end justify-end">
              <!-- Primera imagen (visible en mobile y desktop) -->
              <div v-if="category.img_url" class="h-[280px] rounded-lg overflow-hidden">
                <NuxtImg :src="category.img_url" :alt="category.name" class="h-full" loading="lazy" />
              </div>
              <div v-else
                class="h-[280px] rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div class="text-center">
                  <Icon name="heroicons:cube" class="w-16 h-16 mx-auto mb-4 text-white/80" />
                  <p class="text-white/80 font-medium">{{ category.name }}</p>
                </div>
              </div>

              <!-- Segunda imagen (solo visible en desktop) -->
              <div v-if="category.img_url" class="hidden md:block h-[320px] rounded-lg overflow-hidden ">
                <NuxtImg :src="category.img_url" :alt="category.name" class="h-full" loading="lazy" />
              </div>
              <div v-else
                class="hidden md:block h-[320px] rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mt-4">
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
          <div class="flex justify-end items-center mb-8">

            <div class="flex items-center gap-4">
              <span class="text-gray-500">Ver</span>
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button @click="viewMode = 'grid'"
                  :class="viewMode === 'grid' ? '' : 'text-gray-600 hover:text-gray-800'"
                  class="p-2 rounded-md transition-all duration-200" title="Vista de cuadrícula">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                    <rect y="4.9082" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                    <rect x="4.90918" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                    <rect x="4.90918" y="4.9082" width="4.09091" height="4.09091" rx="0.818182" :fill="viewMode === 'grid' ? '#FF500B' : '#7E7E7E'" />
                  </svg>

                </button>
                <button @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? '' : 'text-gray-600 hover:text-gray-800'"
                  class="p-2 rounded-md transition-all duration-200" title="Vista de lista">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                    <rect width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                    <rect y="3" width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                    <rect y="6" width="2" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                    <rect x="3" y="3" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                    <rect x="3" y="6" width="9" height="2" rx="1" :fill="viewMode === 'list' ? '#FF500B' : '#7E7E7E'" />
                  </svg>

                </button>
              </div>
            </div>
          </div>

          <!-- Vista GRID -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div v-for="product in products" :key="product.id"
              class="bg-white rounded-lg shadow-sm border px-4 py-4 md:py-10 flex items-center gap-4">
              <img :src="product.main_image_url" :alt="product.nombre" class="w-20 h-20 object-cover rounded-lg" />
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-2 md:mb-4">{{ product.nombre.slice(0, 30) + '...' }}</h3>
                <div class="flex flex-col">
                  <span class="text-sm text-gray-500">Orden mínima: {{ getMinimumOrderQuantity(product) || 1 }}</span>
                  <span class="text-lg font-bold">{{ $formatPrice(product.precio) }}</span>

                </div>
              </div>
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

const categories = computed(() => categoryStore.categories)
const products = computed(() => productStore.products)
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