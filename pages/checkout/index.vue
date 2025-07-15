<template>
  <div v-if="!showSuccess" class="min-h-screen bg-[#f5f8fb] flex flex-col">
    <!-- Vista Desktop -->
    <div class="hidden md:flex flex-1 flex-col md:flex-row gap-8 p-6 md:p-12 max-w-[1200px] mx-auto w-full">
      <!-- Columna izquierda -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 class="text-xl font-bold mb-2">Tus datos</h2>
          <p class="text-xs text-gray-500 flex items-center gap-2 mb-4">
            <Icon name="heroicons:lock-closed" class="w-4 h-4" />
            Tu información personal está encriptada y solo se utilizará para fines de entrega
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre y apellido*</label>
                <input v-model="form.fullName" type="text" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" placeholder="Ingresa tus nombres y apellidos">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DNI/ID*</label>
                <input v-model="form.dni" type="text" required maxlength="8" class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" placeholder="Ingresa tu documento de identidad">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
                <input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" placeholder="Ingresa tu correo">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp*</label>
                <input v-model="form.phone" type="tel" required maxlength="9" class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" placeholder="Ingresa tu número de celular">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Departamento*</label>
                    <select v-model="form.departamento" @change="onDepartamentoChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                      <option value="">{{ loading ? 'Cargando...' : 'Selecciona departamento' }}</option>
                      <option v-for="dept in departamentos" :key="dept.value" :value="dept.value">{{ dept.label }}</option>
                    </select>
                    <div v-if="departamentos.length === 0 && !loading" class="text-red-500 text-xs mt-1">No se pudieron cargar los departamentos</div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Provincia*</label>
                    <select v-model="form.provincia" @change="onProvinciaChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" :disabled="!form.departamento">
                    <option value="">Selecciona provincia</option>
                    <option v-for="prov in provincias" :key="prov.value" :value="prov.value">{{ prov.label }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distrito*</label>
                    <select v-model="form.distrito" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]" :disabled="!form.provincia">
                    <option value="">Selecciona distrito</option>
                    <option v-for="dist in distritos" :key="dist.value" :value="dist.value">{{ dist.label }}</option>
                    </select>
                </div>
                </div>
            <button
              type="button"
              class="w-[25%] bg-[#FF5000] text-white font-semibold p-3 rounded mt-4"
              @click="guardarDatos"
            >
              Guardar
            </button>
            <span v-if="savedMessage" class="ml-4 text-green-600 font-semibold">¡Guardado!</span>
          </form>
        </div>
        <!-- Productos seleccionados -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-base font-bold mb-4">Productos seleccionados</h3>
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 mb-4">
            <img :src="item.image" alt="" class="w-14 h-14 rounded object-cover" />
            <div class="flex-1">
              <div class="font-semibold cursor-pointer hover:text-[#FF5000] transition-colors" @click="goToProduct(item.id)">{{ truncateName(item.name) }}</div>
              <div class="flex items-center gap-2 mt-2">
                <button 
                  @click="decreaseQuantity(item)" 
                  :disabled="item.quantity <= getProductMOQ(item)"
                  :class="item.quantity <= getProductMOQ(item) ? 'px-2 py-1 bg-gray-100 text-gray-400 rounded cursor-not-allowed' : 'px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'"
                >
                  -
                </button>
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  :min="getProductMOQ(item)" 
                  @input="validateQuantity(item)"
                  class="w-14 text-center border rounded" 
                />
                <button @click="increaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </div>
            </div>
            <div class="font-semibold">{{ $formatPrice(item.price * item.quantity) }}</div>
            <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
          <NuxtLink to="/" class="text-blue-500 text-sm hover:underline">Agregar productos</NuxtLink>
       
        </div>
      </div>
      <!-- Columna derecha -->
      <div class="w-full md:w-[340px] flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 class="text-lg font-bold mb-6">Resumen del pedido</h3>
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-2xl font-bold text-gray-800">{{ $formatPrice(cartTotal) }}</span>
          </div>
          <button
            @click="handlePedido"
            :disabled="!isFormValid || orderLoading"
            class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
            <div v-if="orderLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ orderLoading ? 'Procesando...' : 'Enviar pedido' }}
          </button>
        </div>
        <div class="bg-white rounded-lg shadow-md p-8">
          <h4 class="text-lg font-bold mb-4">Datos importantes:</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 mt-1" />
              <div>
                <span class="font-semibold">Sobre el precio</span><br>
                <span class="text-gray-500 text-sm">Es puesto en Perú, incluye todo.</span>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:clock" class="w-6 h-6 mt-1" />
              <div>
                <span class="font-semibold">Tiempo de entrega</span><br>
                <span class="text-gray-500 text-sm">Se tiene que realizar la importación, la entrega es en 2 meses</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Vista Mobile -->
    <div class="md:hidden flex flex-col h-screen">
      <!-- Contenido principal -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 class="text-xl font-bold mb-4">Tus datos</h2>
          <svg class="text-orange-400 pb-1" width="22" height="22" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.37037 5.78639V3.68931C9.37037 1.65436 7.63481 0 5.5 0C3.36519 0 1.62963 1.65436 1.62963 3.68931V5.78639C0.668148 6.27571 0 7.23104 0 8.34949V11.4563C0 13.064 1.36889 14.3689 3.05556 14.3689H7.94444C9.63111 14.3689 11 13.064 11 11.4563V8.34949C11 7.23881 10.3319 6.27571 9.37037 5.78639ZM2.85185 3.68931C2.85185 2.29902 4.04148 1.16504 5.5 1.16504C6.95852 1.16504 8.14815 2.29902 8.14815 3.68931V5.46018C8.08296 5.46018 8.01778 5.43687 7.94444 5.43687H3.05556C2.98222 5.43687 2.91704 5.45241 2.85185 5.46018V3.68931ZM9.77778 11.4563C9.77778 12.4194 8.95481 13.2038 7.94444 13.2038H3.05556C2.04519 13.2038 1.22222 12.4194 1.22222 11.4563V8.34949C1.22222 7.38638 2.04519 6.60192 3.05556 6.60192H7.94444C8.95481 6.60192 9.77778 7.38638 9.77778 8.34949V11.4563Z" fill="#FF500B"/>
            <path d="M5.49978 8.53906C5.16571 8.53906 4.88867 8.80314 4.88867 9.12158V10.675C4.88867 10.9934 5.16571 11.2575 5.49978 11.2575C5.83386 11.2575 6.11089 10.9934 6.11089 10.675V9.12158C6.11089 8.80314 5.83386 8.53906 5.49978 8.53906Z" fill="#FF500B"/>
          </svg>

          <p class="text-base text-gray-500 flex items-center gap-2 mb-4">
            Tu información personal está encriptada y solo se utilizará para fines de entrega
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-base font-medium text-gray-700 mb-1">Nombre y apellido<span class="text-orange-400">*</span></label>
              <input v-model="form.fullName" type="text" required class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base" placeholder="Ingresa tus nombres y apellidos">
            </div>
            <!-- DNI y WhatsApp en la misma fila -->
            <div class="flex flex-row gap-4">
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-1">DNI/ID<span class="text-orange-400">*</span></label>
                <input
                  v-model="form.dni"
                  type="text"
                  required
                  maxlength="8"
                  class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base"
                  placeholder="Ingresa tu número de DNI"
                >
              </div>
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-1">WhatsApp<span class="text-orange-400">*</span></label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  maxlength="9"
                  class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base"
                  placeholder="Ingresa tu número de celular"
                >
              </div>
            </div>
            <div>
              <label class="block text-base font-medium text-gray-700 mb-1">Correo<span class="text-orange-400">*</span></label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base"
                placeholder="Ingresa tu correo"
              >
            </div>
            <!-- Provincia, Ciudad, Distrito en la misma fila -->
            <div class="flex flex-row gap-4">
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-1">Provincia<span class="text-orange-400">*</span></label>
                <select v-model="form.departamento" @change="onDepartamentoChange" required class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base">
                  <option value="" class="text-base font-medium text-gray-700">{{ loading ? 'Cargando...' : 'Selecciona departamento' }}</option>
                  <option class="text-base font-medium text-gray-700" v-for="dept in departamentos" :key="dept.value" :value="dept.value">{{ dept.label }}</option>
                  <div v-if="departamentos.length === 0 && !loading" class="text-red-500 text-xs mt-1">No se pudieron cargar los departamentos</div>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-1">Ciudad<span class="text-orange-400">*</span></label>
                <select v-model="form.provincia" @change="onProvinciaChange" required class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base" :disabled="!form.departamento">
                  <option value="">Selecciona provincia</option>
                  <option v-for="prov in provincias" :key="prov.value" :value="prov.value">{{ prov.label }}</option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-base font-medium text-gray-700 mb-1">Distrito<span class="text-orange-400">*</span></label>
                <select v-model="form.distrito" required class="w-full rounded-xl px-4 py-3 bg-[#F0F4F9] border-0 focus:ring-2 focus:ring-orange-400 text-base" :disabled="!form.provincia">
                  <option value="">Selecciona distrito</option>
                  <option v-for="dist in distritos" :key="dist.value" :value="dist.value">{{ dist.label }}</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              class="w-full bg-[#FF5000] text-white font-semibold p-3 rounded mt-4"
              @click="guardarDatos"
            >
              Guardar
            </button>
            <span v-if="savedMessage" class="text-green-600 font-semibold text-center block">¡Guardado!</span>
          </form>
        </div>
        
        <!-- Productos seleccionados -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-base font-bold mb-4">Productos seleccionados</h3>
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 mb-4">
            <img :src="item.image" alt="" class="w-12 h-12 rounded object-cover" />
            <div class="flex-1">
              <div class="font-semibold cursor-pointer hover:text-[#FF5000] transition-colors" @click="goToProduct(item.id)">{{ truncateName(item.name) }}</div>
              <div class="flex items-center gap-2 mt-2">
                <button 
                  @click="decreaseQuantity(item)" 
                  :disabled="item.quantity <= getProductMOQ(item)"
                  :class="item.quantity <= getProductMOQ(item) ? 'px-2 py-1 bg-gray-100 text-gray-400 rounded cursor-not-allowed' : 'px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'"
                >
                  -
                </button>
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  :min="getProductMOQ(item)" 
                  @input="validateQuantity(item)"
                  class="w-12 text-center border rounded text-sm" 
                />
                <button @click="increaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </div>
            </div>
            <div class="font-semibold text-sm">{{ $formatPrice(item.price * item.quantity) }}</div>
            <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
          <NuxtLink to="/" class="text-blue-500 text-sm hover:underline">Agregar productos</NuxtLink>
        </div>
      </div>

      <!-- Panel inferior colapsable -->
      <div class="bg-white border-t border-gray-200">
        <!-- Header del panel -->
        <div class="p-6 border-b border-gray-100">
          <button @click="toggleMobileSummary" class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-black-600 text-xl">Resumen de pedido</span>
            </div>
            <Icon 
              :name="mobileSummaryOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-up'" 
              class="w-5 h-5 text-gray-500 transition-transform"
            />
          </button>
        </div>
        
        <!-- Contenido colapsable -->
        <div v-if="mobileSummaryOpen" class="p-4 space-y-4">
          <!-- Precio en soles -->
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-xl font-bold text-gray-800">{{ $formatPrice(cartTotal) }}</span>
          </div>
          
          <!-- Botón enviar pedido -->
          <button
            @click="handlePedido"
            :disabled="!isFormValid || orderLoading"
            class="w-full bg-[#FF5000] text-white font-semibold py-4 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <div v-if="orderLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ orderLoading ? 'Procesando...' : 'Enviar pedido' }}
          </button>
          
          <!-- Datos importantes -->
          <div class="bg-gray-50 rounded-lg p-4 flex md:hidden">
            <h4 class="text-sm font-bold mb-3">Datos importantes:</h4>
            <ul class="space-y-3 text-xs">
              <li class="flex items-start gap-2">
                <Icon name="heroicons:currency-dollar" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-semibold">Sobre el precio</span><br>
                  <span class="text-gray-500">Es puesto en Perú, incluye todo.</span>
                </div>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="heroicons:clock" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-semibold">Tiempo de entrega</span><br>
                  <span class="text-gray-500">Se tiene que realizar la importación, la entrega es en 2 meses</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de alerta de monto mínimo -->
