<template>
    <div class="container-custom py-8">
      <h1 class="text-2xl font-bold mb-6">Detalle de pedido</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div class="flex items-start gap-4 pb-6 border-b">
          <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden">
            <img 
              :src="cartItems[0]?.main_image_url" 
              :alt="cartItems[0]?.nombre"
              class="w-full h-full object-contain p-2"
            >
          </div>
          <div>
            <h3 class="font-medium">{{ cartItems[0]?.nombre }}</h3>
            <p class="text-sm text-gray-500">Cantidad: {{ cartItems[0]?.quantity }}</p>
          </div>
        </div>
  
        <div class="py-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nombres completos</p>
              <p class="font-medium">{{ checkoutInfo.fullName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">DNI</p>
              <p class="font-medium">{{ checkoutInfo.dni }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Correo</p>
              <p class="font-medium">{{ checkoutInfo.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Celular</p>
              <p class="font-medium">{{ checkoutInfo.phone }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tipo de comprobante</p>
              <p class="font-medium capitalize">{{ checkoutInfo.documentType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Ciudad</p>
              <p class="font-medium">{{ checkoutInfo.city }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-600">Dirección</p>
              <p class="font-medium">{{ checkoutInfo.address }}</p>
            </div>
          </div>
        </div>
  
        <div class="flex gap-4 pt-4">
          <NuxtLink 
            to="/checkout"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded text-center hover:bg-gray-300 transition"
          >
            Regresar
          </NuxtLink>
          <button 
            @click="handleSubmit"
            class="flex-1 btn py-3"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { storeToRefs } from 'pinia';
  import { useCartStore } from '~/stores/cart';
  
  const router = useRouter();
  const cartStore = useCartStore();
  const { cartItems } = storeToRefs(cartStore);
  
  const checkoutInfo = ref({});
  
  onMounted(() => {
    const savedInfo = localStorage.getItem('checkoutInfo');
    if (!savedInfo) {
      router.push('/checkout');
      return;
    }
    checkoutInfo.value = JSON.parse(savedInfo);
  });
  
  const handleSubmit = () => {
    router.push('/checkout/success');
    cartStore.clearCart();
    localStorage.removeItem('checkoutInfo');
  };
  </script>