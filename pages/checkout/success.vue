<template>
    <div class="container-custom py-12">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:check" class="w-8 h-8 text-green-500" />
        </div>
        
        <h1 class="text-2xl font-bold mb-2">Pedido realizado</h1>
        <p class="text-gray-600 mb-2">¡Gracias por confiar en nosotros!</p>
        <p class="text-sm text-gray-500 mb-8">
          Su pedido se ha realizado con éxito, en unos minutos le llegará a su correo la información.
          <br>
          Será derivado a WhatsApp para ser atendido por uno de nuestros asesores.
        </p>
  
        <div class="flex gap-4">
          <NuxtLink 
            to="/"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Volver al inicio
          </NuxtLink>
          <a 
            href="https://wa.me/51123456789"
            target="_blank"
            class="flex-1 btn py-3"
          >
            Ir a WhatsApp
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const router = useRouter();
  
  onMounted(() => {
    // If user tries to access success page directly, redirect to home
   
  });
  </script>