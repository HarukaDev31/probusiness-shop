<template>
  <div class="min-h-screen bg-[#f5f8fb] flex flex-col">
    <div class="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12 max-w-[1200px] mx-auto w-full">
      <!-- Columna productos -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-xl font-bold mb-2">Tus productos</h2>
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <p class="text-gray-500 mb-6">No hay artículos seleccionados.</p>
            <NuxtLink to="/" class="btn px-6 py-3">Continuar comprando</NuxtLink>
          </div>
          <template v-else>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>No hay artículos seleccionados.</span>
              <button class="text-primary hover:underline" @click="selectAll">Seleccionar todos los artículos</button>
            </div>
            <div>
              <CartItem v-for="item in cartItems" :key="item.id" :item="item" :showCheckbox="true" />
            </div>
            <div class="flex justify-end mt-6">
              <button
                class="bg-[#FF5000] text-white font-semibold px-8 py-3 rounded"
                @click="goToCheckout"
              >
                Continuar
              </button>
            </div>
          </template>
        </div>
      </div>
      <!-- Columna resumen -->
      <div class="w-full md:w-[340px] flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 class="text-lg font-bold mb-6">Resumen del pedido</h3>
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-2xl font-bold text-gray-800">S/ {{ selectedTotal.toFixed(2) }}</span>
          </div>
            <button
            class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
            disabled  >
            Iniciar pedido
          </button>
        </div>
        <div v-if="selectedItems.length === 0" class="text-xs text-red-500 mt-2">
          Selecciona al menos un producto para continuar.
        </div>
        <div class="bg-white rounded-lg shadow-md p-8">
          <h4 class="text-lg font-bold mb-4">Datos importantes:</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <span class="inline-block w-6 h-6 mt-1"><svg width="25" height="28" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7425 0H2.42041C1.08258 0 0 1.08258 0 2.42041V7.70131C0 9.03914 1.08258 10.1217 2.42041 10.1217H14.7425C16.0803 10.1217 17.1629 9.03914 17.1629 7.70131V2.42041C17.1629 1.08258 16.0803 0 14.7425 0ZM2.42041 1.32022H3.35337C3.45019 1.52266 3.5206 1.7427 3.5206 1.98034C3.5206 2.82528 2.82528 3.5206 1.98034 3.5206C1.7427 3.5206 1.52266 3.45019 1.32022 3.35337V2.42041C1.32022 1.81311 1.81311 1.32022 2.42041 1.32022ZM1.32022 7.70131V4.75281C1.53146 4.80562 1.7515 4.84082 1.98034 4.84082C3.55581 4.84082 4.84082 3.55581 4.84082 1.98034C4.84082 1.7515 4.80562 1.53146 4.75281 1.32022H14.7425C15.3498 1.32022 15.8427 1.81311 15.8427 2.42041V5.36891C15.6315 5.31611 15.4114 5.2809 15.1826 5.2809C13.6071 5.2809 12.3221 6.56592 12.3221 8.14139C12.3221 8.37022 12.3573 8.59026 12.4101 8.8015H2.42041C1.81311 8.8015 1.32022 8.30861 1.32022 7.70131ZM14.7425 8.8015H13.8096C13.7127 8.59906 13.6423 8.37903 13.6423 8.14139C13.6423 7.29644 14.3376 6.60112 15.1826 6.60112C15.4202 6.60112 15.6403 6.67154 15.8427 6.76835V7.70131C15.8427 8.30861 15.3498 8.8015 14.7425 8.8015Z" fill="#272A30"/><path d="M8.58252 2.64062C7.24469 2.64062 6.16211 3.72321 6.16211 5.06104C6.16211 6.39886 7.24469 7.48145 8.58252 7.48145C9.92035 7.48145 11.0029 6.39886 11.0029 5.06104C11.0029 3.72321 9.92035 2.64062 8.58252 2.64062ZM8.58252 6.16122C7.97522 6.16122 7.48233 5.66834 7.48233 5.06104C7.48233 4.45373 7.97522 3.96085 8.58252 3.96085C9.18982 3.96085 9.68271 4.45373 9.68271 5.06104C9.68271 5.66834 9.18982 6.16122 8.58252 6.16122Z" fill="#272A30"/></svg></span>
              <div>
                <span class="font-semibold">Sobre el precio</span><br>
                <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="inline-block w-6 h-6 mt-1"><svg width="25" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.58146 0C3.84625 0 0 3.84625 0 8.58146C0 13.3167 3.84625 17.1629 8.58146 17.1629C13.3167 17.1629 17.1629 13.3167 17.1629 8.58146C17.1629 3.84625 13.3167 0 8.58146 0ZM9.24157 15.8075V14.7425C9.24157 14.3816 8.94232 14.0824 8.58146 14.0824C8.2206 14.0824 7.92135 14.3816 7.92135 14.7425V15.8075C4.44476 15.4906 1.67228 12.7182 1.35543 9.24157H2.42041C2.78127 9.24157 3.08052 8.94232 3.08052 8.58146C3.08052 8.2206 2.78127 7.92135 2.42041 7.92135H1.35543C1.67228 4.44476 4.44476 1.67228 7.92135 1.35543V2.42041C7.92135 2.78127 8.2206 3.08052 8.58146 3.08052C8.94232 3.08052 9.24157 2.78127 9.24157 2.42041V1.35543C12.7182 1.67228 15.4906 4.44476 15.8075 7.92135H14.7425C14.3816 7.92135 14.0824 8.2206 14.0824 8.58146C14.0824 8.94232 14.3816 9.24157 14.7425 9.24157H15.8075C15.4906 12.7182 12.7182 15.4906 9.24157 15.8075Z" fill="#272A30"/><path d="M11.1161 6.05201L8.74852 7.66268L6.64496 4.57335C6.44252 4.2741 6.02885 4.19489 5.7296 4.39732C5.43035 4.59976 5.35114 5.01343 5.55357 5.31268L8.02679 8.9477C8.15882 9.13253 8.36125 9.23815 8.57249 9.23815C8.69571 9.23815 8.82773 9.20294 8.94215 9.12373L11.8554 7.14339C12.1547 6.94096 12.2339 6.52729 12.0315 6.22804C11.829 5.92878 11.4154 5.84957 11.1161 6.05201Z" fill="#272A30"/></svg></span>
              <div>
                <span class="font-semibold">Tiempo de entrega</span><br>
                <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2 meses</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de alerta de monto mínimo -->
