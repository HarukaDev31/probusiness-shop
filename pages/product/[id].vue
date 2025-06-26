<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="product">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Imágenes laterales -->
        <div class="flex flex-col  col-span-12 md:col-span-1 space-y-4 relative">


          <div v-for="(media, index) in visibleMediaItems" :key="index"
            class="aspect-square overflow-hidden rounded-md cursor-pointer border-2"
            :class="{ 'border-primary': activeMediaIndex === media.originalIndex }"
            @mouseover="activeMediaIndex = media.originalIndex">
            <NuxtImg v-if="media.type === 'image'" :src="media.url" :alt="product.nombre"
              class="w-full h-full object-contain" />
            <video v-else :src="media.url" :alt="product.nombre" class="w-full h-full object-contain" muted
              loop></video>
          </div>


        </div>

        <!-- Imagen principal -->
        <div
          class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-5 relative flex items-center justify-center ">
          <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute top-5 right-5 w-8 h-8 z-10
            hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
            <path
              d="M20.3807 2.67974C19.8676 2.14721 19.2583 1.72477 18.5878 1.43656C17.9172 1.14834 17.1985 1 16.4727 1C15.7468 1 15.0281 1.14834 14.3576 1.43656C13.687 1.72477 13.0778 2.14721 12.5646 2.67974L11.4997 3.7844L10.4348 2.67974C9.39834 1.60458 7.99258 1.00056 6.52679 1.00056C5.06099 1.00056 3.65523 1.60458 2.61876 2.67974C1.58229 3.7549 1 5.21313 1 6.73364C1 8.25415 1.58229 9.71238 2.61876 10.7875L3.68367 11.8922L11.4997 20L19.3158 11.8922L20.3807 10.7875C20.8941 10.2553 21.3013 9.62328 21.5791 8.9277C21.857 8.23212 22 7.48657 22 6.73364C22 5.98071 21.857 5.23516 21.5791 4.53958C21.3013 3.84399 20.8941 3.21201 20.3807 2.67974Z"
              stroke="#585858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button v-if="mediaItems.length > 1" @click="prevMedia"
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <div class="aspect-square overflow-hidden rounded-md w-full relative">


            <NuxtImg v-if="activeMedia.type === 'image'" :src="activeMedia.url" :alt="product.nombre"
              class="w-full h-full object-contain" />
            <video v-else :src="activeMedia.url" :alt="product.nombre" class="w-full h-full object-contain" autoplay
              muted loop></video>
          </div>

          <button v-if="mediaItems.length > 1" @click="nextMedia"
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Product Details -->
        <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6">
          <h1 class="text-3xl font-bold mb-2">{{ product.nombre }}</h1>
          <!-- <div class="text-2xl font-bold text-primary mb-6">s/{{ product.price.toFixed(2) }}</div> -->
          <!--foreach product.prices as price show quantity and price-->
          <!-- <div v-if="product.prices_range && product.prices_range.length > 0" class="mb-4">
            <ul class="list-disc pl-5">
              <li v-for="price in JSON.parse(product.prices_range??'[]')" :key="price.quantity">
                <span class="font-bold">{{ price.quantity }} uni: </span>
                S/{{ price.price}}
              </li>
            </ul>
          </div> -->
          <!-- use this structure <div class="price-item"><div class="id-mb-2 id-flex id-whitespace-nowrap id-text-sm id-text-[#666]">50 - 499 unidades</div><div class="id-flex id-flex-col id-text-2xl id-font-bold id-text-[#222]"><span class="id-text-highlight-dark">$5.80</span></div></div>-->
          <div v-if="product.prices_range && product.prices_range.length > 0" class="mb-4
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 id-bg-white id-p-4 id-rounded-lg id-border-2 id-border-gray-200 id-shadow-md
            id-text-gray-700 id-text-sm id-font-medium id-space-y-2">
            <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity" class="price-item">
              <div class="text-sm text-gray-500 mb-2">
                {{ price.quantity }}
              </div>
              <div class="text-2xl font-bold text-gray-800">
                <span class="id-text-highlight-dark">S/{{ price.price }}</span>
              </div>
            </div>
          </div>
         
          <!--cards for pedido minimo,precio puesto en peru ,inversion total-->
          <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Pedido mínimo</h3>
              <p class="text-3xl font-bold">{{ getMinimumOrderQuantity()}} uni.</p>
            </div>
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Precio puesto en Perú</h3>
              <p class="text-3xl font-bold">S/{{ getPrecioPuestoEnPeru() }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Inversión total</h3>
              <p class="text-3xl font-bold">S/{{ (getPrecioPuestoEnPeru() * quantity).toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mb-8 bg-white border-gray-200 border-2 rounded-lg p-4">
            <div class="flex flex-row gap-1 items-center ">
              <h3 class="text-2xl text-gray-500 ">Cantidad:</h3>
              <p class="px-4 text-2xl py-2 text-gray-500">{{ quantity }}</p>
            </div>
            <div class="flex items-center justify-end rounded ">
              <button v-if="quantity > product.moq" @click="decreaseQuantity"
                class="px-4 py-2 text-4xl hover:bg-gray-100 text-gray-500 ">-</button>

              <button @click="increaseQuantity" class="px-4 py-2 text-4xl text-gray-500 hover:bg-gray-100">+</button>
            </div>
          </div>

          <button @click="addToCart" class="btn w-full py-3 text-lg">
            Añadir al carrito
          </button>
        </div>
      </div>

      <!-- Related Products -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Otras Recomendaciones para tu negocio</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" :product="relatedProduct" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6 mt-16">
        <h1 class="text-2xl font-bold mb-4">Attributos</h1>
        <!--foreach attribute show in table key value  in 2 cols and multiplies row product.attributes is json parse it-->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div v-for="(value, key, index) in JSON.parse(product.attributes || '{}')" :key="key"
            class="flex justify-between py-2 px-4 border-b">
            <span class="font-medium">{{ key }}</span>
            <span>{{ value }}</span>
          </div>
        </div>
        <!-- div with border bottom -->
        <div class="border-b my-2"></div>
        <h1 class="text-2xl font-bold mb-4">Descripciones de producto de proveedor</h1>
        <div v-html="cleanHtmlContent(product.product_details)" class="text-gray-700 mt-4" v-if="product.product_details">
        </div>
      </div>
      <!--di-->
    </template>

    <div v-else class="text-center py-12">
      <p class="text-lg text-gray-500">Producto no encontrado.</p>
      <NuxtLink to="/" class="mt-4 btn inline-block">Volver al inicio</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '~/stores/product';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const productId = parseInt(route.params.id);

const productStore = useProductStore();
const cartStore = useCartStore();

const { products } = storeToRefs(productStore);
const loading = ref(true);
const quantity = ref(1);
const currentMainImage = ref('');
const moq= ref(1);
// Función para detectar si es video
const isVideo = (url) => {
  return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
};


// Get the current product
const product = computed(() => {
  const productToReturn = products.value.find(p => p.id === productId);
  quantity.value = productToReturn?.moq || 1;
  return productToReturn;
});

// Get related products (same category)
const relatedProducts = computed(() => {
  if (!product.value) return [];
  console.log('product.value.category_slug', productStore.relatedProducts);
  return productStore.relatedProducts;
});

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > (product.value.moq == 0 ? 1 : product.value.moq)) {
    quantity.value--;
  }
};
computed(() => {
  if (product.value) {
    currentMainImage.value = product.value.main_image_url;
  }
});
const addToCart = () => {
  //
  if (product.value) {
    cartStore.addItem({
      ...product.value,
      quantity: quantity.value
    });
  }
};

// Ensure data is loaded
onMounted(async () => {
  await productStore.fetchProductById(productId);
  await productStore.fetchRelatedProducts(product.value.category_slug);

  loading.value = false;
});

// Reset quantity when product changes
watch(() => route.params.id, () => {
  quantity.value = 1;
});
// Inicializamos con la imagen principal
// Variables para el carrusel
const activeMediaIndex = ref(0);
const currentPage = ref(0);
const itemsPerPage = 4; // Número de miniaturas visibles
const cleanHtmlContent = (htmlString) => {
  if (!htmlString) return '';

  // Remover caracteres de escape y caracteres extraños
  let cleaned = htmlString
    .replace(/\\"/g, '"')  // Reemplazar \" por "
    .replace(/\\n/g, '')   // Remover \n
    .replace(/\\t/g, '')   // Remover \t
    .replace(/\\/g, '')    // Remover backslashes restantes
    .trim();

  // Extraer solo el contenido del body si existe
  const bodyMatch = cleaned.match(/<body[^>]*>(.*?)<\/body>/s);
  if (bodyMatch) {
    cleaned = bodyMatch[1];
  }

  // Validar que las imágenes tengan URLs válidas
  cleaned = cleaned.replace(/<img[^>]*>/g, (imgTag) => {
    const srcMatch = imgTag.match(/src="([^"]*)"/);
    if (srcMatch && srcMatch[1] && srcMatch[1].startsWith('http')) {
      return imgTag;
    }
    return ''; // Remover imágenes sin URL válida
  });

  return cleaned;
}
const mediaItems = computed(() => {
  const items = [];

  if (product.value?.main_image_url) {
    items.push({
      url: product.value.main_image_url,
      type: 'image'
    });
  }

  if (product.value?.aditional_image1_url) {
    items.push({
      url: product.value.aditional_image1_url,
      type: 'image'
    });
  }

  if (product.value?.aditional_image2_url) {
    items.push({
      url: product.value.aditional_image2_url,
      type: 'image'
    });
  }

  if (product.value?.aditional_video1_url) {
    items.push({
      url: product.value.aditional_video1_url,
      type: 'video'
    });
  }

  return items;
});

const visibleMediaItems = computed(() => {
  const start = currentPage.value * itemsPerPage;
  return mediaItems.value
    .slice(start, start + itemsPerPage)
    .map((item, index) => ({
      ...item,
      originalIndex: start + index
    }));
});

const activeMedia = computed(() => {
  return mediaItems.value[activeMediaIndex.value] || {};
});

// Navegación
const nextMedia = () => {
  activeMediaIndex.value = (activeMediaIndex.value + 1) % mediaItems.value.length;
  updatePage();
};

const prevMedia = () => {
  activeMediaIndex.value = (activeMediaIndex.value - 1 + mediaItems.value.length) % mediaItems.value.length;
  updatePage();
};

const updatePage = () => {
  currentPage.value = Math.floor(activeMediaIndex.value / itemsPerPage);
};
const getMinimumOrderQuantity = () => {
  try {
    const prices = JSON.parse(product.value.prices_range || '[]');
    const quantitySelected = Number(quantity.value);
    
    if (!prices.length) return null;

    for (const price of prices) {
      const quantityRange = price.quantity.trim();
      let minQty = null;

      // Caso 1: Rango "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        minQty = parseInt(rangeMatch[1]);
        const maxQty = parseInt(rangeMatch[2]);
        
        if (quantitySelected >= minQty && quantitySelected <= maxQty) {
          return minQty;
        }
        continue;
      }

      // Caso 2: Mínimo ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)/);
      if (minMatch) {
        minQty = parseInt(minMatch[1]);
        
        if (quantitySelected >= minQty) {
          return minQty;
        }
        continue;
      }

      // Caso 3: Cantidad fija "100 conjuntos"
      const fixedMatch = quantityRange.match(/^(\d+)/);
      if (fixedMatch) {
        minQty = parseInt(fixedMatch[1]);
        if (quantitySelected === minQty) {
          return minQty;
        }
      }
    }

    // Si no coincide con ningún rango, devolver la mínima cantidad disponible
    return prices.reduce((min, price) => {
      const match = price.quantity.match(/(\d+)/);
      return match ? Math.min(min, parseInt(match[1])) : min;
    }, Infinity);

  } catch (error) {
    console.error('Error calculating minimum order quantity:', error);
    return null;
  }
};
const getPrecioPuestoEnPeru = () => {
  // get product.precios
  const precios = JSON.parse(product.value.prices_range || '[]');
  const quantitySelected = quantity.value;

  if (precios.length > 0) {
    // buscar el precio que corresponde a la cantidad seleccionada
    for (const precio of precios) {
      const quantityRange = precio.quantity;

      // Regex para rango: "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)\s+/);
      if (rangeMatch) {
        const minQty = parseInt(rangeMatch[1]);
        const maxQty = parseInt(rangeMatch[2]);

        if (quantitySelected >= minQty && quantitySelected <= maxQty) {
          return precio.price;
        }
      }

      // Regex para mínimo: ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)\s+/);
      if (minMatch) {
        const minQty = parseInt(minMatch[1]);

        if (quantitySelected >= minQty) {
          return precio.price;
        }
      }
    }

    // Si no encuentra rango específico, devolver el primer precio
    return precios[0].price;
  }

  // Si no hay precios, devolver precio base del producto
  return product.value.precio || '0';
};
// Inicialización
watch(() => product.value, () => {
  activeMediaIndex.value = 0;
  currentPage.value = 0;
}, { immediate: true });
</script>
<style scoped>
.border-primary {
  border-color: #3b82f6;
  /* o tu color primary */
}

.cursor-pointer {
  cursor: pointer;
}table{
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}table th,
table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
table th {
  font-weight: bold;
  color: #374151;
}
table td {
  color: #6b7280;
}
table tr:nth-child(even) {
  background-color: #f9fafb;
}
table tr:hover {
  background-color: #f3f4f6;
}

</style>