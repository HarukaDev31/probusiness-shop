<template>
    <div class="container-custom py-8">
        <h1 class="text-2xl font-bold mb-6">Información de contacto</h1>

        <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Nombres completos*
                    </label>
                    <input v-model="form.fullName" type="text" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        DNI*
                    </label>
                    <input v-model="form.dni" type="text" required maxlength="8"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Correo*
                    </label>
                    <input v-model="form.email" type="email" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Celular*
                    </label>
                    <input v-model="form.phone" type="tel" required maxlength="9"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de comprobante*
                    </label>
                    <div class="flex gap-4">
                        <label class="flex items-center">
                            <input type="radio" v-model="form.documentType" value="boleta" class="text-primary">
                            <span class="ml-2">Boleta</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" v-model="form.documentType" value="factura" class="text-primary">
                            <span class="ml-2">Factura</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad*
                    </label>
                    <select v-model="form.city" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">Selecciona una ciudad</option>
                        <option v-for="city in cities" :key="city" :value="city">
                            {{ city }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Dirección*
                    </label>
                    <input v-model="form.address" type="text" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>

                <div class="flex gap-4 pt-4">
                    <NuxtLink to="/cart"
                        class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded text-center hover:bg-gray-300 transition">
                        Regresar
                    </NuxtLink>
                    <button type="submit" class="flex-1 btn py-3">
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
    address: ''
});

const handleSubmit = () => {
    // Store form data in localStorage for next step
    localStorage.setItem('checkoutInfo', JSON.stringify(form.value));
    router.push('/checkout/review');
};
</script>