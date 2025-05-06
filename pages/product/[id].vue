<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="product">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="aspect-square overflow-hidden rounded-md">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-contain">
          </div>
        </div>

        <!-- Product Details -->
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
          <!-- <div class="text-2xl font-bold text-primary mb-6">s/{{ product.price.toFixed(2) }}</div> -->

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Descripción</h3>
            <p class="text-gray-700">{{ product.description || 'No hay descripción disponible para este producto.' }}
            </p>
          </div>

          <div class="mb-6">
            <div class="text-sm text-gray-500 mb-2">Tiempo de entrega: {{ product.daysEntrega }} dias </div>
            <div class="text-sm text-gray-500 mb-2">Qty box: {{ product.qtyBox }} dias </div>
            <div class="text-sm text-gray-500 mb-2">CBM x box: {{ product.cbmBox }} dias </div>
            <div class="text-sm text-gray-500 mb-2">Colores: {{ product.colors }} dias </div>
          </div>
          <!--cards for pedido minimo,precio puesto en peru ,inversion total-->
          <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Pedido mínimo</h3>
              <p class="text-3xl font-bold">{{ product.minOrder }} uni.</p>
            </div>
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Precio puesto en Perú</h3>
              <p class="text-3xl font-bold">S/{{ product.price.toFixed(2) }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg border-2">
              <h3 class="text-lg text-gray-500 font-semibold my-0 py-0">Inversión total</h3>
              <p class="text-3xl font-bold">S/{{ (quantity * product.price).toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mb-8 bg-white border-gray-200 border-2 rounded-lg p-4">
            <div class="flex flex-row gap-1 items-center ">
              <h3 class="text-2xl text-gray-500 ">Cantidad:</h3>
              <p class="px-4 text-2xl py-2 text-gray-500">{{ quantity }}</p>
            </div>
            <div class="flex items-center justify-end rounded ">
              <button v-if="quantity > product.minOrder" @click="decreaseQuantity"
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
        <h2 class="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" :product="relatedProduct" />
        </div>
      </div>
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

// Get the current product
const product = computed(() => {
  const productToReturn = products.value.find(p => p.id === productId);
  quantity.value = productToReturn?.minOrder || 1;
  return productToReturn;
});

// Get related products (same category)
const relatedProducts = computed(() => {
  if (!product.value) return [];
  return products.value
    .filter(p => p.categoryId === product.value.categoryId && p.id !== product.value.id)
    .slice(0, 4);
});

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > product.value.minOrder) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (product.value) {
    cartStore.addItem({
      ...product.value,
      quantity: quantity.value
    });
  }
};

// Ensure data is loaded
onMounted(async () => {
  await productStore.fetchProducts();
  loading.value = false;
});

// Reset quantity when product changes
watch(() => route.params.id, () => {
  quantity.value = 1;
});
</script>