<div
  v-if="showMinAlert"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
>
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative text-center">
    <button
      class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
      @click="showMinAlert = false"
    >&times;</button>
    <div class="flex flex-col items-center mb-4">
      <div class="w-14 h-14 flex items-center justify-center rounded-full border-2 border-[#FF5000] mb-2">
        <span class="text-4xl text-[#FF5000]">!</span>
      </div>
      <div class="text-lg font-semibold mb-2">
        El monto mínimo de importación es de s/3000 para este pedido
      </div>
    </div>
    <div class="flex flex-col gap-2 mb-2 text-left">
      <div>
        Tu pedido actual:
        <b>{{ $formatPrice(cartTotal) }}</b>
      </div>
      <div>
        Importe pendiente:
        <b class="text-[#FF5000]">{{ $formatPrice(3000 - cartTotal) }}</b>
      </div>
    </div>
    <div class="text-xs text-gray-500 mt-3">
      *Puedes aumentar unidades o agregar más productos
    </div>
  </div>
</div>
<!-- Sección de confirmación de pedido con animación Rappi -->
<div
  v-if="showSuccess"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  @click.self="closeSuccessModal"
>
  <!-- Confeti animado -->
  <div class="absolute inset-0 pointer-events-none">
    <div v-for="i in 50" :key="i" 
      class="confetti absolute w-2 h-2 rounded-full"
      :style="{
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (Math.random() * 2 + 2) + 's',
        backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)]
      }">
    </div>
  </div>

  <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-10 text-center relative transform transition-all duration-500 scale-100 animate-bounce-in">
    <!-- Icono animado de éxito -->
    <div class="flex flex-col items-center mb-6">
      <div class="success-icon-container mb-6">
        <div class="success-icon-bg">
          <svg class="success-check" width="40" height="40" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#22C55E"/>
            <path d="M8 12.5l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <!-- Título con animación de escritura -->
      <h2 class="text-3xl font-bold mb-4 text-gray-800 typing-animation">¡Pedido confirmado!</h2>
      
      <!-- Número de pedido con efecto de resaltado -->
      <div class="order-number-container mb-4">
        <span class="text-sm text-gray-500">Nº Pedido:</span>
        <div class="order-number-display">{{ orderNumber }}</div>
      </div>
      
      <!-- Mensaje con fade in -->
      <p class="text-gray-600 mb-6 fade-in-text">
        Nuestro equipo de Pro Business se pondrá en contacto con usted a la brevedad posible.
        <br><br>
        Envíanos un WhatsApp.
      </p>
    </div>
    
    <div class="border-t my-6"></div>
    
    <!-- Botón de WhatsApp con animación -->
    <a
      href="https://wa.me/51999999999?text=Hola,%20acabo%20de%20realizar%20un%20pedido%20en%20ProBusiness"
      target="_blank"
      class="whatsapp-button inline-flex items-center justify-center bg-[#FF5000] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#e04a00] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
      <svg class="mr-3" width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
      Hablemos por WhatsApp
    </a>
  </div>
  </div>
  

