<template>
    <div class="product-card-skeleton flex flex-col h-full border border-gray-200 rounded-md overflow-hidden bg-white">
      <!-- Skeleton para la imagen -->
      <div class="relative pb-[100%] overflow-hidden bg-gray-100">
        <div class="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>
      </div>
      
      <div class="p-4 flex flex-col flex-grow">
        <!-- Skeleton para el título -->
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
        
        <!-- Skeleton para orden mínima -->
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
        
        <!-- Skeleton para precio -->
        <div class="h-8 bg-gray-200 rounded w-1/3 mt-auto animate-pulse"></div>
        
        <!-- Skeleton para botón (opcional, comentado por consistencia) -->
        <!-- <div class="h-10 bg-gray-200 rounded w-full mt-3 animate-pulse"></div> -->
      </div>
    </div>
  </template>
  
  <script setup>
  // Sin props ni lógica, ya que es un componente puramente visual
  </script>
  
  <style scoped>
  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.9;
    }
  }
  
  .animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>