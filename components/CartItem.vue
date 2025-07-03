<template>
  <div class="flex items-center py-4 border-b border-gray-200 gap-2">
    <!-- Checkbox -->
    <input type="checkbox" class="form-checkbox w-5 h-5 accent-[#FF5000] mt-1" v-model="isSelected" />
    <!-- Imagen -->
    <div class="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
      <NuxtImg :src="item.image || item.main_image_url" :alt="item.name || item.nombre" class="w-full h-full object-contain" />
    </div>
    <!-- Nombre -->
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-medium text-gray-900 break-words whitespace-normal leading-tight" style="word-break: break-word;">{{ item.name || item.nombre }}</h3>
    </div>
    <!-- Controles de cantidad -->
    <div class="flex items-center gap-1 mx-2 bg-[#F5F8FB] rounded-lg border border-gray-200 px-1">
      <button @click="decreaseQuantity" class="w-8 h-8 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded">-</button>
      <input type="number" :min="1" v-model.number="inputQuantity" class="w-12 text-center bg-transparent outline-none border-none text-base font-semibold" />
      <button @click="increaseQuantity" class="w-8 h-8 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded">+</button>
    </div>
    <!-- Precio -->
    <div class="w-28 text-right font-semibold text-gray-800 text-base">
      s/{{ (item.price * item.quantity).toFixed(2) }}
    </div>
    <!-- Eliminar -->
    <button @click="removeItem" class="ml-2 text-red-500 hover:text-red-600 flex items-center justify-center">
      <Icon name="heroicons:trash" class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCartStore } from '~/stores/cart';

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
const selected = ref(false); // Para selección futura
const inputQuantity = ref(props.item.quantity);

watch(() => props.item.quantity, (val) => {
  inputQuantity.value = val;
});

watch(inputQuantity, (val) => {
  if (val < 1) inputQuantity.value = 1;
  if (val !== props.item.quantity) {
    cartStore.updateItemQuantity(props.item.id, val);
  }
});

const increaseQuantity = () => {
  inputQuantity.value++;
};

const decreaseQuantity = () => {
  if (inputQuantity.value > 1) {
    inputQuantity.value--;
  }
};

const removeItem = () => {
  cartStore.removeItem(props.item.id);
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