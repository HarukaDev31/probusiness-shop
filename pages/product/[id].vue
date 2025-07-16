<template>
  <div class="container-custom py-8">
    <!-- Flecha para regresar (solo mobile, arriba del contenido) -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-gray-700 hover:text-primary mb-4"
      aria-label="Regresar"
      type="button"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      <span>Regresar</span>
    </button>
    <ProductDetailSkeleton v-if="loading" />

    <template v-else-if="product">
      <!-- Breadcrumb -->
      <div class="mb-2" v-if="!isMobile">
        <nav class="text-sm text-gray-400 mb-1">
          <span v-if="product.category_name">{{ product.category_name }}</span>
          <span v-if="product.category_name"> &gt; </span>
          <span class="text-gray-400">{{ product.nombre }}</span>
        </nav>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Columna galería + nombre -->
        <div class="col-span-12 md:col-span-6">
          <h1 class="text-xl font-bold text-gray-900 leading-tight mb-4 hidden md:block">{{ product.nombre }}</h1>
          
          <!-- Vista Desktop -->
          <div class="hidden md:flex flex-row">
            <!-- Imágenes laterales -->
            <div class="flex flex-col space-y-4 relative">
              <div class="relative max-h-[25em] flex justify-center">
                <!-- Flecha arriba flotante -->
                <div v-if="mediaItems.length > 5"
                  class="floating-button absolute top-0 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-110"
                  @mouseenter="startAutoScrollUp" @mouseleave="stopAutoScroll">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-600 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </div>

                <!-- Contenedor scrolleable -->
                <div ref="thumbnailContainer"
                  class="flex flex-col space-y-4 max-h-[25em] overflow-y-auto scrollbar-hide pt-8 pb-8"
                  :class="{ 'pr-2': mediaItems.length > 5 }" @scroll="handleScroll">
                  <div v-for="(media, index) in mediaItems" :key="index"
                    class="flex-shrink-0 aspect-square overflow-hidden rounded-md cursor-pointer border-2 w-16 h-16 md:w-16 md:h-16"
                    :class="{ 'border-primary': activeMediaIndex === index }" @mouseover="activeMediaIndex = index">
                    <NuxtImg v-if="media.type === 'image'" :src="media.url" :alt="product.nombre"
                      class="w-full h-full object-contain" />
                    <video v-else :src="media.url" :alt="product.nombre" class="w-full h-full object-contain" muted
                      loop></video>
                  </div>
                </div>

                <!-- Flecha abajo flotante -->
                <div v-if="mediaItems.length > 5"
                  class="floating-button absolute bottom-0 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-110"
                  @mouseenter="startAutoScrollDown" @mouseleave="stopAutoScroll">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-600 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <!-- Imagen principal con overlay relativo -->
            <div class="bg-white rounded-lg shadow-md flex-1 flex items-center justify-center ml-4 relative max-w-2xl h-[500px]">
              <div class="w-full h-full relative flex items-center justify-center">
                <!-- Corazón favoritos -->

                <!-- Flecha izquierda -->
                <button v-if="mediaItems.length > 1" @click="prevMedia"
                  class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                
                <NuxtImg v-if="activeMedia.type === 'image'" :src="activeMedia.url" :alt="product.nombre"
                  class="object-contain w-full h-full max-w-full max-h-full" />
                <div v-else-if="activeMedia.type === 'video'" class="w-full h-full flex items-center justify-center">
                  <video :src="activeMedia.url" :alt="product.nombre"
                    class="object-cover w-full h-full" autoplay muted loop
                    controls preload="metadata" @error="handleVideoError" @loadstart="handleVideoLoadStart"
                    crossorigin="anonymous">
                    <source :src="activeMedia.url" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                  </video>
                  <!-- Loading state -->
                  <div v-if="videoLoading"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div class="text-center p-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p class="text-gray-600 text-sm">Cargando video...</p>
                    </div>
                  </div>

                  <!-- Fallback para videos bloqueados -->
                  <div v-if="videoError"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div class="text-center p-4">
                      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                        </path>
                      </svg>
                      <p class="text-gray-600 text-sm">Video no disponible</p>
                      <p class="text-gray-400 text-xs mt-1">El contenido está protegido por Alibaba</p>
                      <button @click="loadVideo(activeMedia.url)"
                        class="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark transition">
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <WishlistButton :product="product" class="absolute top-4 right-4 z-30" />

              <!-- Flecha derecha -->
              <button v-if="mediaItems.length > 1" @click="nextMedia"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Vista Mobile -->
          <div class="md:hidden">
            <!-- Slider principal -->
            <div class="relative bg-white rounded-lg shadow-md">
              <Swiper
                :modules="[Scrollbar]"
                :slides-per-view="1"
                :space-between="0"
                :scrollbar="{ draggable: true }"
                class="w-full h-[300px] rounded-lg"
                @slideChange="(swiper) => activeMediaIndex = swiper.activeIndex"
              ><SwiperSlide v-for="(media, idx) in mediaItems" :key="idx">
                <!-- Wishlist en la esquina superior derecha -->
                <WishlistButton :product="product" class="absolute top-4 right-4 z-30" />
                
                <NuxtImg v-if="media.type === 'image'" :src="media.url" :alt="product.nombre"
                  class="object-contain w-full h-full max-w-full max-h-full" />
                <div v-else-if="activeMedia.type === 'video'" class="w-full h-full flex items-center justify-center">
                  <video :src="activeMedia.url" :alt="product.nombre"
                    class="object-cover w-full h-full" autoplay muted loop
                    controls preload="metadata" @error="handleVideoError" @loadstart="handleVideoLoadStart"
                    crossorigin="anonymous">
                    <source :src="activeMedia.url" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                  </video>
                  <!-- Loading state -->
                  <div v-if="videoLoading"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div class="text-center p-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p class="text-gray-600 text-sm">Cargando video...</p>
                    </div>

                    <!-- Fallback para videos bloqueados -->
                    <div v-if="videoError"
                      class="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div class="text-center p-4">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                          </path>
                        </svg>
                        <p class="text-gray-600 text-sm">Video no disponible</p>
                        <p class="text-gray-400 text-xs mt-1">El contenido está protegido por Alibaba</p>
                        <button @click="loadVideo(media.url)"
                          class="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark transition">
                          Reintentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </SwiperSlide>
              </Swiper>

              
              <!-- Contador en la parte inferior -->
              <div class="absolute bottom-4 left-4 z-40">
                <!-- Contador de imágenes -->
                <div class="bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {{ activeMediaIndex + 1 }} / {{ mediaItems.length }}
                </div>
              </div>
            </div>
            <!-- Nombre del producto centrado solo en mobile -->
            <h1 class="text-lg font-bold text-gray-900 leading-tight my-4 block md:hidden">
              {{ product.nombre }}
            </h1>

          </div>
        </div>
        <!-- Panel derecho -->
        <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6">
          <h5 class="text-2xl font-bold text-gray-800 mb-4">Cantidades</h5>
          <!-- Tabla de precios horizontal -->
          <div v-if="product.prices_range && product.prices_range.length > 0" class="my-4">
            <div class="flex overflow-x-auto gap-4 pt-4 pb-2">
              <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity"
                class="flex flex-col items-center flex-shrink-0 min-w-[120px]">
                <div class="text-xs text-gray-500 mb-1 text-center break-words">{{ price.quantity }}</div>
                <div class="text-2xl font-bold text-gray-800">{{ $formatPrice(price.price) }}</div>
              </div>
            </div>
          </div>
          <!-- Botones Desktop -->
          <div class="hidden md:flex flex-col md:flex-row gap-4 mb-6 py-8">
            <button @click="iniciarPedidoMinimo"
              class="w-full md:w-1/2 border border-gray-800 text-gray-900 font-semibold py-3 rounded-lg bg-white hover:bg-gray-100 transition">Añadir
              al carrito</button>
            <button @click="openCartPanel"
              class="w-full md:w-1/2 bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition">Iniciar pedido</button>
          </div>
          <!-- Panel lateral de carrito -->
          <div v-if="showCartPanel" class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
            @click.self="closeCartPanel"
            >
            <!-- Mobile: desde abajo -->
            <div class="md:hidden bg-white w-full h-[580px] shadow-xl p-8 flex flex-col rounded-t-lg absolute bottom-0" @click.stop>
              <div class="flex flex-col justify-between items-start my-3">
                <h2 class="text-lg font-bold">Selecciona la cantidad de tu interés</h2>
                <span class="text-gray-500 py-2"><b>*</b>Pedido mínimo de importación <b> s/3.000</b></span>
              </div>

              <div class="my-2">
                <h3 class="font-semibold my-2 text-xl">Cantidades</h3>
                <div class="flex overflow-x-auto gap-4 py-2">
                  <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity"
                    class="flex flex-col items-center flex-shrink-0 min-w-[120px]">
                    <div class="text-md text-gray-500 mb-1 text-center break-words">{{ price.quantity }}</div>
                    <div class="text-xl font-bold text-gray-800">{{ $formatPrice(price.price) }}</div>
                  </div>
                </div>
              </div>
              <div class="border-b-2 border-gray-300 rounded py-3"></div>
              <div class="my-2flex">
                <div class="flex flex-row items-center gap-8 my-6 w-full">
                  <div class="flex flex-col flex-1">
                    <span class="font-semibold mb-1 text-base sm:text-lg">Cantidad</span>
                    <div class="flex border rounded-lg overflow-hidden w-full max-w-[200px] justify-between">
                      <button
                        @click="cartQuantity = Math.max(getMinimumOrderQuantity() || 1, cartQuantity - 1)"
                        :disabled="cartQuantity <= (getMinimumOrderQuantity() || 1)"
                        class="w-12 h-12 flex items-center justify-center bg-gray-100 text-2xl font-bold disabled:opacity-50"
                      >-</button>
                      <input
                        type="number"
                        v-model.number="cartQuantity"
                        :min="getMinimumOrderQuantity() || 1"
                        class="w-20 text-center border-0 focus:ring-0 focus:outline-none text-xl font-bold"
                        @input="handleCartQuantityInput"
                      />
                      <button
                        @click="cartQuantity++"
                        class="w-12 h-12 flex items-center justify-center bg-gray-100 text-2xl font-bold"
                      >+</button>
                    </div>
                  </div>
                  <div class="flex flex-col flex-1">
                    <span class="font-semibold mb-1 text-base sm:text-lg">Total</span>
                    <div class="w-full max-w-[200px] h-12 flex items-center justify-center border rounded-lg bg-gray-50 font-bold text-2xl sm:text-3xl">
                      {{ $formatPrice(getPrecioPuestoEnPeru() * cartQuantity) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-b-2 border-gray-300 rounded my-3"></div>
              <div>
                <div class="flex flex-col gap-3 my-4">
                  <button v-if="!goToCart" @click="iniciarPedidoPanel" :disabled="cartQuantity < getMinimumOrderQuantity()"
                    :class="[
                      'w-full font-semibold py-6 rounded-lg transition',
                      cartQuantity < getMinimumOrderQuantity()
                        ? 'bg-orange-200 text-orange-700 cursor-not-allowed'
                        : 'bg-[#FF5000] text-white hover:bg-[#e04a00]'
                    ]">
                    Iniciar pedido
                  </button>
                  <span
                    v-if="cartQuantity < getMinimumOrderQuantity()"
                    class="text-red-600 text-sm font-semibold mt-2 block"
                  >
                    Debes colocar al menos la cantidad mínima: {{ getMinimumOrderQuantity() }}
                  </span>
                  <button v-if="goToCart"
                    class="w-full border border-gray-800 text-gray-900 font-semibold py-6 rounded-lg bg-white hover:bg-gray-100 transition"
                    @click="addToCartFromPanel">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Desktop: desde la derecha -->
            <div class="hidden md:block bg-white w-full max-w-md h-full shadow-xl p-8 flex flex-col" @click.stop>
              <div class="flex flex-col justify-between items-start mb-6">
                <h2 class="text-lg font-bold">Selecciona la cantidad de tu interés</h2>
                <span> Pedido mínimo de importación s/3.000</span>
              </div>

              <div class="mb-4">
                <h3 class="font-semibold mb-2">Cantidades</h3>
                <div class="flex overflow-x-auto gap-4 pb-2">
                  <div v-for="price in JSON.parse(product.prices_range ?? '[]')" :key="price.quantity"
                    class="flex flex-col items-center flex-shrink-0 min-w-[120px]">
                    <div class="text-xs text-gray-500 mb-1 text-center break-words">{{ price.quantity }}</div>
                    <div class="text-lg font-bold text-gray-800">{{ $formatPrice(price.price) }}</div>
                  </div>
                </div>
              </div>
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-semibold">Cantidad</span>
                  <div class="flex items-center gap-2">
                    <button @click="cartQuantity = Math.max(getMinimumOrderQuantity() || 1, cartQuantity - 1)"
                      :disabled="cartQuantity <= (getMinimumOrderQuantity() || 1)"
                      class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-2xl"
                      :class="{ 'opacity-50 cursor-not-allowed': cartQuantity <= (getMinimumOrderQuantity() || 1) }">
                      -
                    </button>
                    <input type="number" v-model.number="cartQuantity" :min="getMinimumOrderQuantity() || 1"
                      class="w-16 text-center border border-gray-200 rounded px-2 py-1"
                      @input="handleCartQuantityInput" />
                    <button @click="cartQuantity++"
                      class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-2xl">+</button>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-6">
                  <span class="font-semibold">Total</span>
                  <span class="text-lg font-bold">{{ $formatPrice(getPrecioPuestoEnPeru() * cartQuantity) }}</span>
                </div>
                <div class="flex flex-col gap-3">
                  <button v-if="!goToCart" @click="iniciarPedidoPanel" :disabled="cartQuantity < getMinimumOrderQuantity()"
                    :class="[
                      'w-full font-semibold py-3 rounded-lg transition',
                      cartQuantity < getMinimumOrderQuantity()
                        ? 'bg-orange-200 text-orange-700 cursor-not-allowed'
                        : 'bg-[#FF5000] text-white hover:bg-[#e04a00]'
                    ]">
                    Iniciar pedido
                  </button>
                  <span
                    v-if="cartQuantity < getMinimumOrderQuantity()"
                    class="text-red-600 text-sm font-semibold mt-2 block"
                  >
                    Debes colocar al menos la cantidad mínima: {{ getMinimumOrderQuantity() }}
                  </span>
                  <button v-if="goToCart"
                    class="w-full border border-gray-800 text-gray-900 font-semibold py-3 rounded-lg bg-white hover:bg-gray-100 transition"
                    @click="addToCartFromPanel">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Datos importantes -->
          <div class="mt-4 border-t pt-6 hidden md:block">
            <h3 class="font-bold text-gray-800 my-4">Datos importantes:</h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <!-- Icono precio -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.7425 0H2.42041C1.08258 0 0 1.08258 0 2.42041V7.70131C0 9.03914 1.08258 10.1217 2.42041 10.1217H14.7425C16.0803 10.1217 17.1629 9.03914 17.1629 7.70131V2.42041C17.1629 1.08258 16.0803 0 14.7425 0ZM2.42041 1.32022H3.35337C3.45019 1.52266 3.5206 1.7427 3.5206 1.98034C3.5206 2.82528 2.82528 3.5206 1.98034 3.5206C1.7427 3.5206 1.52266 3.45019 1.32022 3.35337V2.42041C1.32022 1.81311 1.81311 1.32022 2.42041 1.32022ZM1.32022 7.70131V4.75281C1.53146 4.80562 1.7515 4.84082 1.98034 4.84082C3.55581 4.84082 4.84082 3.55581 4.84082 1.98034C4.84082 1.7515 4.80562 1.53146 4.75281 1.32022H14.7425C15.3498 1.32022 15.8427 1.81311 15.8427 2.42041V5.36891C15.6315 5.31611 15.4114 5.2809 15.1826 5.2809C13.6071 5.2809 12.3221 6.56592 12.3221 8.14139C12.3221 8.37022 12.3573 8.59026 12.4101 8.8015H2.42041C1.81311 8.8015 1.32022 8.30861 1.32022 7.70131ZM14.7425 8.8015H13.8096C13.7127 8.59906 13.6423 8.37903 13.6423 8.14139C13.6423 7.29644 14.3376 6.60112 15.1826 6.60112C15.4202 6.60112 15.6403 6.67154 15.8427 6.76835V7.70131C15.8427 8.30861 15.3498 8.8015 14.7425 8.8015Z"
                      fill="#272A30" />
                    <path
                      d="M8.58252 2.64062C7.24469 2.64062 6.16211 3.72321 6.16211 5.06104C6.16211 6.39886 7.24469 7.48145 8.58252 7.48145C9.92035 7.48145 11.0029 6.39886 11.0029 5.06104C11.0029 3.72321 9.92035 2.64062 8.58252 2.64062ZM8.58252 6.16122C7.97522 6.16122 7.48233 5.66834 7.48233 5.06104C7.48233 4.45373 7.97522 3.96085 8.58252 3.96085C9.18982 3.96085 9.68271 4.45373 9.68271 5.06104C9.68271 5.66834 9.18982 6.16122 8.58252 6.16122Z"
                      fill="#272A30" />
                  </svg>
                </span>
                <div>
                  <span class="font-semibold">Sobre el precio</span><br>
                  <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono tiempo -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.58146 0C3.84625 0 0 3.84625 0 8.58146C0 13.3167 3.84625 17.1629 8.58146 17.1629C13.3167 17.1629 17.1629 13.3167 17.1629 8.58146C17.1629 3.84625 13.3167 0 8.58146 0ZM9.24157 15.8075V14.7425C9.24157 14.3816 8.94232 14.0824 8.58146 14.0824C8.2206 14.0824 7.92135 14.3816 7.92135 14.7425V15.8075C4.44476 15.4906 1.67228 12.7182 1.35543 9.24157H2.42041C2.78127 9.24157 3.08052 8.94232 3.08052 8.58146C3.08052 8.2206 2.78127 7.92135 2.42041 7.92135H1.35543C1.67228 4.44476 4.44476 1.67228 7.92135 1.35543V2.42041C7.92135 2.78127 8.2206 3.08052 8.58146 3.08052C8.94232 3.08052 9.24157 2.78127 9.24157 2.42041V1.35543C12.7182 1.67228 15.4906 4.44476 15.8075 7.92135H14.7425C14.3816 7.92135 14.0824 8.2206 14.0824 8.58146C14.0824 8.94232 14.3816 9.24157 14.7425 9.24157H15.8075C15.4906 12.7182 12.7182 15.4906 9.24157 15.8075Z"
                      fill="#272A30" />
                    <path
                      d="M11.1161 6.05201L8.74852 7.66268L6.64496 4.57335C6.44252 4.2741 6.02885 4.19489 5.7296 4.39732C5.43035 4.59976 5.35114 5.01343 5.55357 5.31268L8.02679 8.9477C8.15882 9.13253 8.36125 9.23815 8.57249 9.23815C8.69571 9.23815 8.82773 9.20294 8.94215 9.12373L11.8554 7.14339C12.1547 6.94096 12.2339 6.52729 12.0315 6.22804C11.829 5.92878 11.4154 5.84957 11.1161 6.05201Z"
                      fill="#272A30" />
                  </svg>
                </span>
                <div>
                  <span class="font-semibold">Tiempo de entrega</span><br>
                  <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2
                    meses</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono cantidad -->
                <span class="inline-block w-6 h-6 mx-1">
                  <svg width="25" height="28" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7425 7.0412H12.4893C12.6566 6.70674 12.7622 6.33708 12.7622 5.94101V2.42041C12.7622 1.08258 11.6796 0 10.3418 0H6.82116C5.48333 0 4.40075 1.08258 4.40075 2.42041V5.94101C4.40075 6.33708 4.50637 6.70674 4.6736 7.0412H2.42041C1.08258 7.0412 0 8.12378 0 9.46161V13.8624C0 15.2002 1.08258 16.2828 2.42041 16.2828H6.82116C7.51648 16.2828 8.14139 15.9835 8.58146 15.517C9.02154 15.9923 9.64644 16.2828 10.3418 16.2828H14.7425C16.0803 16.2828 17.1629 15.2002 17.1629 13.8624V9.46161C17.1629 8.12378 16.0803 7.0412 14.7425 7.0412ZM5.72097 5.94101V2.42041C5.72097 1.81311 6.21386 1.32022 6.82116 1.32022H10.3418C10.9491 1.32022 11.4419 1.81311 11.4419 2.42041V5.94101C11.4419 6.54832 10.9491 7.0412 10.3418 7.0412H6.82116C6.21386 7.0412 5.72097 6.54832 5.72097 5.94101ZM6.82116 14.9625H2.42041C1.81311 14.9625 1.32022 14.4697 1.32022 13.8624V9.46161C1.32022 8.85431 1.81311 8.36142 2.42041 8.36142H6.82116C7.42846 8.36142 7.92135 8.85431 7.92135 9.46161V13.8624C7.92135 14.4697 7.42846 14.9625 6.82116 14.9625ZM15.8427 13.8624C15.8427 14.4697 15.3498 14.9625 14.7425 14.9625H10.3418C9.73446 14.9625 9.24157 14.4697 9.24157 13.8624V9.46161C9.24157 8.85431 9.73446 8.36142 10.3418 8.36142H14.7425C15.3498 8.36142 15.8427 8.85431 15.8427 9.46161V13.8624Z" fill="#272A30"/>
                    <path d="M7.70237 5.28125H6.82222C6.46136 5.28125 6.16211 5.5805 6.16211 5.94136C6.16211 6.30222 6.46136 6.60147 6.82222 6.60147H7.70237C8.06323 6.60147 8.36248 6.30222 8.36248 5.94136C8.36248 5.5805 8.06323 5.28125 7.70237 5.28125Z" fill="#272A30"/>
                    <path d="M3.30198 13.1992H2.42183C2.06097 13.1992 1.76172 13.4985 1.76172 13.8593C1.76172 14.2202 2.06097 14.5194 2.42183 14.5194H3.30198C3.66284 14.5194 3.96209 14.2202 3.96209 13.8593C3.96209 13.4985 3.66284 13.1992 3.30198 13.1992Z" fill="#272A30"/>
                    <path d="M11.2219 13.1992H10.3418C9.98089 13.1992 9.68164 13.4985 9.68164 13.8593C9.68164 14.2202 9.98089 14.5194 10.3418 14.5194H11.2219C11.5828 14.5194 11.882 14.2202 11.882 13.8593C11.882 13.4985 11.5828 13.1992 11.2219 13.1992Z" fill="#272A30"/>
                  </svg>

                </span>
                <div>
                  <span class="font-semibold">La cantidad</span><br>
                  <span class="text-gray-500 text-sm">No se acepta pedidos por unidades, compra mínima de <b>s/3.000</b></span>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 mt-3 col-span-12 md:col-span-6 block md:hidden">
        <div class="block md:hidden">
            <h3 class="font-bold text-xl text-gray-800">Datos importantes:</h3>
            <ul class="space-y-3 py-4">
              <li class="flex items-start gap-3">
                <!-- Icono precio -->
                <span class="inline-block w-6 h-6 mx-1"><svg width="25" height="28" viewBox="0 0 18 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.7425 0H2.42041C1.08258 0 0 1.08258 0 2.42041V7.70131C0 9.03914 1.08258 10.1217 2.42041 10.1217H14.7425C16.0803 10.1217 17.1629 9.03914 17.1629 7.70131V2.42041C17.1629 1.08258 16.0803 0 14.7425 0ZM2.42041 1.32022H3.35337C3.45019 1.52266 3.5206 1.7427 3.5206 1.98034C3.5206 2.82528 2.82528 3.5206 1.98034 3.5206C1.7427 3.5206 1.52266 3.45019 1.32022 3.35337V2.42041C1.32022 1.81311 1.81311 1.32022 2.42041 1.32022ZM1.32022 7.70131V4.75281C1.53146 4.80562 1.7515 4.84082 1.98034 4.84082C3.55581 4.84082 4.84082 3.55581 4.84082 1.98034C4.84082 1.7515 4.80562 1.53146 4.75281 1.32022H14.7425C15.3498 1.32022 15.8427 1.81311 15.8427 2.42041V5.36891C15.6315 5.31611 15.4114 5.2809 15.1826 5.2809C13.6071 5.2809 12.3221 6.56592 12.3221 8.14139C12.3221 8.37022 12.3573 8.59026 12.4101 8.8015H2.42041C1.81311 8.8015 1.32022 8.30861 1.32022 7.70131ZM14.7425 8.8015H13.8096C13.7127 8.59906 13.6423 8.37903 13.6423 8.14139C13.6423 7.29644 14.3376 6.60112 15.1826 6.60112C15.4202 6.60112 15.6403 6.67154 15.8427 6.76835V7.70131C15.8427 8.30861 15.3498 8.8015 14.7425 8.8015Z"
                      fill="#272A30" />
                    <path
                      d="M8.58252 2.64062C7.24469 2.64062 6.16211 3.72321 6.16211 5.06104C6.16211 6.39886 7.24469 7.48145 8.58252 7.48145C9.92035 7.48145 11.0029 6.39886 11.0029 5.06104C11.0029 3.72321 9.92035 2.64062 8.58252 2.64062ZM8.58252 6.16122C7.97522 6.16122 7.48233 5.66834 7.48233 5.06104C7.48233 4.45373 7.97522 3.96085 8.58252 3.96085C9.18982 3.96085 9.68271 4.45373 9.68271 5.06104C9.68271 5.66834 9.18982 6.16122 8.58252 6.16122Z"
                      fill="#272A30" />
                  </svg>
                </span>
                <div>
                  <span class="font-semibold">Sobre el precio</span><br>
                  <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono tiempo -->
                <span class="inline-block w-6 h-6 mx-1">
                  <svg width="25" height="28" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.58146 0C3.84625 0 0 3.84625 0 8.58146C0 13.3167 3.84625 17.1629 8.58146 17.1629C13.3167 17.1629 17.1629 13.3167 17.1629 8.58146C17.1629 3.84625 13.3167 0 8.58146 0ZM9.24157 15.8075V14.7425C9.24157 14.3816 8.94232 14.0824 8.58146 14.0824C8.2206 14.0824 7.92135 14.3816 7.92135 14.7425V15.8075C4.44476 15.4906 1.67228 12.7182 1.35543 9.24157H2.42041C2.78127 9.24157 3.08052 8.94232 3.08052 8.58146C3.08052 8.2206 2.78127 7.92135 2.42041 7.92135H1.35543C1.67228 4.44476 4.44476 1.67228 7.92135 1.35543V2.42041C7.92135 2.78127 8.2206 3.08052 8.58146 3.08052C8.94232 3.08052 9.24157 2.78127 9.24157 2.42041V1.35543C12.7182 1.67228 15.4906 4.44476 15.8075 7.92135H14.7425C14.3816 7.92135 14.0824 8.2206 14.0824 8.58146C14.0824 8.94232 14.3816 9.24157 14.7425 9.24157H15.8075C15.4906 12.7182 12.7182 15.4906 9.24157 15.8075Z"
                      fill="#272A30" />
                    <path
                      d="M11.1161 6.05201L8.74852 7.66268L6.64496 4.57335C6.44252 4.2741 6.02885 4.19489 5.7296 4.39732C5.43035 4.59976 5.35114 5.01343 5.55357 5.31268L8.02679 8.9477C8.15882 9.13253 8.36125 9.23815 8.57249 9.23815C8.69571 9.23815 8.82773 9.20294 8.94215 9.12373L11.8554 7.14339C12.1547 6.94096 12.2339 6.52729 12.0315 6.22804C11.829 5.92878 11.4154 5.84957 11.1161 6.05201Z"
                      fill="#272A30" />
                  </svg>
                </span>
                <div>
                  <span class="font-semibold">Tiempo de entrega</span><br>
                  <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2
                    meses</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <!-- Icono cantidad -->
                <span class="inline-block w-6 h-6 mx-1">
                  <svg width="25" height="28" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7425 7.0412H12.4893C12.6566 6.70674 12.7622 6.33708 12.7622 5.94101V2.42041C12.7622 1.08258 11.6796 0 10.3418 0H6.82116C5.48333 0 4.40075 1.08258 4.40075 2.42041V5.94101C4.40075 6.33708 4.50637 6.70674 4.6736 7.0412H2.42041C1.08258 7.0412 0 8.12378 0 9.46161V13.8624C0 15.2002 1.08258 16.2828 2.42041 16.2828H6.82116C7.51648 16.2828 8.14139 15.9835 8.58146 15.517C9.02154 15.9923 9.64644 16.2828 10.3418 16.2828H14.7425C16.0803 16.2828 17.1629 15.2002 17.1629 13.8624V9.46161C17.1629 8.12378 16.0803 7.0412 14.7425 7.0412ZM5.72097 5.94101V2.42041C5.72097 1.81311 6.21386 1.32022 6.82116 1.32022H10.3418C10.9491 1.32022 11.4419 1.81311 11.4419 2.42041V5.94101C11.4419 6.54832 10.9491 7.0412 10.3418 7.0412H6.82116C6.21386 7.0412 5.72097 6.54832 5.72097 5.94101ZM6.82116 14.9625H2.42041C1.81311 14.9625 1.32022 14.4697 1.32022 13.8624V9.46161C1.32022 8.85431 1.81311 8.36142 2.42041 8.36142H6.82116C7.42846 8.36142 7.92135 8.85431 7.92135 9.46161V13.8624C7.92135 14.4697 7.42846 14.9625 6.82116 14.9625ZM15.8427 13.8624C15.8427 14.4697 15.3498 14.9625 14.7425 14.9625H10.3418C9.73446 14.9625 9.24157 14.4697 9.24157 13.8624V9.46161C9.24157 8.85431 9.73446 8.36142 10.3418 8.36142H14.7425C15.3498 8.36142 15.8427 8.85431 15.8427 9.46161V13.8624Z" fill="#272A30"/>
                    <path d="M7.70237 5.28125H6.82222C6.46136 5.28125 6.16211 5.5805 6.16211 5.94136C6.16211 6.30222 6.46136 6.60147 6.82222 6.60147H7.70237C8.06323 6.60147 8.36248 6.30222 8.36248 5.94136C8.36248 5.5805 8.06323 5.28125 7.70237 5.28125Z" fill="#272A30"/>
                    <path d="M3.30198 13.1992H2.42183C2.06097 13.1992 1.76172 13.4985 1.76172 13.8593C1.76172 14.2202 2.06097 14.5194 2.42183 14.5194H3.30198C3.66284 14.5194 3.96209 14.2202 3.96209 13.8593C3.96209 13.4985 3.66284 13.1992 3.30198 13.1992Z" fill="#272A30"/>
                    <path d="M11.2219 13.1992H10.3418C9.98089 13.1992 9.68164 13.4985 9.68164 13.8593C9.68164 14.2202 9.98089 14.5194 10.3418 14.5194H11.2219C11.5828 14.5194 11.882 14.2202 11.882 13.8593C11.882 13.4985 11.5828 13.1992 11.2219 13.1992Z" fill="#272A30"/>
                  </svg>

                </span>
                <div>
                  <span class="font-semibold">La cantidad</span><br>
                  <span class="text-gray-500 text-sm">No se acepta pedidos por unidades, compra mínima de <b>s/3.000</b></span>
                </div>
              </li>

            </ul>
          </div>
      </div> 

      <!-- Related Products -->
      <div class="mt-16">
        <h2 class="sm:text-lg lg:text-2xl font-bold mb-6">Otras Recomendaciones para tu negocio</h2>
        <Swiper :modules="[Navigation,Scrollbar]" :slides-per-view="1.2" :space-between="16" :breakpoints="{
          640: { slidesPerView: 2.2, navigation: false },
          1024: { slidesPerView: 3, navigation: false },
          1280: { slidesPerView: 4, navigation: true }
        }" :scrollbar="{ draggable: true }" :navigation="false" class="pb-10">
          <SwiperSlide v-for="relatedProduct in relatedProducts" :key="relatedProduct.id">
            <ProductCard :product="relatedProduct" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-6 mt-16">
        <h1 class="text-2xl font-bold mb-4">Atributos clave</h1>
        <div class="overflow-x-auto">
          <table class="w-full border-separate border-spacing-0 text-sm">
            <tbody>
              <tr v-for="(value, key) in parsedAttributes" :key="key">
                <td class="border border-[#e5e7eb] px-4 py-2 text-gray-700 font-semibold bg-gray-50 min-w-[120px]">{{
                  key }}</td>
                <td class="border border-[#e5e7eb] px-4 py-2 text-gray-700 whitespace-pre-line align-top min-w-[120px]">
                  {{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
        <h1 class="text-2xl font-bold mb-4">Descripción de producto de proveedor</h1>
        <div v-html="cleanHtmlContent(product.product_details)" class="descripcion-html text-gray-700 mt-4"
          v-if="product.product_details"></div>
      </div>

    </template>

    <div v-else class="text-center py-12">
      <p class="text-lg text-gray-500">Producto no encontrado.</p>
      <NuxtLink to="/" class="mt-4 btn inline-block">Volver al inicio</NuxtLink>
    </div>

    <!-- Botones fijos Mobile -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
      <div class="flex gap-3">
        <button @click="iniciarPedidoMinimo"
          class="flex-1 border border-gray-800 text-gray-900 font-semibold py-4 rounded-lg bg-white hover:bg-gray-100 transition">
          Añadir al carrito
        </button>
        <button @click="openCartPanel"
          class="flex-1 bg-[#FF5000] text-white font-semibold py-4 rounded-lg hover:bg-[#e04a00] transition">
          Iniciar pedido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import { useRouter } from 'vue-router'
import { useVideoLoader } from '~/composables/useVideoLoader';
import { useUserStore } from '~/stores/user'
import { ref, computed, onMounted, onUnmounted } from 'vue';


// Variables de breakpoints para facilitar uso en el template y lógica
const screenWidth = ref(window.innerWidth);
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

const isMobile = computed(() => screenWidth.value < MOBILE_BREAKPOINT);
const isTablet = computed(() => screenWidth.value >= MOBILE_BREAKPOINT && screenWidth.value < TABLET_BREAKPOINT);
const isDesktop = computed(() => screenWidth.value >= TABLET_BREAKPOINT);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

const { $formatPrice } = useNuxtApp();

// Composable para manejar videos bloqueados
const { videoError, videoLoading, loadVideo, isAlibabaVideo, getAlternativeUrl } = useVideoLoader();
const router = useRouter();
const cartQuantity = ref(1)
const userStore = useUserStore()

const iniciarPedidoPanel = () => {
  goToCart.value = true;
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name || product.value.nombre,
      price: getPrecioPuestoEnPeru(),
      quantity: cartQuantity.value,
      image: product.value.main_image_url || product.value.image || '/images/logo.png'
    });
    showCartPanel.value = false;
    if (!userStore.token) {
    router.push('/register')
    return
  }
    router.push('/checkout');
  }
}
const getProductMOQ = computed(() => {
  // Si el producto tiene moq explícito, usarlo
  if (product.value && product.value.moq && !isNaN(Number(product.value.moq))) {
    return Number(product.value.moq);
  }
  // Si no, intentar obtener del primer rango de precios
  try {
    const precios = JSON.parse(product.value?.prices_range || '[]');
    if (precios.length > 0) {
      const match = precios[0].quantity.match(/(\d+)/);
      if (match) return parseInt(match[1]);
    }
  } catch (e) { }
  return 1;
});

