<template>
  <footer class="bg-secondary text-white py-8 mt-12">
    <div class="container-custom">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">ProBusiness</h3>
          <p class="text-sm">Tu tienda online con productos de alta calidad para todas tus necesidades.</p>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Enlaces rápidos</h3>
          <ul class="space-y-2">
            <li v-for="category in categories.slice(0, 5)" :key="category.id">
              <NuxtLink :to="`/category/${category.slug}`" class="text-sm hover:text-primary">
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Contacto</h3>
          <p class="text-sm mb-2">Correo: info@probusiness.com</p>
          <p class="text-sm mb-4">Teléfono: +51 123 456 789</p>
          <div class="flex space-x-4">
            <a v-for="social in socialMedia" :key="social.name" :href="social.url" class="text-white hover:text-primary">
              <Icon :name="social.icon" class="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div class="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
        <ClientOnly>
          <p>&copy; {{ currentYear }} ProBusiness. Todos los derechos reservados.</p>
        </ClientOnly>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const currentYear = computed(() => new Date().getFullYear());

const socialMedia = [
  { name: 'Instagram', url: '#', icon: 'mdi:instagram' },
  { name: 'Facebook', url: '#', icon: 'mdi:facebook' },
  { name: 'Youtube', url: '#', icon: 'mdi:youtube' },
  { name: 'Tiktok', url: '#', icon: 'mdi:tiktok' }
];
</script>