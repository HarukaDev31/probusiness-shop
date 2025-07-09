<template>
  <div class="container-custom py-8">

    <div class="bg-white rounded-lg shadow-md p-10 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Detalle de pedido</h1>
      <div class="border-b border-gray-300 mb-6"></div>
      <div class="flex items-start gap-4 pb-6 " v-for="cartItems in cartItems">
        <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden" :key="cartItems.id">
          <NuxtImg :src="getCartItemImage(cartItems)" :alt="cartItems?.nombre" class="w-full h-full object-contain p-2" />
        </div>
        <div>
          <h3 class="font-medium">{{ cartItems?.nombre }}</h3>
          <p class="text-sm text-gray-500">Cantidad: {{ cartItems?.quantity }}</p>
        </div>
      </div>
      <div class="border-b border-gray-300 mb-6"></div>
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
        <NuxtLink to="/checkout"
          class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded text-center hover:bg-gray-300 transition">
          Regresar
        </NuxtLink>
        <button @click="handleSubmit" class="flex-1 btn py-3">
          Finalizar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';
import orderService from '../../services/order-service';
const router = useRouter();
const cartStore = useCartStore();
const { cartItems, cartTotal } = storeToRefs(cartStore);

const getCartItemImage = (item) => {
  // Si hay media array y tiene elementos, usar la primera imagen
  if (item.media && Array.isArray(item.media) && item.media.length > 0) {
    const firstMedia = item.media[0];
    if (firstMedia.url) {
      return firstMedia.url;
    }
  }
  
  // Fallback a image, main_image_url o nombre
  return item.image || item.main_image_url || '/images/logo.png';
};

const checkoutInfo = ref({});

onMounted(() => {
  const savedInfo = localStorage.getItem('checkoutInfo');
  if (!savedInfo) {
    router.push('/checkout');
    return;
  }
  checkoutInfo.value = JSON.parse(savedInfo);
});

const handleSubmit = async () => {
  try {
    // Preparar datos del pedido usando el servicio
    const orderData = orderService.prepareOrderData(checkoutInfo.value, cartItems.value, cartTotal.value)
    
    // Validar los datos antes de enviar
    const validation = orderService.validateOrderData(orderData)
    if (!validation.isValid) {
      console.error('Errores de validación:', validation.errors)
      alert('Por favor, completa todos los campos correctamente.')
      return
    }

    // Enviar el pedido usando el servicio
    const response = await orderService.createOrder(orderData)

    if (response.success) {
      handleSuccess();
    } else {
      // Mostrar errores específicos si los hay
      if (response.errors && response.errors.length > 0) {
        const errorMessages = response.errors.map(error => error.message).join('\n')
        alert(`Error al procesar el pedido:\n${errorMessages}`)
      } else {
        alert(response.message || 'Error al procesar el pedido. Por favor, inténtalo de nuevo.')
      }
    }
  } catch (error) {
    console.error('Error al enviar pedido:', error);
    alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
  }
};
const handleSuccess = () => {
  router.push('/checkout/success');
  cartStore.clearCart();
  localStorage.removeItem('checkoutInfo');
};
</script>