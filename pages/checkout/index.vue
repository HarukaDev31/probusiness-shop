<template>
  <div class="min-h-screen bg-[#f5f8fb] flex flex-col">
    <div class="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12 max-w-[1200px] mx-auto w-full">
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
                <input v-model="form.fullName" type="text" required class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ingresa tus nombres y apellidos">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DNI/ID*</label>
                <input v-model="form.dni" type="text" required maxlength="8" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ingresa tu documento de identidad">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
                <input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ingresa tu correo">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp*</label>
                <input v-model="form.phone" type="tel" required maxlength="9" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ingresa tu número de celular">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Provincia*</label>
                    <select v-model="form.province" @change="onProvinceChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    <option value="">Selecciona provincia</option>
                    <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                    <select v-model="form.city" @change="onCityChange" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    <option value="">Selecciona ciudad</option>
                    <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distrito*</label>
                    <select v-model="form.district" required class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    <option value="">Selecciona distrito</option>
                    <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
                    </select>
                </div>
                </div>
            <button type="submit" class="w-[25%] bg-[#FF5000] text-white font-semibold p-3 rounded mt-4">Guardar</button>
          </form>
        </div>
        <!-- Productos seleccionados -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-base font-bold mb-4">Productos seleccionados</h3>
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 mb-4">
            <img :src="item.image" alt="" class="w-14 h-14 rounded object-cover" />
            <div class="flex-1">
              <div class="font-semibold">{{ item.name }}</div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="decreaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded">-</button>
                <input type="number" v-model.number="item.quantity" min="1" class="w-14 text-center border rounded" />
                <button @click="increaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded">+</button>
              </div>
            </div>
            <div class="font-semibold">s/{{ (item.price * item.quantity).toFixed(2) }}</div>
            <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
          <NuxtLink to="/cart" class="text-primary text-sm hover:underline">Agregar productos</NuxtLink>
        </div>
      </div>
      <!-- Columna derecha -->
      <div class="w-full md:w-[340px] flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 class="text-lg font-bold mb-6">Resumen del pedido</h3>
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-600">Pagar en soles:</span>
            <span class="text-2xl font-bold text-gray-800">s/{{ cartTotal.toFixed(2) }}</span>
          </div>
          <button class="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg hover:bg-[#e04a00] transition">Enviar pedido</button>
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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
const router = useRouter();
//add middleware to check if cart is empty
const cartStore = useCartStore();
const { cartItems, cartTotal } = storeToRefs(cartStore); // <-- agrega cartTotal aquí
if (cartItems.value.length === 0) {
    router.push('/cart');
}
const { checkoutItems } = storeToRefs(cartStore)

function increaseQuantity(item) {
  cartStore.updateItemQuantity(item.id, item.quantity + 1);
}
function decreaseQuantity(item) {
  if (item.quantity > 1) {
    cartStore.updateItemQuantity(item.id, item.quantity - 1);
  }
}
function removeItem(productId) {
  cartStore.removeItem(productId);
}
// Arrays reactivos para selects
const provinces = ref([])
const cities = ref([])
const districts = ref([])

const form = ref({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    district: ''
});

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