</template>

<script setup>
definePageMeta({
  middleware: ['cart-init']
})

import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

import { ref, onMounted, computed } from 'vue'
import { useOrders } from '~/composables/useOrders'
import { useModal } from '~/composables/useModal'
import { getDepartamentos, getProvincias, getDistritos } from '~/services/location-service'

const { $formatPrice } = useNuxtApp();
const router = useRouter();
//add middleware to check if cart is empty
const cartStore = useCartStore();
const savedMessage = ref(false)
const mobileSummaryOpen = ref(false)

// Usar las funciones directamente en vez de locationService.getX

// Usar el composable de modal
const { showError } = useModal()

// Usar el composable de órdenes
const { createOrder, loading: orderLoading, error: orderError, clearError } = useOrders()

const toggleMobileSummary = () => {
  mobileSummaryOpen.value = !mobileSummaryOpen.value;
}
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.cartTotal)
const checkoutItems = computed(() => cartStore.checkoutItems)

function guardarDatos() {
  // Usa el email como parte de la clave, si está disponible
  const userEmail = form.value.email || localStorage.getItem('user_email') || '';
  const key =  'checkoutInfo';

  localStorage.setItem(key, JSON.stringify(form.value));
  savedMessage.value = true;
  setTimeout(() => {
    savedMessage.value = false;
  }, 2000);
}

