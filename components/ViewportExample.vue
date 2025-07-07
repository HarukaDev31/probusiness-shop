<template>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Estado del Viewport</h3>
    
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="isMobile ? 'bg-red-500' : 'bg-gray-300'"></div>
        <span class="text-sm">Móvil: {{ isMobile ? 'Sí' : 'No' }}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="isTablet ? 'bg-yellow-500' : 'bg-gray-300'"></div>
        <span class="text-sm">Tablet: {{ isTablet ? 'Sí' : 'No' }}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="isDesktop ? 'bg-green-500' : 'bg-gray-300'"></div>
        <span class="text-sm">Desktop: {{ isDesktop ? 'Sí' : 'No' }}</span>
      </div>
      
      <div class="text-sm text-gray-600 mt-4">
        <p>Ancho: {{ windowWidth }}px</p>
        <p>Alto: {{ windowHeight }}px</p>
      </div>
    </div>
    
    <!-- Ejemplo de contenido condicional -->
    <div class="mt-6">
      <div v-if="isMobile" class="bg-blue-100 p-3 rounded">
        <p class="text-sm">Contenido específico para móvil</p>
      </div>
      
      <div v-else-if="isTablet" class="bg-yellow-100 p-3 rounded">
        <p class="text-sm">Contenido específico para tablet</p>
      </div>
      
      <div v-else class="bg-green-100 p-3 rounded">
        <p class="text-sm">Contenido específico para desktop</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Usar el composable de viewport
import { useScreenSize } from '~/composables/useScreenSize';
const { isMobile, isTablet, isDesktop, windowWidth, windowHeight } = useScreenSize();
</script> 