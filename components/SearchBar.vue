<template>
  <div class="relative w-full ">
    <input 
      type="text" 
      placeholder="Escribe el nombre de lo que buscas" 
      class="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-primary md:text-lg text-sm"
      v-model="searchQuery"
      @keyup.enter="search"
    >
    <button 
      class="absolute right-0 top-0 bg-primary text-white h-4/5 my-1 px-2 mx-1 rounded-md flex items-center justify-center"
      @click="search"
    >
      <Icon name="heroicons:magnifying-glass" class="w-7 h-7" />
    </button>
  </div>
</template>

<script setup>
const router = useRouter();
const searchQuery = ref('');
import { watch } from 'vue'

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath === '/') {
      searchQuery.value = ''
    }
  }
)

const search = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};
</script>