function increaseQuantity(item) {
  cartStore.updateItemQuantity(item.id, item.quantity + 1);
}
function decreaseQuantity(item) {
  // Validar que la cantidad no sea menor al MOQ del producto
  const moq = getProductMOQ(item);
  if (item.quantity > moq) {
    cartStore.updateItemQuantity(item.id, item.quantity - 1);
  }
}
// Función para obtener el MOQ de un producto
function getProductMOQ(product) {
  // Si el producto tiene moq explícito, usarlo
  if (product && product.moq && !isNaN(Number(product.moq))) {
    return Number(product.moq);
  }
  // Si no, intentar obtener del primer rango de precios
  try {
    const precios = JSON.parse(product?.prices_range || '[]');
    if (precios.length > 0) {
      const match = precios[0].quantity.match(/(\d+)/);
      if (match) return parseInt(match[1]);
    }
  } catch (e) {}
  return 1;
}

function validateQuantity(item) {
  // Validar que la cantidad no sea menor al MOQ del producto
  const moq = getProductMOQ(item);
  if (item.quantity < moq) {
    cartStore.updateItemQuantity(item.id, moq);
  }
}
function removeItem(productId) {
  cartStore.removeItem(productId);
}

function goToProduct(productId) {
  router.push(`/product/${productId}`);
}

