<template>
  <section class="py-8">
    <div class="container-custom">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <NuxtLink :to="`/category/${slug}`" class="bg-black text-white px-10 py-2 text-sm flex items-center hover:underline">
          Ver más <Icon name="lucide:plus" class="w-3 h-3 ml-1" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCardSkeleton v-if="isLoading" v-for="i in 4" :key="i" />
        <ProductCard v-else
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
</script>