<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="product">
      <!-- Breadcrumb -->
      <div class="mb-2">
        <nav class="text-sm text-gray-400 mb-1">
          <span v-if="product.category_name">{{ product.category_name }}</span>
          <span v-if="product.category_name"> &gt; </span>
          <span class="text-gray-400">{{ product.nombre }}</span>
        </nav>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Columna galería + nombre -->
        <div class="col-span-12 md:col-span-6">
          <h1 class="text-3xl font-bold text-gray-900 leading-tight mb-4">{{ product.nombre }}</h1>
          <div class="flex flex-row">
            <!-- Imágenes laterales -->
            <div class="flex flex-col space-y-4 relative">
              <div v-for="(media, index) in visibleMediaItems" :key="index"
                class="aspect-square overflow-hidden rounded-md cursor-pointer border-2 w-16 h-16 md:w-16 md:h-16 mx-auto"
                :class="{ 'border-primary': activeMediaIndex === media.originalIndex }"
                @mouseover="activeMediaIndex = media.originalIndex">
                <NuxtImg v-if="media.type === 'image'" :src="media.url" :alt="product.nombre"
                  class="w-full h-full object-contain" />
                <video v-else :src="media.url" :alt="product.nombre" class="w-full h-full object-contain" muted loop></video>
              </div>
            </div>
            <!-- Imagen principal con overlay relativo -->
            <div class="bg-white rounded-lg shadow-md p-6 flex-1 flex items-center justify-center ml-4 relative">
              <!-- Corazón favoritos -->
              <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute top-5 right-5 w-8 h-8 z-10 hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                <path d="M20.3807 2.67974C19.8676 2.14721 19.2583 1.72477 18.5878 1.43656C17.9172 1.14834 17.1985 1 16.4727 1C15.7468 1 15.0281 1.14834 14.3576 1.43656C13.687 1.72477 13.0778 2.14721 12.5646 2.67974L11.4997 3.7844L10.4348 2.67974C9.39834 1.60458 7.99258 1.00056 6.52679 1.00056C5.06099 1.00056 3.65523 1.60458 2.61876 2.67974C1.58229 3.7549 1 5.21313 1 6.73364C1 8.25415 1.58229 9.71238 2.61876 10.7875L3.68367 11.8922L11.4997 20L19.3158 11.8922L20.3807 10.7875C20.8941 10.2553 21.3013 9.62328 21.5791 8.9277C21.857 8.23212 22 7.48657 22 6.73364C22 5.98071 21.857 5.23516 21.5791 4.53958C21.3013 3.84399 20.8941 3.21201 20.3807 2.67974Z" stroke="#585858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- Flecha izquierda -->
              <button v-if="mediaItems.length > 1" @click="prevMedia"
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <div class="aspect-square overflow-hidden rounded-md w-full relative flex items-center justify-center">
                <NuxtImg v-if="activeMedia.type === 'image'" :src="activeMedia.url" :alt="product.nombre"
                  class="object-contain w-full h-full max-w-[350px] max-h-[350px] mx-auto" />
                <video v-else :src="activeMedia.url" :alt="product.nombre" class="object-contain w-full h-full max-w-[350px] max-h-[350px] mx-auto" autoplay muted loop></video>
              </div>
              <!-- Flecha derecha -->
              <button v-if="mediaItems.length > 1" @click="nextMedia"
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Panel derecho -->
        <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6">
          <h5 class="text-2xl font-bold text-gray-800 mb-4">Cantidades</h5>
          <!-- Tabla de precios horizontal -->
          <div v-if="product.prices_range && product.prices_range.length > 0" class="my-6">
            <div class="flex flex-row flex-wrap gap-2 md:gap-4 justify-start md:justify-between pt-4">
              <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity" class="flex flex-col items-center min-w-[110px]">
                <div class="text-xs text-gray-500 mb-1 whitespace-nowrap">{{ price.quantity }}</div>
                <div class="text-2xl font-bold text-gray-800">S/{{ price.price }}</div>
              </div>
            </div>
          </div>
          <!-- Botones -->
          <div class="flex flex-col md:flex-row gap-4 mb-6 py-8">
            <button @click="openCartPanel" class="w-full md:w-1/2 border border-gray-800 text-gray-900 font-semibold py-3 rounded-lg bg-white hover:bg-gray-100 transition">Añadir al carrito</button>
            <button @click="iniciarPedidoMinimo" class="w-full md:w-1/2 bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition">Iniciar pedido</button>
          </div>
  <!-- Panel lateral de carrito -->
  <div v-if="showCartPanel" class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40" @click.self="showCartPanel = false">
    <div class="bg-white w-full max-w-md h-full shadow-xl p-8 flex flex-col" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Selecciona la cantidad de tu interés</h2>
        <button @click="showCartPanel = false" class="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      <div class="text-xs text-gray-500 mb-2">*Pedido mínimo de importación s/3,000</div>
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Cantidades</h3>
        <div class="flex flex-row flex-wrap gap-2 md:gap-4 justify-start md:justify-between">
          <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity" class="flex flex-col items-center min-w-[90px]">
            <div class="text-xs text-gray-500 mb-1 whitespace-nowrap">{{ price.quantity }}</div>
            <div class="text-lg font-bold text-gray-800">S/{{ price.price }}</div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold">Cantidad</span>
          <div class="flex items-center gap-2">
            <button @click="cartQuantity = Math.max(1, cartQuantity - 1)" class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-2xl">-</button>
            <input type="number" v-model.number="cartQuantity" min="1" class="w-16 text-center border border-gray-200 rounded px-2 py-1" />
            <button @click="cartQuantity++" class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-2xl">+</button>
          </div>
        </div>
        <div class="flex items-center justify-between mb-6">
          <span class="font-semibold">Total</span>
          <span class="text-lg font-bold">S/{{ (getPrecioPuestoEnPeru() * cartQuantity).toFixed(2) }}</span>
        </div>
        <div class="flex flex-col gap-3">
          <button @click="iniciarPedidoPanel" class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition">Iniciar pedido</button>
          <button
            class="w-full border border-gray-800 text-gray-900 font-semibold py-3 rounded-lg bg-white hover:bg-gray-100 transition"
            @click="addToCartFromPanel"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
          <!-- Datos importantes -->
          <div class="mt-4 border-t pt-6">
            <h3 class="font-bold text-gray-800 my-4">Datos importantes:</h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <!-- Icono precio -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.7425 0H2.42041C1.08258 0 0 1.08258 0 2.42041V7.70131C0 9.03914 1.08258 10.1217 2.42041 10.1217H14.7425C16.0803 10.1217 17.1629 9.03914 17.1629 7.70131V2.42041C17.1629 1.08258 16.0803 0 14.7425 0ZM2.42041 1.32022H3.35337C3.45019 1.52266 3.5206 1.7427 3.5206 1.98034C3.5206 2.82528 2.82528 3.5206 1.98034 3.5206C1.7427 3.5206 1.52266 3.45019 1.32022 3.35337V2.42041C1.32022 1.81311 1.81311 1.32022 2.42041 1.32022ZM1.32022 7.70131V4.75281C1.53146 4.80562 1.7515 4.84082 1.98034 4.84082C3.55581 4.84082 4.84082 3.55581 4.84082 1.98034C4.84082 1.7515 4.80562 1.53146 4.75281 1.32022H14.7425C15.3498 1.32022 15.8427 1.81311 15.8427 2.42041V5.36891C15.6315 5.31611 15.4114 5.2809 15.1826 5.2809C13.6071 5.2809 12.3221 6.56592 12.3221 8.14139C12.3221 8.37022 12.3573 8.59026 12.4101 8.8015H2.42041C1.81311 8.8015 1.32022 8.30861 1.32022 7.70131ZM14.7425 8.8015H13.8096C13.7127 8.59906 13.6423 8.37903 13.6423 8.14139C13.6423 7.29644 14.3376 6.60112 15.1826 6.60112C15.4202 6.60112 15.6403 6.67154 15.8427 6.76835V7.70131C15.8427 8.30861 15.3498 8.8015 14.7425 8.8015Z" fill="#272A30"/>
