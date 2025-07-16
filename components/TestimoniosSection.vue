<template>
  <section class="py-10">
    <div class="container-custom max-w-[1440px] mx-auto">
      <h2 class="text-2xl font-bold mb-6">Testimonios de nuestros clientes</h2>
      <Swiper
        :slides-per-view="1.3"
        :space-between="16"
        :breakpoints="{
          360: { slidesPerView: 1.8 },
          480: { slidesPerView: 2.2 },
          640: { slidesPerView: 2.5 },

          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 }
        }"
        :scrollbar="{ draggable: true }"
        class="testimonios-swiper"
      >
        <SwiperSlide
          v-for="testimonio in testimonios"
          :key="testimonio.id"
        >
          <div class="bg-white rounded-xl shadow overflow-hidden flex flex-col items-center relative group h-full mx-auto max-w-xs sm:max-w-sm">
            <div class="relative w-full aspect-[9/16] flex items-center justify-center bg-gray-100">
              <img
                :src="testimonio.thumbnail || defaultThumbnail"
                :alt="testimonio.nombre"
                class="object-cover w-full h-full"
                @error="event => event.target.src = defaultThumbnail"
                @load="handleImageLoad"
              />
              <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div class="text-gray-500 text-center">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <p class="text-sm">{{ testimonio.nombre }}</p>
                </div>
              </div>
              <button
                class="absolute inset-0 flex items-center justify-center focus:outline-none"
                @click="openModal(testimonio.tiktokUrl)"
                aria-label="Ver testimonio"
              >
                <svg class="w-16 h-16 text-white bg-black bg-opacity-50 rounded-full p-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-lg relative p-0 w-full max-w-md">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10" @click="closeModal">&times;</button>
        <div class="aspect-w-9 aspect-h-16 w-full">
          <iframe
            v-if="modalTiktokUrl"
            :src="modalTiktokUrl"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
            class="w-full h-full rounded-b-lg"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';

const defaultThumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5SaY5SpcvkbuONkzR3lXbHCFKDEUef2z8f6tpvcLH2dKKuXFMg3gyk2av2qs2C2o0tHk';

const testimonios = [

  {
    id: 2,
    nombre: 'IMPORTADOR ARIEL MEDINA',
    thumbnail: 'https://intranet.probusiness.pe/assets/testimonios/arielmedina.webp',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7501137755292962056'
  },
  {
    id: 3,
    nombre: 'IMPORTADOR RODRIGO',
    thumbnail: 'https://intranet.probusiness.pe/assets/testimonios/rodrigo.webp',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7495945030528503047'
  },
  {
    id: 4,
    nombre: 'IMPORTADOR WILLY',
    thumbnail: 'https://intranet.probusiness.pe/assets/testimonios/willy.webp',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7490750609021324551'
  },
  {
    id: 5,
    nombre: 'IMPORTADOR PERCY ACUÑA',
    thumbnail: 'https://intranet.probusiness.pe/assets/testimonios/percy.webp',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7485545802073525512'
  },
  {
    id: 1,
    nombre: 'ALUMNO DE CHINA',
    thumbnail: 'https://intranet.probusiness.pe/assets/testimonios/alumnochino_1.webp',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7518214656066915602'
  },
];

const showModal = ref(false);
const modalTiktokUrl = ref('');
const imageLoaded = ref(false);

function openModal(url) {
  modalTiktokUrl.value = url;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  modalTiktokUrl.value = '';
}

function handleImageLoad() {
  imageLoaded.value = true;
}
</script>

<style scoped>
.aspect-w-9 {
  position: relative;
  width: 100%;
  padding-bottom: 177.77%; /* 9:16 vertical */
  background: #000;
}
.aspect-w-9 > * {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
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