<template>
  <header class="bg-white shadow-md">
    <!-- Top Header -->
    <div class="container-custom py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <NuxtImg src="/images/logo.svg" alt="ProBusiness Logo" class="h-10"/>
      </NuxtLink>

      <!-- Search Bar -->
      <SearchBar />

      <!-- User Actions -->
      <div class="flex items-center gap-4">
        <div v-if="userName" class="relative group flex items-center gap-2 text-sm font-medium text-gray-700">
          <button class="flex items-center gap-2 focus:outline-none">
            <span>Hola, {{ userName }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md hidden group-hover:block z-20">
            <button @click="logout" class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Cerrar sesión</button>
          </div>
        </div>
        <div v-else>
          <NuxtLink to="/login" class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-500">
            <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.4998 24.0007V21.4451C21.4998 20.0895 20.973 18.7895 20.0353 17.831C19.0977 16.8725 17.8259 16.334 16.4998 16.334H6.49982C5.17373 16.334 3.90196 16.8725 2.96428 17.831C2.0266 18.7895 1.49982 20.0895 1.49982 21.4451V24.0007" stroke="#272A30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.4998 11.2222C14.2612 11.2222 16.4998 8.9339 16.4998 6.11111C16.4998 3.28832 14.2612 1 11.4998 1C8.73839 1 6.49982 3.28832 6.49982 6.11111C6.49982 8.9339 8.73839 11.2222 11.4998 11.2222Z" stroke="#272A30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Iniciar sesión
          </NuxtLink>
        </div>
        <CartButton />
        <!-- dropdown redes with first red instagram-->
        <div class="relative group">
          <button class=" p-2 rounded-l-md flex items-center gap-2 bg-white text-secondary  hover:bg-gray-100">
            <Icon name="mdi:instagram" class="w-6 h-6 text-secondary" />
            <!-- arrow bottom-->
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-secondary" />
          </button>
          <div class="absolute  top-10 bg-white shadow-lg rounded-l-md w-48 hidden group-hover:block z-10">
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
    </div>

    <!-- Navigation -->
    <nav class="bg-secondary text-white">
      <div class="container-custom">
        <!-- Mobile menu button -->
        <div class="flex justify-between items-center py-3 md:hidden">
          <div  class="mobile-menu-button flex items-center justify-between w-full">
            <span class="text-white">Menú</span>
            <Icon  @click="toggleMobileMenu" :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6 ml-2 text-white" />
          </div>
        </div>

        <!-- Desktop menu -->
        <ul class="hidden md:flex items-center flex-row">
          <li class="relative group">
            <button class="nav-link py-3 flex items-center">
              Todas las categorías
              <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" />
            </button>
            <div class="absolute z-10 left-0 top-full bg-white text-secondary shadow-lg rounded-b-md w-64 hidden group-hover:block">
              <ul class="py-2 max-h-60 overflow-y-auto">
                <li v-for="category in categories" :key="category.id">
                  <NuxtLink :to="`/category/${category.slug}`" class="block px-4 py-2 hover:bg-gray-100">
                    {{ category.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <!-- Desktop category links -->
          <li v-for="category in categories.slice(1, 9)" :key="category.id">
            <NuxtLink :to="`/category/${category.slug}`" class="nav-link py-3 px-10 block">
              {{ category.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Mobile menu (hidden by default) -->
        <div :class="['md:hidden', {'hidden': !mobileMenuOpen}]">
          <ul class="flex flex-col w-full">
            <!-- Mobile categories dropdown trigger -->
            <li class="relative">
              <button @click="toggleCategoriesDropdown" class="w-full text-left py-3 px-4 flex justify-between items-center border-b border-gray-700">
                Todas las categorías
                <Icon :name="categoriesOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-4 h-4" />
              </button>
              <!-- Mobile categories list -->
              <div v-if="categoriesOpen" class="bg-gray-800 w-full">
                <ul class="py-2 max-h-60 overflow-y-auto">
                  <li v-for="category in categories" :key="category.id">
                    <NuxtLink 
                      :to="`/category/${category.slug}`" 
                      class="block px-6 py-2 hover:bg-gray-700"
                      @click="closeAllMenus"
                    >
                      {{ category.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </li>
            <!-- Mobile direct category links -->
            <li v-for="category in categories.slice(1, 9)" :key="category.id">
              <NuxtLink 
                :to="`/category/${category.slug}`" 
                class="block py-3 px-4 border-b border-gray-700 hover:bg-gray-700"
                @click="closeAllMenus"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';
import { useUserStore } from '~/stores/user'
import { onMounted, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const userStore = useUserStore()
onMounted(() => {
  userStore.syncFromLocalStorage()
  window.addEventListener('storage', userStore.syncFromLocalStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', userStore.syncFromLocalStorage)
})
const userName = computed(() => userStore.name)

const socialMedia = [
  { name: 'Instagram', url: '#', icon: 'mdi:instagram' },
  { name: 'Facebook', url: '#', icon: 'mdi:facebook' },
  { name: 'Youtube', url: '#', icon: 'mdi:youtube' },
  { name: 'Tiktok', url: '#', icon: 'mdi:tik_tok' }
];

const mobileMenuOpen = ref(false);
const categoriesOpen = ref(false);
const router = useRouter()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    categoriesOpen.value = false;
  }
};

const toggleCategoriesDropdown = () => {
  categoriesOpen.value = !categoriesOpen.value;
};

const closeAllMenus = () => {
  mobileMenuOpen.value = false;
  categoriesOpen.value = false;
};

function logout() {
  userStore.logout()
  router.push('/login')
}

// Close menus when window is resized
const handleResize = () => {
  if (window.innerWidth >= 768) { // md breakpoint
    closeAllMenus();
  }
};

// Ensure categories are loaded and set up resize listener
onMounted(() => {
  categoryStore.fetchCategories();
  window.addEventListener('resize', handleResize);
});

// Clean up resize listener
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>