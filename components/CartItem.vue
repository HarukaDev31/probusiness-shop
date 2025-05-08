<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200">
    <div class="sm:w-1/5 w-full h-full sm:h-1/5  flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4 mb-4 sm:mb-0">
      <img :src="item.main_image_url" :alt="item.nombre" class="w-full h-full  object-contain ">
    </div>
    <div class="flex-grow xl:w-2/5 md:w-3/5 w-3/5">
      <h3 class="text-lg font-medium">{{ item.nombre }}</h3>
      <div class="flex justify-start items-center mt-2 bg-white border-gray-200 border-2 rounded-lg px-2">
        <div class="flex flex-row gap-1 items-center ">
          <h3 class="text-md text-gray-500 ">Cantidad:</h3>
          <p class="px-4 text-md text-gray-500">{{ item.quantity }}</p>
        </div>
        <div class="flex items-center justify-center rounded ">
          <button v-if="item.quantity > item.moq" @click="decreaseQuantity"
            class="px-4 text-xl hover:bg-gray-100 text-gray-500 ">-</button>

          <button @click="increaseQuantity" class="px-4 text-xl text-gray-500 hover:bg-gray-100">+</button>
        </div>
      </div>
    </div>
    <div class="flex-grow xl:w-2/5 md:w-1/5 w-0">
    </div>
    <div class="flex items-center mt-4 sm:mt-0 w-1/5">

      <button @click="removeItem" class="ml-4 text-red-500 hover:text-red-500">
        <Icon name="heroicons:trash" class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const increaseQuantity = () => {
  cartStore.updateItemQuantity(props.item.id, props.item.quantity + 1);
};

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateItemQuantity(props.item.id, props.item.quantity - 1);
  } else {
    removeItem();
  }
};

const removeItem = () => {
  cartStore.removeItem(props.item.id);
};
</script>