function openCartPanel() {
  // Resetear goToCart para mostrar el botón correcto
  goToCart.value = false;
  // Asegurar que cartQuantity tenga el MOQ correcto
  cartQuantity.value = getProductMOQ.value;
  showCartPanel.value = true;
}



const route = useRoute();
const productId = parseInt(route.params.id);
const showCartPanel = ref(false)
const goToCart = ref(false)
const productStore = useProductStore();
const cartStore = useCartStore();

const products = computed(() => productStore.products)
const loading = ref(true);
const quantity = ref(1);
const currentMainImage = ref('');
const moq = ref(1);
// Función para detectar si es video
const isVideo = (url) => {
  return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
};


// Get the current product
const product = computed(() => {
  const productToReturn = products.value.find(p => p.id === productId);
  quantity.value = productToReturn?.moq || 1;
  return productToReturn;
});

// Watcher para inicializar cartQuantity con el MOQ cuando el producto cambie
watch(() => product.value, (newProduct) => {
  if (newProduct) {
    cartQuantity.value = getProductMOQ.value;
  }
}, { immediate: true })

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return productStore.relatedProducts;
});
const supplierProducts = computed(() => {
  if (!product.value) return [];
  console.log('supplierProducts', productStore.supplierProducts);
  return productStore.supplierProducts;
});
const increaseQuantity = () => {
  quantity.value++;
};

