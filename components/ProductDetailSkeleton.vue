<template>
  <div class="container-custom py-8">
    <!-- Breadcrumb skeleton -->
    <div class="mb-2">
      <div class="h-4 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <!-- Columna galería + nombre skeleton -->
      <div class="col-span-12 md:col-span-6">
        <!-- Título skeleton -->
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
        
        <div class="flex flex-row">
          <!-- Imágenes laterales skeleton -->
          <div class="flex flex-col space-y-4 relative">
            <div class="relative max-h-[25em] flex justify-center">
              <!-- Thumbnails skeleton -->
              <div class="flex flex-col space-y-4 max-h-[25em]  pt-8 pb-8">
                <div v-for="i in 5" :key="i" class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <!-- Imagen principal skeleton -->
          <div class="bg-white rounded-lg shadow-md p-6 flex-1 flex items-center justify-center ml-4 relative">
            <!-- Corazón favoritos skeleton -->
            <div class="absolute top-5 right-5 w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            
            <!-- Imagen principal skeleton -->
            <div class="aspect-square w-full max-w-[350px] max-h-[350px] bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <!-- Panel derecho skeleton -->
      <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6">
        <!-- Título "Cantidades" skeleton -->
        <div class="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        
        <!-- Tabla de precios skeleton -->
        <div class="my-6">
          <div class="grid grid-cols-4 gap-4 pt-4">
            <div v-for="i in 4" :key="i" class="flex flex-col items-center">
              <div class="h-3 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
              <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <!-- Botones skeleton -->
        <div class="flex flex-col md:flex-row gap-4 mb-6 py-8">
          <div class="w-full md:w-1/2 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="w-full md:w-1/2 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No necesitamos props ni lógica para el skeleton
</script> 