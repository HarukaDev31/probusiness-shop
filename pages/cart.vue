<template>
  <div class="container-custom py-8 xl:w-1/2  md:w-4/5 w-4/5  ">

    <div v-if="cartItems.length === 0" class="text-center py-12  mx-auto bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-8">Carrito de compras</h1>

      <Icon name="heroicons:shopping-cart" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 class="text-2xl font-medium text-gray-500 mb-4">Tu carrito está vacío</h2>
      <p class="text-gray-500 mb-6">Añade productos a tu carrito para continuar</p>
      <NuxtLink to="/" class="btn px-6 py-3">Continuar comprando</NuxtLink>
    </div>

    <template v-else>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto w-lg-1/2 w-full shadow-md ">

        <div class="md:col-span-3">

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 bg-gray-50 border-b border-gray-200">
              <h2 class="text-2xl font-bold">Carrito de compras</h2>
            </div>

            <div class="divide-y divide-gray-200 px-10 mx-auto border-b mb-4">
              <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
            </div>
            <div
              class="lg:w-3/4 w-full mx-auto flex  gap-5 flex-col md:flex-row items-center justify-center p-6 bg-gray-50 border-gray-200">
              <NuxtLink to="/"
                class="block  w-full  py-3 text-center text-gray-400 rounded-full border-2  hover:underline border-gray-300">
                <p>Regresar</p>
              </NuxtLink>
              <NuxtLink 
              to="/checkout"
              class="btn w-full py-3 text-lg  rounded-full text-center   border-2 "
              >
                Continuar
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-semibold mb-6">Resumen de compra</h2>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>s/{{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Envío</span>
                <span>s/0.00</span>
              </div>
              <div class="border-t border-gray-200 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span class="text-primary">s/{{ cartTotal.toFixed(2) }}</span>
              </div>
            </div>
            
         
          </div>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { cartItems, cartTotal, cartItemCount } = storeToRefs(cartStore);
</script>