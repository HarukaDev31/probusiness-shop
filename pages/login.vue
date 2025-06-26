<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-8 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div class="flex flex-col items-center mb-8">
        <img src="/images/logo.png" alt="probusiness logo" class="h-10 mb-2" />
        <span class="text-xl font-bold text-gray-700">probusiness</span>
      </div>
      <h2 class="text-2xl font-bold text-center mb-6">Ingresar</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-gray-600 mb-1" for="email">Tu dirección de E-mail</label>
          <input id="email" v-model="loginData.email" type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label class="block text-gray-600 mb-1" for="password">Contraseña</label>
          <input id="password" v-model="loginData.password" type="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="••••••••" />
          <div class="text-right mt-1">
            <button type="button" @click="showForgot = true" class="text-sm text-red-500 hover:underline bg-transparent border-0 p-0">¿Olvidaste tu contraseña?</button>
          </div>
        </div>
        <button type="submit" :disabled="loginLoading" class="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition disabled:opacity-60">
          <span v-if="loginLoading" class="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"></span>
          Ingresar
        </button>
        <div v-if="loginError" class="text-red-500 text-sm text-center mt-2">{{ loginError }}</div>
        <div v-if="loginSuccess" class="text-green-500 text-sm text-center mt-2">¡Has iniciado sesión exitosamente!</div>
      </form>
      <div class="flex items-center my-6">
        <div class="flex-grow h-px bg-gray-200"></div>
        <span class="mx-3 text-gray-400">o</span>
        <div class="flex-grow h-px bg-gray-200"></div>
      </div>
      <!-- Registro -->
      <div class="text-center mb-6">
        <span class="text-gray-600">¿No tienes una cuenta?</span>
        <button @click="showRegister = true" class="ml-2 text-red-500 font-semibold hover:underline">Regístrate</button>
      </div>
      <div v-if="showRegister" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" @mousedown.self="closeRegister">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button @click="closeRegister" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
          <h2 class="text-2xl font-bold text-center mb-2">Regístrate</h2>
          <div class="text-center text-gray-500 mb-4">O regístrate con tu email</div>
          <form v-if="!registerSuccess" @submit.prevent="handleRegister" class="space-y-4">
            <div class="flex gap-2">
              <input v-model="registerData.nombre" type="text" placeholder="Nombre" class="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input v-model="registerData.apellido" type="text" placeholder="Apellido" class="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <input v-model="registerData.email" type="email" placeholder="Tu dirección de E-mail" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="registerData.password" placeholder="Contraseña para tienda" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-16" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2 text-gray-400 text-sm">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
              <p class="text-xs text-gray-500 mt-1">(*) La contraseña debe tener al menos 6 caracteres.</p>
            </div>
            <div class="flex items-center">
              <input v-model="registerData.ofertas" type="checkbox" id="ofertas" class="mr-2" />
              <label for="ofertas" class="text-sm">Recibir Ofertas!</label>
            </div>
            <button :disabled="loading" type="submit" class="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition disabled:opacity-60">Regístrate</button>
          </form>
          <div v-else class="flex flex-col items-center space-y-4 py-8">
            <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <div class="text-green-700 text-center text-lg font-semibold">¡Registro exitoso!</div>
            <div class="text-gray-500 text-center">Ya puedes iniciar sesión con tu correo y contraseña.</div>
          </div>
          <div class="text-xs text-gray-500 mt-4 text-left">
            * Al ingresar con Facebook o Google estás aceptando recibir ofertas por email<br>
            Tienda está protegida por reCAPTCHA y se aplican la <a href="#" class="text-blue-600 underline">Política de Privacidad</a> y los <a href="#" class="text-blue-600 underline">Términos de Servicio de Google</a>.
          </div>
          <div class="flex items-center my-6">
            <div class="flex-grow h-px bg-gray-200"></div>
            <span class="mx-3 text-xs text-gray-400">¿Ya tienes una cuenta? </span>
            <div class="flex-grow h-px bg-gray-200"></div>
          </div>
          <div class="mt-6 text-center">
            <button @click="closeRegister" class="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">Ingresar</button>
          </div>
        </div>
      </div>
      <!-- Modal de Recuperar Contraseña -->
      <div v-if="showForgot" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" @mousedown.self="closeForgot">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button @click="closeForgot" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
          <h2 class="text-2xl font-bold text-center mb-2">Recuperar contraseña</h2>
          <div class="text-center text-gray-500 mb-4">Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</div>
          <form v-if="!forgotSuccess" @submit.prevent="handleForgot" class="space-y-4">
            <input v-model="forgotEmail" type="email" placeholder="Tu dirección de E-mail" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" required />
            <button :disabled="forgotLoading" type="submit" class="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition disabled:opacity-60">Enviar instrucciones</button>
          </form>
          <div v-else class="flex flex-col items-center space-y-4">
            <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <div class="text-green-700 text-center">Si el correo existe, te hemos enviado instrucciones para restablecer tu contraseña.</div>
          </div>
        </div>
      </div>
      <div class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
        <p class="font-semibold mb-2">Guardamos tu correo electrónico de manera 100% segura para:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Identificar tu perfil</li>
          <li>Notificar sobre el estado de tus compras</li>
          <li>Guardar el historial de compra</li>
          <li>Facilitar el proceso de compra</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
        localStorage.setItem('access_token', data.access_token)
        if (data.user && data.user.name) {
          localStorage.setItem('user_name', data.user.name)
        }
        loginSuccess.value = true
        setTimeout(() => {
          loginSuccess.value = false
          window.location.href = '/'
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