const truncateName = (name) => {
  if (!name) return '';
  return name.length > 50 ? name.substring(0, 50) + '...' : name;
};
// Arrays reactivos para selects

const showMinAlert = ref(false)
const showSuccess = ref(false)
const orderNumber = ref('')

// Colores para el confeti
const confettiColors = ['#FF5000', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

// Estados reactivos para las ubicaciones
const paises = ref([])
const departamentos = ref([])
const provincias = ref([])
const distritos = ref([])
const loading = ref(false)

// Función para cargar departamentos
const loadDepartamentos = async () => {
  try {
    loading.value = true
    console.log('Cargando departamentos...')
    const data = await getDepartamentos()
    console.log('Departamentos cargados:', data)
    console.log('Tipo de datos:', typeof data, Array.isArray(data))
    departamentos.value = data || []
    console.log('departamentos.value después de asignar:', departamentos.value)
  } catch (error) {
    console.error('Error al cargar departamentos:', error)
    departamentos.value = []
  } finally {
    loading.value = false
  }
}

// Función para cargar provincias
const loadProvincias = async (departamentoId) => {
  try {
    loading.value = true
    form.value.provincia = ''
    form.value.distrito = ''
    console.log('Cargando provincias para departamentoId:', departamentoId)
    const data = await getProvincias(departamentoId)
    console.log('Provincias cargadas:', data)
    provincias.value = data || []
    console.log('provincias.value después de asignar:', provincias.value)
  } catch (error) {
    console.error('Error al cargar provincias:', error)
    provincias.value = []
  } finally {
    loading.value = false
  }
}

// Función para cargar distritos
const loadDistritos = async (provinciaId) => {
  try {
    loading.value = true
    form.value.distrito = ''
    console.log('Cargando distritos para provinciaId:', provinciaId)
    const data = await getDistritos(provinciaId)
    console.log('Distritos cargados:', data)
    distritos.value = data || []
    console.log('distritos.value después de asignar:', distritos.value)
  } catch (error) {
    console.error('Error al cargar distritos:', error)
    distritos.value = []
  } finally {
    loading.value = false
  }
}

function onDepartamentoChange() {
  if (form.value.departamento) {
    const departamento = departamentos.value.find(d => d.value === form.value.departamento)
    if (departamento) {
      loadProvincias(departamento.value)
    }
  } else {
    provincias.value = []
    distritos.value = []
  }
}

function onProvinciaChange() {
  if (form.value.provincia) {
    const provincia = provincias.value.find(p => p.value === form.value.provincia)
    if (provincia) {
      loadDistritos(provincia.value)
    }
  } else {
    distritos.value = []
  }
}

const form = ref({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    departamento: '',
    provincia: '',
    distrito: ''
});
const isFormValid = computed(() =>
  form.value.fullName.trim() &&
  form.value.dni.trim() &&
  form.value.email.trim() &&
  form.value.phone.trim() &&
  form.value.departamento &&
  form.value.provincia &&
  form.value.distrito
)
async function handlePedido() {
  // Validar que el carrito no esté vacío
  if (!cartItems.value || cartItems.value.length === 0) {
    router.push('/cart');
    return;
  }
  
  // Validación del monto mínimo solo al enviar el pedido
  if (cartTotal.value < 3000) {
    showMinAlert.value = true
    return
  }

  // Limpiar errores previos
  clearError()

  try {
    // IDs
    const departamentoObj = departamentos.value.find(d => d.value === form.value.departamento)
    const provinciaObj = provincias.value.find(p => p.value === form.value.provincia)
    const distritoObj = distritos.value.find(d => d.value === form.value.distrito)
    form.value.departamento_label = departamentoObj ? departamentoObj.label : ''
    form.value.provincia_label = provinciaObj ? provinciaObj.label : ''
    form.value.distrito_label = distritoObj ? distritoObj.label : ''
    const result = await createOrder(form.value, cartItems.value, cartTotal.value)

    if (result.success) {
      // Guardar el número de pedido que devuelve el backend
      orderNumber.value = result.data.order_id || result.data.order_id || 'N/A';
      // Limpiar el carrito después de un pedido exitoso
      cartStore.clearCart();
      showSuccess.value = true;
      localStorage.removeItem('checkoutInfo');
    } else {
      if (result.status === 401) {
        showError('Tu sesión ha expirado. Por favor, inicia sesión para continuar.')
      
      } else {
        //set on local storage route to redirect later login or register
        localStorage.setItem('checkoutRoute', '/checkout');
        showError(result.message || 'Error al procesar el pedido. Por favor, inténtalo de nuevo.')
      }
    }

  } catch (error) {
    showError('Error al procesar el pedido. Por favor, inténtalo de nuevo.')
  }
}

const handleSubmit = () => {
    localStorage.setItem('checkoutInfo', JSON.stringify(form.value));
    router.push('/checkout/review');
};

const closeSuccessModal = () => {
    showSuccess.value = false;
    router.push('/');
};
onMounted(async () => {
    if (cartItems.value && cartItems.value.length === 0) {
        router.push('/cart');
        return;
    }
    
    // Cargar departamentos al inicio
    await loadDepartamentos()
    
    // Usa el email actual para buscar los datos guardados
    const userEmail = localStorage.getItem('user_email') || '';
    const key = userEmail ? `checkoutInfo_${userEmail}` : 'checkoutInfo';
    const savedInfo = localStorage.getItem('checkoutInfo');
    if (savedInfo) {
        const parsedInfo = JSON.parse(savedInfo);
        
        // Restaurar ubicaciones si existen
        if (parsedInfo.departamento) {
            await loadProvincias(parsedInfo.departamento)
            if (parsedInfo.provincia) {
                await loadDistritos(parsedInfo.provincia)
            }
        }
        
        // Restaurar el formulario después de cargar todos los datos
        form.value = { ...parsedInfo };
    } else {
        // Autocompletar si el usuario está logueado
        const userName = localStorage.getItem('user_name');
        const userEmail = localStorage.getItem('user_email');
        if (userName) form.value.fullName = userName;
        if (userEmail) form.value.email = userEmail;
    }
});
</script>
<style scoped>
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #e67e22; /* Borde naranja */
  border-radius: 50%; /* Forma circular */
  outline: none;
  cursor: pointer;
  position: relative; /* Necesario para posicionar el círculo interno */
}

