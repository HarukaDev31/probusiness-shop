<template>
  <div class="py-8">
    <div class="container-custom max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
        <button
          v-for="category in categories"
          :key="category.id"
          class="bg-white rounded-xl shadow flex flex-row items-stretch min-h-[220px] md:min-h-[260px] h-[220px] md:h-[260px] relative overflow-hidden outline-none group transition-all duration-300 p-0"
          @click="$router.push(`/category/${category.slug}`)"
          type="button"
        >
          <div class="flex flex-col justify-between flex-1 pl-8 py-10">
            <div class="font-bold text-2xl md:text-3xl text-left mb-2">{{ category.name }}</div>
            <span class="text-primary text-sm font-medium hover:underline mt-auto block text-left">
              Ver más+
            </span>
          </div>
          <div class="flex items-end justify-end relative w-[55%] h-full">
            <img
              v-if="category.img_url"
              :src="category.img_url"
              :alt="category.name"
              class="object-contain h-[90%] w-auto max-w-none absolute right-0 bottom-0 transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
            />
            <img
              v-else
              src="https://m.media-amazon.com/images/I/71vdTBiBEEL._AC_SL1500_.jpg"
              alt="Sin imagen"
              class="object-contain h-[90%] w-auto max-w-none absolute right-0 bottom-[-25px] transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true }
});
</script>