computed(() => {
  if (product.value) {
    currentMainImage.value = product.value.main_image_url;
  }
});


const iniciarPedidoMinimo = () => {
  // Resetear goToCart para mostrar el botón de agregar al carrito
  goToCart.value = true;
  cartQuantity.value = getProductMOQ.value;
  showCartPanel.value = true;
};

const addToCartFromPanel = () => {
  goToCart.value = false;
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name || product.value.nombre,
      price: getPrecioPuestoEnPeru(),
      quantity: cartQuantity.value,
      image: product.value.main_image_url || product.value.image || '/images/logo.png'
    });
    showCartPanel.value = false;
  }
};

// También agregar una función para cerrar el panel que resetee el estado
const closeCartPanel = () => {
  showCartPanel.value = false;
  // Opcional: resetear goToCart al cerrar
  // goToCart.value = false;
}

// SEO
const { setProductSEO } = useSEO();

// Ensure data is loaded
onMounted(async () => {
  window.addEventListener('resize', handleResize);
  await productStore.fetchProductById(productId);
  await productStore.fetchRelatedProducts(product.value.category_slug);
  if (product?.value?.supplier_id) {
    await productStore.fetchProductBySupplierId(product.value.supplier_id);
  }
  loading.value = false;
  
  // Configurar SEO para el producto
  if (product.value) {
    setProductSEO(product.value);
  }
});

