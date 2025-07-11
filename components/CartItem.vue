<template>
  <div class="flex items-start py-4 border-b border-gray-200 gap-2">
    <!-- Checkbox -->
    <input type="checkbox" class="form-checkbox w-5 h-5 accent-[#FF5000] mt-1 flex-shrink-0" v-model="isSelected" />
    
    <!-- Imagen -->
    <div class="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
      <NuxtImg :src="getItemImage()" :alt="item.name || item.nombre" class="w-full h-full object-contain" />
    </div>
    
    <!-- Contenido principal -->
    <div class="flex-1 min-w-0">
      <!-- Nombre del producto -->
      <h3 
        class="text-sm md:text-base font-medium text-gray-900 leading-tight cursor-pointer hover:text-[#FF5000] transition-colors mb-2" 
        style="word-break: break-word; line-height: 1.3;"
        @click="goToProduct(item.product?.id || item.id)"
      >
        {{ item.name?.slice(0, 80) + '...' || item.nombre.slice(0, 80) + '...' }}
      </h3>
      
      <!-- Controles de cantidad en mobile -->
      <div class="flex items-center justify-between md:hidden">
        <div class="flex items-center gap-1 bg-[#F5F8FB] rounded-lg border border-gray-200 px-1">
          <button 
            @click="decreaseQuantity" 
            :disabled="inputQuantity <= getProductMOQ(props.item)"
            :class="inputQuantity <= getProductMOQ(props.item) ? 'w-6 h-6 flex items-center justify-center text-sm text-gray-400 rounded cursor-not-allowed' : 'w-6 h-6 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-200 rounded'"
          >
            -
          </button>
          <input 
            type="number" 
            :min="getProductMOQ(props.item)" 
            v-model.number="inputQuantity" 
            @input="validateInputQuantity"
            class="w-10 text-center bg-transparent outline-none border-none text-sm font-semibold" 
          />
          <button @click="increaseQuantity" class="w-6 h-6 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-200 rounded">+</button>
        </div>
        <div class="text-right">
          <div class="font-semibold text-gray-800 text-sm">
            {{ $formatPrice(item.price * item.quantity) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ $formatPrice(item.price) }} c/u
          </div>
        </div>
      </div>
    </div>
    
    <!-- Controles de cantidad en desktop -->
    <div class="hidden md:flex items-center gap-1 mx-2 bg-[#F5F8FB] rounded-lg border border-gray-200 px-1">
      <button 
        @click="decreaseQuantity" 
        :disabled="inputQuantity <= getProductMOQ(props.item)"
        :class="inputQuantity <= getProductMOQ(props.item) ? 'w-8 h-8 flex items-center justify-center text-xl text-gray-400 rounded cursor-not-allowed' : 'w-8 h-8 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded'"
      >
        -
      </button>
      <input 
        type="number" 
        :min="getProductMOQ(props.item)" 
        v-model.number="inputQuantity" 
        @input="validateInputQuantity"
        class="w-12 text-center bg-transparent outline-none border-none text-base font-semibold" 
      />
      <button @click="increaseQuantity" class="w-8 h-8 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded">+</button>
    </div>
    
    <!-- Precio en desktop -->
    <div class="hidden md:block w-28 text-right font-semibold text-gray-800 text-base">
      {{ $formatPrice(item.price * item.quantity) }}
    </div>
    
    <!-- Eliminar -->
    <button @click="removeItem" class="text-red-500 hover:text-red-600 flex items-center justify-center flex-shrink-0">
      <Icon name="heroicons:trash" class="w-5 h-5 md:w-6 md:h-6" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const { $formatPrice } = useNuxtApp();

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  showCheckbox: {
    type: Boolean,
    default: true
  }
});

const cartStore = useCartStore();

// Función para obtener el MOQ de un producto
const getProductMOQ = (product) => {
  // Si el producto tiene moq explícito, usarlo
  if (product && product.moq && !isNaN(Number(product.moq))) {
    return Number(product.moq);
  }
  // Si no, intentar obtener del primer rango de precios
  try {
    const precios = JSON.parse(product?.prices_range || '[]');
    if (precios.length > 0) {
      const match = precios[0].quantity.match(/(\d+)/);
      if (match) return parseInt(match[1]);
    }
  } catch (e) {}
  return 1;
};

const getItemImage = () => {
  // Si hay media array y tiene elementos, usar la primera imagen
  if (props.item.media && Array.isArray(props.item.media) && props.item.media.length > 0) {
    const firstMedia = props.item.media[0];
    if (firstMedia.url) {
      return firstMedia.url;
    }
  }
  
  // Fallback a image o main_image_url
  return props.item.image || props.item.main_image_url || '/images/logo.png';
};
const selected = ref(false); // Para selección futura
const inputQuantity = ref(props.item.quantity);

watch(() => props.item.quantity, (val) => {
  inputQuantity.value = val;
});

watch(inputQuantity, (val) => {
  // Validar que la cantidad no sea menor al MOQ del producto
  const moq = getProductMOQ(props.item);
  if (val < moq) {
    inputQuantity.value = moq;
  }
  if (val !== props.item.quantity) {
    cartStore.updateItemQuantity(props.item.id, val);
  }
});

const increaseQuantity = () => {
  inputQuantity.value++;
};

const decreaseQuantity = () => {
  const moq = getProductMOQ(props.item);
  if (inputQuantity.value > moq) {
    inputQuantity.value--;
  }
};

const validateInputQuantity = () => {
  // Validar que la cantidad no sea menor al MOQ del producto
  const moq = getProductMOQ(props.item);
  if (inputQuantity.value < moq) {
    inputQuantity.value = moq;
  }
};

const removeItem = () => {
  cartStore.removeItem(props.item.id);
};

const goToProduct = (productId) => {
  if (productId) {
    navigateTo(`/product/${productId}`);
  }
};
const isSelected = computed({
  get() {
    return cartStore.selectedIds?.includes(props.item.id)
  },
  set(val) {
    if (val && !cartStore.selectedIds.includes(props.item.id)) {
      cartStore.selectedIds.push(props.item.id)
    } else if (!val) {
      cartStore.selectedIds = cartStore.selectedIds.filter(id => id !== props.item.id)
    }
  }
})
</script>