<template>
  <section class="py-8">
    <div class="container-custom max-w-[1440px] mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
      </div>
      <div class="relative">
        <div v-if="!isLoading">
          <!-- Vista mobile: Slider con scroll parcial -->
          <div v-if="isMobile">
            <Swiper
              :modules="[Navigation]"
              :slides-per-view="1.3"
              :space-between="12"
              :navigation="false"
              class="mobile-product-swiper"
            >
              <SwiperSlide v-for="product in products" :key="product.id">
                <ProductCard :product="product" />
              </SwiperSlide>
            </Swiper>
          </div>
          
          <!-- Vista desktop: Slider -->
          <div v-else>
            <Swiper
              :modules="[Navigation, Scrollbar]"
              :slides-per-view="4"
              :breakpoints="{
                768: {
                  slidesPerView: 2
                },
                1024: {
                  slidesPerView: 3
                },
                1280: {
                  slidesPerView: 4
                }
              }"
              :scrollbar="{ draggable: true }"
              :space-between="24"
              :navigation="navigationOptions"
              :slides-per-group="1"
              :watch-overflow="true"
              class="product-swiper"
              @swiper="onSwiper"
            >
              <SwiperSlide v-for="product in products" :key="product.id">
                <ProductCard :product="product" />
              </SwiperSlide>
            </Swiper>
          </div>
          <button
            v-if="products.length > 4 && isDesktop"
            ref="prevEl"
            class="swiper-button-prev custom-swiper-nav"
            type="button"
          >
            <span class="sr-only">Anterior</span>
            <svg width="24" height="24" fill="none"><rect x="0" y="0" width="24" height="24" rx="8" fill="#fff"/><path d="M14.5 8l-4 4 4 4" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button
            v-if="products.length > 4 && isDesktop"
            ref="nextEl"
            class="swiper-button-next custom-swiper-nav"
            type="button"
          >
            <span class="sr-only">Siguiente</span>
            <svg width="24" height="24" fill="none"><rect x="0" y="0" width="24" height="24" rx="8" fill="#fff"/><path d="M9.5 8l4 4-4 4" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div v-else>
          <!-- Skeleton mobile: 2 columnas -->
          <div v-if="isMobile" class="grid grid-cols-2 gap-4">
            <ProductCardSkeleton v-for="i in 4" :key="i" />
          </div>
          
          <!-- Skeleton desktop: 4 columnas -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton v-for="i in 4" :key="i" />
          </div>
        </div>
        <!--ver mas only mobile-->
        <div class="flex justify-center bg-white rounded-lg shadow-sm border p-4 items-center mt-6" v-if="isMobile">
          <NuxtLink :to="`/category/${slug}`" class="text-blue-500 text-sm flex items-center hover:underline font-medium">
            Ver más <Icon name="lucide:plus" class="w-3 h-3 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
const { isMobile, isTablet, isDesktop } = useScreenSize();
const props = defineProps({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  products: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  sliderId: { type: String, required: true }
});

const prevEl = ref(null);
const nextEl = ref(null);

const navigationOptions = computed(() =>
  props.products.length > 4
    ? { prevEl: prevEl.value, nextEl: nextEl.value }
    : false
);

function onSwiper(swiper) {
  // Swiper navigation needs to be updated after refs are set
  nextTick(() => {
    if (props.products.length > 4) {
      swiper.params.navigation.prevEl = prevEl.value;
      swiper.params.navigation.nextEl = nextEl.value;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  });
}
</script>

<style scoped>
/* Personaliza las flechas Swiper para que sean redondas, blancas y centradas */
.custom-swiper-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;         /* Cuadrado con esquinas suaves */
  background: #fff;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  transition: box-shadow 0.2s;
  opacity: 1;
  cursor: pointer;
  padding: 0;
}
.swiper-button-prev.custom-swiper-nav {
  left: -56px;                /* Más separado del slider */
}
.swiper-button-next.custom-swiper-nav {
  right: -56px;               /* Más separado del slider */
}
.custom-swiper-nav svg {
  display: block;
  margin: 0;
  width: 24px;
  height: 24px;
}
.custom-swiper-nav:active {
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}
.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after,.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after {
  content: none; /* Oculta el texto por defecto */
  display: none; /* Asegura que no se muestre */
}
</style>