// Reset quantity when product changes
watch(() => route.params.id, () => {
  quantity.value = 1;
});
// Inicializamos con la imagen principal

// Handler para forzar el mínimo en el input de cantidad
function handleCartQuantityInput() {
  const min = getMinimumOrderQuantity() || 1;
  if (cartQuantity.value < min) cartQuantity.value = min;
}
// Variables para el carrusel
const activeMediaIndex = ref(0);
const currentPage = ref(0);
const itemsPerPage = 10; // Número de miniaturas visibles
const thumbnailContainer = ref(null);
const autoScrollInterval = ref(null);
const isScrollingUp = ref(false);
const isScrollingDown = ref(false);

// Variables para el swipe en mobile
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const touchEndY = ref(0);
const minSwipeDistance = 50; // Distancia mínima para considerar un swipe
const cleanHtmlContent = (htmlString) => {
  if (!htmlString) return '';

  // Remover caracteres de escape y caracteres extraños
  let cleaned = htmlString
    .replace(/\\"/g, '"')  // Reemplazar \" por "
    .replace(/\\n/g, '')   // Remover \n
    .replace(/\\t/g, '')   // Remover \t
    .replace(/\\/g, '')    // Remover backslashes restantes
    .trim();

  // Decodificar secuencias tipo u00f3 (sin barra) que vienen "rotas" del backend
  cleaned = cleaned.replace(/u([0-9a-fA-F]{4})/g, (m, g1) => String.fromCharCode(parseInt(g1, 16)));

  // Extraer solo el contenido del body si existe
  const bodyMatch = cleaned.match(/<body[^>]*>(.*?)<\/body>/s);
  if (bodyMatch) {
    cleaned = bodyMatch[1];
  }

  // Validar que las imágenes tengan URLs válidas
  cleaned = cleaned.replace(/<img[^>]*>/g, (imgTag) => {
    const srcMatch = imgTag.match(/src="([^"]*)"/);
    if (srcMatch && srcMatch[1] && srcMatch[1].startsWith('http')) {
      return imgTag;
    }
    return ''; // Remover imágenes sin URL válida
  });

  return cleaned;
}
const mediaItems = computed(() => {
  const items = [];

  // Función para determinar si una URL es un video
  const isVideoUrl = (url) => {
    // Verificar extensiones de video comunes
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|m4v|3gp)$/i;

    // Verificar URLs de Alibaba Video CDN
    const alibabaVideoPattern = /gv\.videocdn\.alibaba\.com.*\.mp4/i;

    // Verificar otros patrones de video conocidos
    const videoPatterns = [
      /videocdn\.alibaba\.com/i,
      /video.*\.mp4/i,
      /\.mp4\?/i
    ];

    return videoExtensions.test(url) ||
      alibabaVideoPattern.test(url) ||
      videoPatterns.some(pattern => pattern.test(url));
  };

  // Agregar media items del array product.value.media
  if (product.value?.media && Array.isArray(product.value.media)) {
    product.value.media.forEach(mediaItem => {
      if (mediaItem.url) {
        // Determinar si es video usando la función mejorada
        const isVideo = isVideoUrl(mediaItem.url);
        items.push({
          url: mediaItem.url,
          type: isVideo ? 'video' : 'image'
        });
      }
    });
  }

  // Fallback: agregar imágenes adicionales si no hay media array
  if (items.length <= 1) {
    if (product.value?.aditional_image1_url) {
      items.push({
        url: product.value.aditional_image1_url,
        type: 'image'
      });
    }

    if (product.value?.aditional_image2_url) {
      items.push({
        url: product.value.aditional_image2_url,
        type: 'image'
      });
    }

    if (product.value?.aditional_video1_url) {
      items.push({
        url: product.value.aditional_video1_url,
        type: 'video'
      });
    }
  }

  return items;
});