<path d="M8.58252 2.64062C7.24469 2.64062 6.16211 3.72321 6.16211 5.06104C6.16211 6.39886 7.24469 7.48145 8.58252 7.48145C9.92035 7.48145 11.0029 6.39886 11.0029 5.06104C11.0029 3.72321 9.92035 2.64062 8.58252 2.64062ZM8.58252 6.16122C7.97522 6.16122 7.48233 5.66834 7.48233 5.06104C7.48233 4.45373 7.97522 3.96085 8.58252 3.96085C9.18982 3.96085 9.68271 4.45373 9.68271 5.06104C9.68271 5.66834 9.18982 6.16122 8.58252 6.16122Z" fill="#272A30"/>
</svg>
</span>
                <div>
                  <span class="font-semibold">Sobre el precio</span><br>
                  <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono tiempo -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.58146 0C3.84625 0 0 3.84625 0 8.58146C0 13.3167 3.84625 17.1629 8.58146 17.1629C13.3167 17.1629 17.1629 13.3167 17.1629 8.58146C17.1629 3.84625 13.3167 0 8.58146 0ZM9.24157 15.8075V14.7425C9.24157 14.3816 8.94232 14.0824 8.58146 14.0824C8.2206 14.0824 7.92135 14.3816 7.92135 14.7425V15.8075C4.44476 15.4906 1.67228 12.7182 1.35543 9.24157H2.42041C2.78127 9.24157 3.08052 8.94232 3.08052 8.58146C3.08052 8.2206 2.78127 7.92135 2.42041 7.92135H1.35543C1.67228 4.44476 4.44476 1.67228 7.92135 1.35543V2.42041C7.92135 2.78127 8.2206 3.08052 8.58146 3.08052C8.94232 3.08052 9.24157 2.78127 9.24157 2.42041V1.35543C12.7182 1.67228 15.4906 4.44476 15.8075 7.92135H14.7425C14.3816 7.92135 14.0824 8.2206 14.0824 8.58146C14.0824 8.94232 14.3816 9.24157 14.7425 9.24157H15.8075C15.4906 12.7182 12.7182 15.4906 9.24157 15.8075Z" fill="#272A30"/>
