<template>
  <div class="relative h-96 bg-gray-200 overflow-hidden">
    <!-- Slideshow -->
    <div class="absolute inset-0">
      <img 
        v-for="(slide, index) in slides" 
        :key="slide.id"
        :src="slide.image"
        :alt="slide.title"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        :class="{ 'opacity-0': currentSlide !== index, 'opacity-100': currentSlide === index }"
      >
    </div>
    
    <!-- Navigation dots -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="currentSlide = index"
        class="w-3 h-3 rounded-full transition-colors duration-300"
        :class="currentSlide === index ? 'bg-primary' : 'bg-white bg-opacity-50'"
      ></button>
    </div>
  </div>
</template>

<script setup>
const slides = [
  { 
    id: 1, 
    title: 'Productos electrónicos', 
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
  },
  { 
    id: 2, 
    title: 'Productos para el hogar', 
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
  },
  { 
    id: 3, 
    title: 'Mascotas', 
    image: 'https://images.pexels.com/photos/4588047/pexels-photo-4588047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
  },
  { 
    id: 4, 
    title: 'Productos de belleza', 
    image: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
  }
];

const currentSlide = ref(0);

// Auto-advance slideshow
onMounted(() => {
  const interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>