const visibleMediaItems = computed(() => {
  const start = currentPage.value * itemsPerPage;
  return mediaItems.value
    .slice(start, start + itemsPerPage)
    .map((item, index) => ({
      ...item,
      originalIndex: start + index
    }));
});

const activeMedia = computed(() => {
  return mediaItems.value[activeMediaIndex.value] || {};
});

// Navegación
const nextMedia = () => {
  activeMediaIndex.value = (activeMediaIndex.value + 1) % mediaItems.value.length;
  updatePage();
};

const prevMedia = () => {
  activeMediaIndex.value = (activeMediaIndex.value - 1 + mediaItems.value.length) % mediaItems.value.length;
  updatePage();
};

const updatePage = () => {
  currentPage.value = Math.floor(activeMediaIndex.value / itemsPerPage);
};

// Funciones de auto-scroll
const startAutoScrollUp = () => {
  if (autoScrollInterval.value) return;
  isScrollingUp.value = true;
  autoScrollInterval.value = setInterval(() => {
    if (thumbnailContainer.value) {
      thumbnailContainer.value.scrollBy({
        top: -120,
        behavior: 'smooth'
      });
    }
  }, 100);
};

const startAutoScrollDown = () => {
  if (autoScrollInterval.value) return;
  isScrollingDown.value = true;
  autoScrollInterval.value = setInterval(() => {
    if (thumbnailContainer.value) {
      thumbnailContainer.value.scrollBy({
        top: 120,
        behavior: 'smooth'
      });
    }
  }, 100);
};

const stopAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
    autoScrollInterval.value = null;
  }
  isScrollingUp.value = false;
  isScrollingDown.value = false;
};

const handleScroll = () => {
  // Detener auto-scroll si el usuario hace scroll manual
  if (autoScrollInterval.value) {
    stopAutoScroll();
  }
};

// Funciones para el swipe en mobile
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
  touchStartY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX;
  touchEndY.value = event.touches[0].clientY;
};

const handleTouchEnd = () => {
  if (!touchStartX.value || !touchEndX.value) return;
  
  const distanceX = touchStartX.value - touchEndX.value;
  const distanceY = Math.abs(touchStartY.value - touchEndY.value);
  
  // Verificar que el swipe sea más horizontal que vertical
  if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > minSwipeDistance) {
    if (distanceX > 0) {
      // Swipe hacia la izquierda - siguiente imagen
      nextMedia();
    } else {
      // Swipe hacia la derecha - imagen anterior
      prevMedia();
    }
  }
  
  // Resetear valores
  touchStartX.value = 0;
  touchEndX.value = 0;
};

// Función para manejar scroll de la galería y actualizar el activeMediaIndex
const galleryContainer = ref(null);

const handleScrollGallery = () => {
  if (!galleryContainer.value) return;
  
  const container = galleryContainer.value;
  const scrollLeft = container.scrollLeft;
  const itemWidth = container.clientWidth * 0.9 + 16; // 90vw + margin
  
  const newIndex = Math.round(scrollLeft / itemWidth);
  activeMediaIndex.value = Math.max(0, Math.min(newIndex, mediaItems.value.length - 1));
};

