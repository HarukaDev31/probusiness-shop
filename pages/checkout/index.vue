<template>
    <div class="container-custom py-8 ">

        <div class="bg-white rounded-lg shadow-md  max-w-3xl w-3/4 mx-auto shadow-lg">
            <h1 class="text-4xl font-bold mb-2 p-10">Información de contacto</h1>
            <div class="border-b border-gray-300 mb-4"></div>

            <form @submit.prevent="handleSubmit" class="space-y-6 px-20 py-10">
                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1
                    col-span-1 md:col-span-2">
                        Nombres completos <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.fullName" type="text" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50
                        col-span-1 md:col-span-3">
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        DNI<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.dni" type="text" required maxlength="8"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        Correo<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.email" type="email" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center ">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        Celular<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.phone" type="tel" required maxlength="9"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-2 col-span-1 md:col-span-2">
                        Tipo de comprobante<span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-4">
                        <label class="flex items-center border-gray-300 border rounded-md px-4 py-2">
                            <input type="radio" v-model="form.documentType"
                            @change="form.type = form.documentType"
                            value="boleta"
                                class="accent-orange-300 border-orange-300">
                            <span class="ml-2 border-orange-300">Boleta</span>
                        </label>
                        <label class="flex items-center border-gray-300 border rounded-md px-4 py-2">
                            <input type="radio" v-model="form.documentType" value="factura"
                            @change="form.type = form.documentType"
                                class="accent-orange-300 border-orange-300">
                            <span class="ml-2">Factura</span>
                        </label>
                    </div>
                </div>
                <!--if factura is selected add razon social and ruc fiedls -->
                <div v-if="form.documentType === 'factura'" class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        Razón social<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.businessName" type="text" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>
                <div v-if="form.documentType === 'factura'" class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        RUC<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.ruc" type="text" required maxlength="11"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        Ciudad<span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.city" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                        <option value="">Selecciona una ciudad</option>
                        <option v-for="city in cities" :key="city" :value="city">
                            {{ city }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 align-items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-1 col-span-1 md:col-span-2">
                        Dirección<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.address" type="text" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 col-span-1 md:col-span-3">
                </div>

                <div class="flex gap-4 pt-4">
                    <NuxtLink to="/cart"
                        class="flex-1 rounded-full  px-6 py-3 bg-white border-gray-300 text-gray-400 border-2  rounded text-center hover:bg-gray-300 hover:text-gray-700 transition">
                        Regresar
                    </NuxtLink>
                    <button type="submit" class="flex-1 btn py-3 rounded-full ">
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const router = useRouter();
//add middleware to check if cart is empty
const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);
if (cartItems.value.length === 0) {
    router.push('/cart');
}
const cities = [
    'Lima',
    'Arequipa',
    'Trujillo',
    'Chiclayo',
    'Piura',
    'Cusco',
    'Huancayo'
];

const form = ref({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    documentType: 'boleta',
    city: '',
    address: '',
    businessName: '',
    ruc: '',
    type: 'boleta'
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