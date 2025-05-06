<template>
  <header class="bg-white shadow-md">
    <!-- Top Header -->
    <div class="container-custom py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img src="/images/logo.svg" alt="ProBusiness Logo" class="h-10">
      </NuxtLink>

      <!-- Search Bar -->
      <SearchBar />

      <!-- User Actions -->
      <div class="flex items-center gap-4">
        <button class="flex items-center text-sm font-medium text-gray-700 hover:text-primary">
          <Icon name="heroicons:user-circle" class="w-6 h-6 mr-1" />
          Iniciar sesión
        </button>
        <CartButton />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-secondary text-white">
      <div class="container-custom">
        <ul class="flex items-center">
          <li class="relative group">
            <button class="nav-link py-3 flex items-center">
              Todas las categorías
              <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" />
            </button>
            <div class="absolute z-10 left-0 top-full bg-white text-secondary shadow-lg rounded-b-md w-64 hidden group-hover:block">
              <ul>
                <li v-for="category in categories" :key="category.id">
                  <NuxtLink :to="`/category/${category.slug}`" class="block px-4 py-2 hover:bg-gray-100 ">
                    {{ category.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li v-for="category in categories" :key="category.id">
            <NuxtLink :to="`/category/${category.slug}`" class="nav-link py-3 px-10 block">
              {{ category.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Social Media Dropdown -->
    <div class="fixed right-0 top-1/4 z-10">
      <div class="relative group">
        <button class="bg-gray-200 p-2 rounded-l-md">
          <Icon name="heroicons:share" class="w-6 h-6 text-secondary" />
        </button>
        <div class="absolute right-full top-0 bg-white shadow-lg rounded-l-md w-48 hidden group-hover:block">
          <ul class="py-2">
            <li v-for="social in socialMedia" :key="social.name" class="hover:bg-gray-100">
              <a :href="social.url" class="flex items-center px-4 py-2">
                <Icon :name="social.icon" class="w-5 h-5 mr-2" /> {{ social.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const socialMedia = [
  { name: 'Instagram', url: '#', icon: 'mdi:instagram' },
  { name: 'Facebook', url: '#', icon: 'mdi:facebook' },
  { name: 'Youtube', url: '#', icon: 'mdi:youtube' },
  { name: 'Tiktok', url: '#', icon: 'mdi:tiktok' }
];

// Ensure categories are loaded
onMounted(() => {
  categoryStore.fetchCategories();
});
</script>