<path d="M11.1161 6.05201L8.74852 7.66268L6.64496 4.57335C6.44252 4.2741 6.02885 4.19489 5.7296 4.39732C5.43035 4.59976 5.35114 5.01343 5.55357 5.31268L8.02679 8.9477C8.15882 9.13253 8.36125 9.23815 8.57249 9.23815C8.69571 9.23815 8.82773 9.20294 8.94215 9.12373L11.8554 7.14339C12.1547 6.94096 12.2339 6.52729 12.0315 6.22804C11.829 5.92878 11.4154 5.84957 11.1161 6.05201Z" fill="#272A30"/>
</svg>

</span>
                <div>
                  <span class="font-semibold">Tiempo de entrega</span><br>
                  <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2 meses</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono cantidad -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.7425 7.0412H12.4893C12.6566 6.70674 12.7622 6.33708 12.7622 5.94101V2.42041C12.7622 1.08258 11.6796 0 10.3418 0H6.82116C5.48333 0 4.40075 1.08258 4.40075 2.42041V5.94101C4.40075 6.33708 4.50637 6.70674 4.6736 7.0412H2.42041C1.08258 7.0412 0 8.12378 0 9.46161V13.8624C0 15.2002 1.08258 16.2828 2.42041 16.2828H6.82116C7.51648 16.2828 8.14139 15.9835 8.58146 15.517C9.02154 15.9923 9.64644 16.2828 10.3418 16.2828H14.7425C16.0803 16.2828 17.1629 15.2002 17.1629 13.8624V9.46161C17.1629 8.12378 16.0803 7.0412 14.7425 7.0412ZM5.72097 5.94101V2.42041C5.72097 1.81311 6.21386 1.32022 6.82116 1.32022H10.3418C10.9491 1.32022 11.4419 1.81311 11.4419 2.42041V5.94101C11.4419 6.54832 10.9491 7.0412 10.3418 7.0412H6.82116C6.21386 7.0412 5.72097 6.54832 5.72097 5.94101ZM6.82116 14.9625H2.42041C1.81311 14.9625 1.32022 14.4697 1.32022 13.8624V9.46161C1.32022 8.85431 1.81311 8.36142 2.42041 8.36142H6.82116C7.42846 8.36142 7.92135 8.85431 7.92135 9.46161V13.8624C7.92135 14.4697 7.42846 14.9625 6.82116 14.9625ZM15.8427 13.8624C15.8427 14.4697 15.3498 14.9625 14.7425 14.9625H10.3418C9.73446 14.9625 9.24157 14.4697 9.24157 13.8624V9.46161C9.24157 8.85431 9.73446 8.36142 10.3418 8.36142H14.7425C15.3498 8.36142 15.8427 8.85431 15.8427 9.46161V13.8624Z" fill="#272A30"/>
<path d="M7.70237 5.28125H6.82222C6.46136 5.28125 6.16211 5.5805 6.16211 5.94136C6.16211 6.30222 6.46136 6.60147 6.82222 6.60147H7.70237C8.06323 6.60147 8.36248 6.30222 8.36248 5.94136C8.36248 5.5805 8.06323 5.28125 7.70237 5.28125Z" fill="#272A30"/>
<path d="M3.30198 13.1992H2.42183C2.06097 13.1992 1.76172 13.4985 1.76172 13.8593C1.76172 14.2202 2.06097 14.5194 2.42183 14.5194H3.30198C3.66284 14.5194 3.96209 14.2202 3.96209 13.8593C3.96209 13.4985 3.66284 13.1992 3.30198 13.1992Z" fill="#272A30"/>
<path d="M11.2219 13.1992H10.3418C9.98089 13.1992 9.68164 13.4985 9.68164 13.8593C9.68164 14.2202 9.98089 14.5194 10.3418 14.5194H11.2219C11.5828 14.5194 11.882 14.2202 11.882 13.8593C11.882 13.4985 11.5828 13.1992 11.2219 13.1992Z" fill="#272A30"/>
</svg>

