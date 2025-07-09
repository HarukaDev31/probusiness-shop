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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Provincia*</label>
                    <select v-model="form.province" @change="onProvinceChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona provincia</option>
                    <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                    <select v-model="form.city" @change="onCityChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona ciudad</option>
                    <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distrito*</label>
                    <select v-model="form.district" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona distrito</option>
                    <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
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
              <div class="font-semibold cursor-pointer hover:text-[#FF5000] transition-colors" @click="goToProduct(item.id)">{{ item.name }}</div>
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
            :disabled="!isFormValid"
            class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
            >
            Enviar pedido
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
          <p class="text-xs text-gray-500 flex items-center gap-2 mb-4">
            <Icon name="heroicons:lock-closed" class="w-4 h-4" />
            Tu información personal está encriptada
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
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
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Provincia*</label>
                    <select v-model="form.province" @change="onProvinceChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona provincia</option>
                    <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                    <select v-model="form.city" @change="onCityChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona ciudad</option>
                    <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distrito*</label>
                    <select v-model="form.district" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-[#F0F4F9]">
                    <option value="">Selecciona distrito</option>
                    <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
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
              <div class="font-semibold cursor-pointer hover:text-[#FF5000] transition-colors" @click="goToProduct(item.id)">{{ item.name }}</div>
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
        <div class="p-4 border-b border-gray-100">
          <button @click="toggleMobileSummary" class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-gray-600">Resumen de pedido</span>
            </div>
            <Icon 
              :name="mobileSummaryOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
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
            :disabled="!isFormValid"
            class="w-full bg-[#FF5000] text-white font-semibold py-4 rounded-lg hover:bg-[#e04a00] transition disabled:opacity-50"
          >
            Enviar pedido
          </button>
          
          <!-- Datos importantes -->
          <div class="bg-gray-50 rounded-lg p-4">
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
<!-- Sección de confirmación de pedido -->
<div
  v-if="showSuccess"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
>
  <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-10 text-center relative">
    <div class="flex flex-col items-center mb-6">
      <div class="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="#22C55E"/>
          <path d="M8 12.5l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-2">¡Pedido confirmado!</h2>
      <div class="font-semibold mb-2">Nº Pedido: 25JUN0001</div>
      <p class="text-gray-600 mb-2">
        Nuestro equipo de Pro Business se pondrá en contacto con usted a la brevedad posible.<br>
        <br>
        Envíanos un WhatsApp.
      </p>
    </div>
    <div class="border-t my-6"></div>
    <a
      href="https://wa.me/51999999999?text=Hola,%20acabo%20de%20realizar%20un%20pedido%20en%20ProBusiness"
      target="_blank"
      class="inline-flex items-center justify-center bg-[#FF5000] text-white font-semibold px-6 py-3 rounded hover:bg-[#e04a00] transition"
    >
      <svg class="mr-2" width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
      Hablemos por WhatsApp
    </a>
  </div>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'

const { $formatPrice } = useNuxtApp();
const router = useRouter();
//add middleware to check if cart is empty
const cartStore = useCartStore();
const savedMessage = ref(false)
const mobileSummaryOpen = ref(false)

const toggleMobileSummary = () => {
  mobileSummaryOpen.value = !mobileSummaryOpen.value;
}
const { cartItems, cartTotal } = storeToRefs(cartStore); // <-- agrega cartTotal aquí
if (cartItems.value.length === 0) {
    router.push('/cart');
}
const { checkoutItems } = storeToRefs(cartStore)

function guardarDatos() {
  localStorage.setItem('checkoutInfo', JSON.stringify(form.value));
  savedMessage.value = true
  setTimeout(() => {
    savedMessage.value = false
  }, 2000)
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
// Arrays reactivos para selects

const showMinAlert = ref(false)
const showSuccess = ref(false)

const provinciasData = [
  {
    name: 'Lima',
    cities: [
      {
        name: 'Lima',
        districts: ['Miraflores', 'San Isidro', 'Surco']
      },
      {
        name: 'Callao',
        districts: ['Bellavista', 'La Perla']
      }
    ]
  },
  {
    name: 'Arequipa',
    cities: [
      {
        name: 'Arequipa',
        districts: ['Cercado', 'Yanahuara']
      }
    ]
  }
]

const provinces = ref(provinciasData.map(p => ({ name: p.name })))
const cities = ref([])
const districts = ref([])

function onProvinceChange() {
  form.value.city = ''
  form.value.district = ''
  const prov = provinciasData.find(p => p.name === form.value.province)
  cities.value = prov ? prov.cities.map(c => ({ name: c.name })) : []
  districts.value = []
}

function onCityChange() {
  form.value.district = ''
  const prov = provinciasData.find(p => p.name === form.value.province)
  const city = prov?.cities.find(c => c.name === form.value.city)
  districts.value = city ? city.districts.map(d => ({ name: d })) : []
}

const form = ref({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    district: ''
});
const isFormValid = computed(() =>
  form.value.fullName.trim() &&
  form.value.dni.trim() &&
  form.value.email.trim() &&
  form.value.phone.trim() &&
  form.value.province.trim() &&
  form.value.city.trim() &&
  form.value.district.trim()
)
function handlePedido() {
  // Validación del monto mínimo solo al enviar el pedido
  if (cartTotal.value < 3000) {
    showMinAlert.value = true
    return
  }
  // Aquí va tu lógica para enviar el pedido
  showSuccess.value = true
}

const handleSubmit = () => {
    localStorage.setItem('checkoutInfo', JSON.stringify(form.value));
    router.push('/checkout/review');
};
onMounted(() => {
    const savedInfo = localStorage.getItem('checkoutInfo');
    if (savedInfo) {
        form.value = JSON.parse(savedInfo);
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

</style>