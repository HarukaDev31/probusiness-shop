<template>
  <footer class="bg-black text-white pt-12 pb-6  px-3">
    <div class="container-custom max-w-[1440px] mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-gray-700">
        <div class="flex items-center gap-4">
          <img src="/images/logo-white.svg" alt="ProBusiness Logo" class="h-12 md:h-16" loading="lazy" />
        </div>
        <div class="text-sm text-gray-300 max-w-md md:text-left text-center">
          Importadora líder con comunidad sólida y estándares profesionales destacados, comprometida con la excelencia en importación.
        </div>
      </div>
      <div class="mt-6 text-center text-xs text-gray-400">
        <ClientOnly>
          <p>&copy; {{ currentYear }} ProBusiness. Todos los derechos reservados.</p>
        </ClientOnly>
      </div>
    </div>
  </footer>
</template>

<script setup>

import { useCategoryStore } from '~/stores/category';

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories)

const currentYear = computed(() => new Date().getFullYear());

const socialMedia = [
  { name: 'Instagram', url: '#', icon: 'mdi:instagram' },
  { name: 'Facebook', url: '#', icon: 'mdi:facebook' },
  { name: 'Youtube', url: '#', icon: 'mdi:youtube' },
  { name: 'Tiktok', url: '#', icon: 'mdi:tiktok' }
];
</script>