// Debe estar en el scope superior para ser accesible en todo el componente
function getMinimumOrderQuantity() {
  try {
    const prices = JSON.parse(product.value.prices_range || '[]');
    if (!prices.length) return 1;
    let minQty = Infinity;
    for (const price of prices) {
      const quantityRange = price.quantity.trim();
      // Caso 1: Rango "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 2: Mínimo ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)/);
      if (minMatch) {
        const start = parseInt(minMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
      // Caso 3: Cantidad fija "100 conjuntos"
      const fixedMatch = quantityRange.match(/^(\d+)/);
      if (fixedMatch) {
        const start = parseInt(fixedMatch[1]);
        if (start < minQty) minQty = start;
        continue;
      }
    }
    return isFinite(minQty) ? minQty : 1;
  } catch (error) {
    console.error('Error calculating minimum order quantity:', error);
    return 1;
  }
}
const getPrecioPuestoEnPeru = () => {
  // get product.precios
  const precios = JSON.parse(product.value.prices_range || '[]');
  // Usar cartQuantity si está en el contexto del panel lateral, si no, usar quantity
  const quantitySelected = typeof cartQuantity !== 'undefined' ? cartQuantity.value : quantity.value;

  // Helper para extraer solo el número decimal del string de precio
  const parsePrecio = (precioStr) => {
    if (typeof precioStr === 'number') return precioStr;
    if (!precioStr) return 0;
    // Buscar el primer número decimal en el string
    const match = precioStr.replace(',', '.').match(/([0-9]+(\.[0-9]+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  if (precios.length > 0) {
    // buscar el precio que corresponde a la cantidad seleccionada
    for (const precio of precios) {
      const quantityRange = precio.quantity;

      // Regex para rango: "20 - 59 conjuntos"
      const rangeMatch = quantityRange.match(/^(\d+)\s*-\s*(\d+)\s*/);
      if (rangeMatch) {
        const minQty = parseInt(rangeMatch[1]);
        const maxQty = parseInt(rangeMatch[2]);

        if (quantitySelected >= minQty && quantitySelected <= maxQty) {
          return parsePrecio(precio.price);
        }
      }

      // Regex para mínimo: ">= 180 conjuntos"
      const minMatch = quantityRange.match(/^>=\s*(\d+)\s*/);
      if (minMatch) {
        const minQty = parseInt(minMatch[1]);

        if (quantitySelected >= minQty) {
          return parsePrecio(precio.price);
        }
      }
    }

    // Si no encuentra rango específico, devolver el primer precio válido
    return parsePrecio(precios[0].price);
  }

  // Si no hay precios, devolver precio base del producto
  return parsePrecio(product.value.precio || '0');
};
const parsedPackaging = computed(() => {
  if (!product.value?.packaging_info) return {};
  return JSON.parse(product.value.packaging_info);
});

const parsedDeliveryTimes = computed(() => {
  if (!product.value?.delivery_lead_times) return {};

  try {
    // Si ya es un objeto, devolverlo directamente
    if (typeof product.value.delivery_lead_times === 'object' && !Array.isArray(product.value.delivery_lead_times)) {
      return product.value.delivery_lead_times;
    }

    // Si es un string JSON, parsearlo
    if (typeof product.value.delivery_lead_times === 'string') {
      return JSON.parse(product.value.delivery_lead_times);
    }

    return {};
  } catch (error) {
    console.error('Error parsing delivery lead times:', error);
    return {};
  }
});
const parsedAttributes = computed(() => {
  if (!product.value?.attributes) return {};

  try {
    // Si ya es un objeto, devolverlo directamente
    if (typeof product.value.attributes === 'object' && !Array.isArray(product.value.attributes)) {
      return product.value.attributes;
    }

    // Si es un string JSON, parsearlo
    if (typeof product.value.attributes === 'string') {
      return JSON.parse(product.value.attributes);
    }

    return {};
  } catch (error) {
    console.error('Error parsing product attributes:', error);
    return {};
  }
});

// Inicialización
watch(() => product.value, () => {
  activeMediaIndex.value = 0;
  currentPage.value = 0;
}, { immediate: true });

// Limpiar intervalo al desmontar
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
  }
});

// Cargar video cuando cambia el media activo
watch(() => activeMedia.value, async (newMedia) => {
  if (newMedia && newMedia.type === 'video' && isAlibabaVideo(newMedia.url)) {
    await loadVideo(newMedia.url);
  }
});
</script>
<style scoped>
.border-primary {
  border-color: #3b82f6;
  /* o tu color primary */
}

.cursor-pointer {
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

table th {
  font-weight: bold;
  color: #374151;
}

table td {
  color: #6b7280;
}

table tr:nth-child(even) {
  background-color: #f9fafb;
}

table tr:hover {
  background-color: #f3f4f6;
}

/* Estilos para la descripción HTML del proveedor */
.descripcion-html img,
.descripcion-html .product-image {
  max-width: 100% !important;
  height: auto !important;
  max-height: 400px;
  margin: 1em auto !important;
  display: block;
  border-radius: 0.5em;
  box-shadow: 0 2px 8px 0 #0001;
  object-fit: contain;
}

.descripcion-html table {
  width: 100% !important;
  max-width: 100%;
  table-layout: auto;
  font-size: 0.97em;
}

.descripcion-html td,
.descripcion-html th {
  max-width: 300px;
  word-break: break-word;
  padding: 0.5em 0.7em !important;
  border: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

.descripcion-html tr {
  min-height: 40px;
}

.descripcion-html *[style] {
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  height: auto !important;
}

/* Ocultar barra de scroll */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Estilos para las flechas flotantes */
.floating-arrow {
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.floating-arrow:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: scale(1.05);
}

/* Animaciones personalizadas para los botones flotantes */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  50% {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

.floating-button {
  animation: float 3s ease-in-out infinite;
}

.floating-button:hover {
  animation: glow 2s ease-in-out infinite;
}

/* Ocultar barra de scroll en galería mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>