<template>
  <section class="py-10">
    <div class="container-custom max-w-[1440px] mx-auto">
      <h2 class="text-2xl font-bold mb-6">Testimonios de nuestros clientes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="testimonio in testimonios"
          :key="testimonio.id"
          class="bg-white rounded-xl shadow overflow-hidden flex flex-col items-center relative group"
        >
          <div class="relative w-full h-full flex items-center justify-center bg-gray-100">
            <img
              :src="testimonio.thumbnail"
              :alt="testimonio.nombre"
              class="object-cover w-full h-full"
            />
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
          <div class="p-4 w-full text-center font-semibold text-sm text-gray-700">
            {{ testimonio.nombre }}
          </div>
        </div>
      </div>
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

const testimonios = [
  {
    id: 1,
    nombre: 'EL IMPORTADOR',
    thumbnail: 'https://probusiness.pe/assets/img/home/cliente_2.jpg',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7520395148686150934'
  },
  {
    id: 2,
    nombre: 'KRISTEL SÁNCHEZ',
    thumbnail: 'https://probusiness.pe/assets/img/nosotros/team_miguel.jpeg',
    tiktokUrl: 'https://www.tiktok.com/embed/v2/7520395148686150934'
  },
  // ...agrega más testimonios aquí
];

const showModal = ref(false);
const modalTiktokUrl = ref('');

function openModal(url) {
  modalTiktokUrl.value = url;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  modalTiktokUrl.value = '';
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
</style>