input[type="radio"]:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; /* Tamaño del círculo interno */
  height: 10px;
  background-color: #e67e22; /* Color del círculo */
  border-radius: 50%; /* Forma circular */
}

/* Animaciones tipo Rappi */
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes successIconPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes orderNumberGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 80, 0, 0.6);
  }
}

/* Clases de animación */
.animate-bounce-in {
  animation: bounceIn 0.8s ease-out;
}

.confetti {
  animation: confettiFall linear infinite;
}

.success-icon-container {
  position: relative;
}

.success-icon-bg {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successIconPulse 1s ease-out;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
}

.success-check {
  animation: successIconPulse 1.2s ease-out 0.3s both;
}

.typing-animation {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 1.5s steps(20, end), fadeIn 0.8s ease-out;
}

.fade-in-text {
  animation: fadeIn 1s ease-out 0.8s both;
}

.order-number-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.order-number-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF5000;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #FF5000, #e04a00);
  color: white;
  border-radius: 0.75rem;
  animation: orderNumberGlow 2s ease-in-out infinite;
}

.whatsapp-button {
  animation: fadeIn 1s ease-out 1.2s both;
}

/* Efectos hover mejorados */
.whatsapp-button:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 80, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .order-number-display {
    font-size: 1.25rem;
    padding: 0.4rem 0.8rem;
  }
  
  .success-icon-bg {
    width: 70px;
    height: 70px;
  }
  
  .success-check {
    width: 35px;
    height: 35px;
  }
}

</style>