<div
  v-if="showMinAlert"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
>
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative text-center">
    <button
      class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
      @click="showMinAlert = false"
    >&times;</button>
    <div class="flex flex-col items-center mb-4">
      <div class="w-14 h-14 flex items-center justify-center rounded-full border-2 border-[#FF5000] mb-2">
        <span class="text-4xl text-[#FF5000]">!</span>
      </div>
      <div class="text-lg font-semibold mb-2">
        El monto mínimo de importación es de s/3000 para este pedido
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4"></div>
    <div class="flex flex-col gap-3 mb-2 text-left">
      <div>
        Tu pedido actual:
        <b>s/{{ selectedTotal.toFixed(2) }}</b>
      </div>
      <div>
        Importe pendiente:
        <b class="text-[#FF5000]">s/{{ (3000 - selectedTotal).toFixed(2) }}</b>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4"></div>
    <div class="text-xs text-gray-500 mt-3">
      *Puedes aumentar unidades o agregar más productos
    </div>
  </div>
</div>
</template>



<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart';

const router = useRouter(); 
const cartStore = useCartStore();
const { cartItems, cartTotal, cartItemCount } = storeToRefs(cartStore);
const selectedItems = computed(() => cartStore.cartItems.filter(item => cartStore.selectedIds.includes(item.id)))
const selectedTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const showMinAlert = ref(false)

const selectAll = () => {
  cartStore.selectedIds = cartStore.cartItems.map(item => item.id)
}

async function goToCheckout() {
  // Guarda solo los seleccionados en una propiedad temporal del store
  cartStore.checkoutItems = selectedItems.value
  if (selectedTotal.value < 3000) {
    showMinAlert.value = true
    return
  }
  router.push('/checkout')
}

</script>

<style scoped>
.text-primary {
  color: #FF5000;
}
.btn {
  background: #FF5000;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  transition: background 0.2s;
}
.btn:hover {
  background: #e04a00;
}
</style>