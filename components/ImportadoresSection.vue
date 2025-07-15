<template>
  <section class="bg-white pt-8 pb-20 mb-[-50px] h-full">
    <div class="container-custom max-w-[1440px] mx-auto py-5 pl-5">
      <h2 class="text-center py-5 text-xl md:text-2xl font-semibold mb-6">Importadores que trabajan con nosotros</h2>
      <Swiper
        :slides-per-view="3.5"
        :space-between="12"
        :breakpoints="{
          450: { slidesPerView: 4.2, spaceBetween: 12 },
          480: { slidesPerView: 4.8, spaceBetween: 16 },
          640: { slidesPerView: 5.5, spaceBetween: 18 },
          1024: { slidesPerView: 6, spaceBetween: 20 },
          1280: { slidesPerView: 7, spaceBetween: 24 },
          1440: { slidesPerView: 9, spaceBetween: 24 }
        }"
        :scrollbar="{ draggable: true }"
        class="brands-swiper "
      >
        <SwiperSlide v-for="brand in brands" :key="brand.name" class="flex items-center justify-center">
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="max-h-8 h-auto w-auto grayscale opacity-80 hover:opacity-100 transition mx-1"
            style="max-width:90px; object-fit:contain;"
            loading="lazy"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';

const brands = [
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'GoPro', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/GoPro_logo_light.svg/1920px-GoPro_logo_light.svg.png' },
  { name: 'PlayStation', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/200px-PlayStation_logo.svg.png' },
  { name: 'Xbox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Xbox_Logo.svg/372px-Xbox_Logo.svg.png' },
  { name: 'Casio', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Casio_logo.svg' },
  { name: 'Canon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Canon_logo.svg' },
  { name: 'Nikon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Nikon_logo3.jpg' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png' },
  { name: 'Levis', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg' },
];
</script>
<style scoped>
.brands-swiper {
  padding-bottom: 24px; /* Espacio para el scrollbar */
}
.brands-swiper .swiper-scrollbar {
  position: absolute !important;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 6px;
  margin-top: 0;
}
</style>