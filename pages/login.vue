<template>
  <div class="min-h-screen flex">
    <!-- Fondo izquierdo -->
    <div class="hidden md:flex w-1/2 h-screen items-center justify-center bg-cover bg-center relative" style="background-image: url('/images/bg-login.jpg');">
      <div class="absolute bottom-10 left-10 text-white">
        <img src="/images/logo.png" alt="probusiness logo" class="h-8 mb-2" />
        <div class="font-semibold">Probusiness® 2025</div>
      </div>
    </div>
    <!-- Lado derecho -->
    <div class="w-full md:w-1/2 flex items-center justify-center min-h-screen bg-[#f5f8fb]">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
        <!-- Mostrar solo el registro si showRegister es true -->
        <template v-if="showRegister">
          <button @click="closeRegister" class="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
          <h2 class="text-2xl font-bold text-center mb-2">Registrarme</h2>
          <div class="border-b my-4"></div>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-gray-600 mb-1" for="nombre">Nombres</label>
              <input id="nombre" v-model="registerData.nombre" type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000]" placeholder="Ingresa tus nombres" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1" for="apellido">Apellidos</label>
              <input id="apellido" v-model="registerData.apellido" type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000]" placeholder="Ingresa tus apellidos" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1" for="whatsapp">WhatsApp</label>
              <input id="whatsapp" v-model="registerData.whatsapp" type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000]" placeholder="Ingresa tu número de celular" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1" for="email">Correo electrónico</label>
              <input id="email" v-model="registerData.email" type="email" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000]" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1" for="password">Contraseña</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="registerData.password" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000] pr-10" placeholder="Ingresa tu contraseña" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2 text-gray-400 text-sm focus:outline-none">
                  <span v-if="showPassword">🙈</span>
                  <span v-else>👁️</span>
                </button>
              </div>
            </div>
            <button type="submit" :disabled="loading" class="w-full bg-[#FF5000] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#e04a00] transition disabled:opacity-60">
              Crear cuenta
            </button>
            <div v-if="registerSuccess" class="text-green-500 text-sm text-center mt-2">¡Registro exitoso!</div>
          </form>
          <div class="mt-6 text-xs text-gray-400 text-center">
            Al registrarte aceptas nuestra <a href="#" class="underline">política de privacidad</a> y <a href="#" class="underline">términos y condiciones</a>.
          </div>
        </template>
        <!-- Si showRegister es false, muestra el login -->
        <template v-else>
          <h2 class="text-2xl font-bold text-center mb-8">Iniciar sesión</h2>
          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-gray-600 mb-1" for="email">Correo</label>
              <input id="email" v-model="loginData.email" type="email" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000]" placeholder="Ingresa tu correo" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1" for="password">Contraseña</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="loginData.password" class="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF5000] pr-10" placeholder="Ingresa tu contraseña" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2 text-gray-400 text-sm focus:outline-none">
                  <span v-if="showPassword">🙈</span>
                  <span v-else>👁️</span>
                </button>
              </div>
            </div>
            <button type="submit" :disabled="loginLoading" class="w-full bg-[#FF5000] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#e04a00] transition disabled:opacity-60">
              Ingresar
            </button>
            <div v-if="loginError" class="text-red-500 text-sm text-center mt-2">{{ loginError }}</div>
            <div v-if="loginSuccess" class="text-green-500 text-sm text-center mt-2">¡Has iniciado sesión exitosamente!</div>
          </form>
          <div class="mt-8 text-center">
            <div class="mb-4 text-gray-700">¿Aún no tienes una cuenta?</div>
            <button @click="showRegister = true" class="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">Registrarme</button>
          </div>
          <div class="mt-4 text-xs text-gray-400 text-center">
            Al registrarte aceptas nuestra <a href="#" class="underline">política de privacidad</a> y <a href="#" class="underline">términos y condiciones</a>.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
const router = useRouter()
const showRegister = ref(false)
const registerSuccess = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const registerData = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  ofertas: false
})

const showForgot = ref(false)
const forgotEmail = ref('')
const forgotSuccess = ref(false)
const forgotLoading = ref(false)

const loginData = ref({ email: '', password: '' })
const loginLoading = ref(false)
const loginError = ref('')
const loginSuccess = ref(false)

function handleRegister() {
  loading.value = true
  fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: registerData.value.nombre + ' ' + registerData.value.apellido,
      email: registerData.value.email,
      password: registerData.value.password
    })
  })
    .then(async res => {
      if (res.ok) {
        registerSuccess.value = true
        setTimeout(() => {
          closeRegister()
        }, 2000)
      } else {
        let data
        try {
          data = await res.json()
        } catch (e) {
          data = { message: 'Respuesta inválida del servidor' }
        }
        alert(data.message || 'Error al registrar usuario')
      }
    })
    .catch(error => {
      console.error('Error al registrar usuario:', error)
      alert('Error al registrar usuario')
    })
    .finally(() => {
      loading.value = false
    })
}
function closeRegister() {
  showRegister.value = false
  registerSuccess.value = false
  loading.value = false
  registerData.value = { nombre: '', apellido: '', email: '', password: '', ofertas: false }
  showPassword.value = false
}
function handleForgot() {
  forgotLoading.value = true
  setTimeout(() => {
    forgotLoading.value = false
    forgotSuccess.value = true
  }, 1200)
}
function closeForgot() {
  showForgot.value = false
  forgotSuccess.value = false
  forgotLoading.value = false
  forgotEmail.value = ''
}
function handleLogin() {
  loginLoading.value = true
  loginError.value = ''
  fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      email: loginData.value.email,
      password: loginData.value.password
    })
  })
    .then(async res => {
      let data
      try {
        data = await res.json()
      } catch (e) {
        data = { message: 'Respuesta inválida del servidor' }
      }
      if (res.ok && data.access_token) {
        const userStore = useUserStore()
        userStore.setUser({
          name: data.user?.name,
          email: data.user?.email,
          token: data.access_token
        })
        loginSuccess.value = true
        setTimeout(() => {
          loginSuccess.value = false
          router.push('/')
        }, 2000)
      } else {
        loginError.value = data.message || 'Credenciales incorrectas'
      }
    })
    .catch(() => {
      loginError.value = 'Error de conexión con el servidor'
    })
    .finally(() => {
      loginLoading.value = false
    })
}
definePageMeta({ middleware: 'guest' })
</script>
