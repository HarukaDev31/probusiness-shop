<template>
  <section class="bg-white pt-8 pb-20 mb-[-50px] h-full">
    <div class="container-custom max-w-[1440px] mx-auto py-5 pl-5">
      <h2 class="text-center py-5 text-xl md:text-2xl font-semibold mb-6">Marcas que trabajan con nosotros</h2>
      <Swiper
        :slides-per-view="3.5"
        :space-between="12"
        :breakpoints="{
          360: { slidesPerView: 4.2, spaceBetween: 12 },
          480: { slidesPerView: 4.8, spaceBetween: 16 },
          640: { slidesPerView: 5.5, spaceBetween: 18 },

          1024: { slidesPerView: 6, spaceBetween: 20 },
          1280: { slidesPerView: 7, spaceBetween: 24 },
          1440: { slidesPerView: 9, spaceBetween: 24 }
        }"
        :scrollbar="{ draggable: true }"
        class="brands-swiper "
      >
        <SwiperSlide v-for="brand in brands" :key="brand.name" class="flex items-center justify-center h-[100px]">
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="max-h-[80px] h-full w-auto grayscale opacity-80 hover:opacity-100 transition mx-1 object-contain"
            style="max-width:100px; object-fit:contain;"
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
  { name: 'AnaelProducciones', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/analeaproducciones.webp' },
  { name: 'Calico', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/calico.webp' },
  { name: 'Detallesconamorlima', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/detallesconamorlima.webp' },
  { name: 'Elmo', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/elmo.webp' },
  { name: 'Lartekafi', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/lartekafi.webp' },
  { name: 'Masternutricionperu', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/masternutricionperu.webp' },
  { name: 'Moqenko', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/moqenko.webp' },
  { name: 'Quebuenmate', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/quebuenmate.webp' },
  { name: 'Qurani', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/qurani.webp' },
  { name: 'Roadland', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/roadland.webp' },
  { name: 'Sashfajasmedicas', logo: 'https://intranet.probusiness.pe/assets/tienda/marcas/sashfajasmedicas.webp' },
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