</span>
                <div>
                  <span class="font-semibold">La cantidad</span><br>
                  <span class="text-gray-500 text-sm">No se acepta pedidos por unidades, compra mínima de s/3.000</span>
                </div>
              </li>
            </ul>
          </div>
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
        <h1 class="text-2xl font-bold mb-4">Atributos clave</h1>
        <div class="overflow-x-auto">
          <table class="w-full border-separate border-spacing-0 text-sm">
            <tbody>
              <tr v-for="(row, rowIndex) in attributeRows" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="border border-[#e5e7eb] px-4 py-2 text-gray-700 whitespace-pre-line align-top min-w-[120px]">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
        <h1 class="text-2xl font-bold mb-4">Descripción de producto de proveedor</h1>
        <div v-html="cleanHtmlContent(product.product_details)" class="descripcion-html text-gray-700 mt-4" v-if="product.product_details"></div>
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
import { useRouter } from 'vue-router'
const router = useRouter();
const iniciarPedidoPanel = () => {
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name || product.value.nombre,
      price: getPrecioPuestoEnPeru(),
      quantity: cartQuantity.value,
      image: product.value.main_image_url || product.value.image || '/images/logo.png'
    });
    showCartPanel.value = false;
    router.push('/cart');
  }
};
function openCartPanel() {
  // Establece la cantidad mínima según los rangos de precios
  const minQty = getMinimumOrderQuantity() || 1;
  cartQuantity.value = minQty;
  showCartPanel.value = true;
}

const route = useRoute();
const productId = parseInt(route.params.id);
const cartQuantity = ref(1)
const showCartPanel = ref(false)
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


computed(() => {
  if (product.value) {
    currentMainImage.value = product.value.main_image_url;
  }
});


const iniciarPedidoMinimo = () => {
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name || product.value.nombre,
      price: getPrecioPuestoEnPeru(),
      quantity: getMinimumOrderQuantity() || 1,
      image: product.value.main_image_url || product.value.image || '/images/logo.png'
    });
    router.push('/cart');
  }
};

const addToCartFromPanel = () => {
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name || product.value.nombre,
      price: getPrecioPuestoEnPeru(),
      quantity: cartQuantity.value,
      image: product.value.main_image_url || product.value.image || '/images/logo.png'
    });
    showCartPanel.value = false;
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

  // Decodificar secuencias tipo u00f3 (sin barra) que vienen "rotas" del backend
  cleaned = cleaned.replace(/u([0-9a-fA-F]{4})/g, (m, g1) => String.fromCharCode(parseInt(g1, 16)));

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
  // Usar cartQuantity si está en el contexto del panel lateral, si no, usar quantity
  const quantitySelected = typeof cartQuantity !== 'undefined' ? cartQuantity.value : quantity.value;

  // Helper para extraer solo el número decimal del string de precio
  const parsePrecio = (precioStr) => {
    if (typeof precioStr === 'number') return precioStr;
    if (!precioStr) return 0;
    // Buscar el primer número decimal en el string
    const match = precioStr.replace(',', '.').match(/([0-9]+(\.[0-9]+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  if (precios.length > 0) {
    // buscar el precio que corresponde a la cantidad seleccionada
    for (const precio of precios) {
      const quantityRange = precio.quantity;

      // Regex para rango: "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)\s*/);
      if (rangeMatch) {
        const minQty = parseInt(rangeMatch[1]);
        const maxQty = parseInt(rangeMatch[2]);

        if (quantitySelected >= minQty && quantitySelected <= maxQty) {
          return parsePrecio(precio.price);
        }
      }

      // Regex para mínimo: ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)\s*/);
      if (minMatch) {
        const minQty = parseInt(minMatch[1]);

        if (quantitySelected >= minQty) {
          return parsePrecio(precio.price);
        }
      }
    }

    // Si no encuentra rango específico, devolver el primer precio válido
    return parsePrecio(precios[0].price);
  }

  // Si no hay precios, devolver precio base del producto
  return parsePrecio(product.value.precio || '0');
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

/* Estilos para la descripción HTML del proveedor */
.descripcion-html img,
.descripcion-html .product-image {
  max-width: 100% !important;
  height: auto !important;
  max-height: 400px;
  margin: 1em auto !important;
  display: block;
  border-radius: 0.5em;
  box-shadow: 0 2px 8px 0 #0001;
  object-fit: contain;
}
.descripcion-html table {
  width: 100% !important;
  max-width: 100%;
  table-layout: auto;
  font-size: 0.97em;
}
.descripcion-html td, .descripcion-html th {
  max-width: 300px;
  word-break: break-word;
  padding: 0.5em 0.7em !important;
  border: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}
.descripcion-html tr {
  min-height: 40px;
}
.descripcion-html *[style] {
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  height: auto !important;
}
</style>