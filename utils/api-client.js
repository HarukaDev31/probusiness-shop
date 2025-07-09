// Función para obtener el token del store
const getAuthToken = () => {
  const userStore = useUserStore()
  return userStore.token
}

// Función para hacer peticiones HTTP con manejo automático de 401
export const apiClient = {
  async request(endpoint, options = {}) {
    const { $modal } = useNuxtApp()
    const userStore = useUserStore()
    const router = useRouter()

    // Configurar headers por defecto
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }

    // Agregar token de autorización si existe
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      })

      // Manejar respuesta 401 automáticamente
      if (response.status === 401) {
        // Limpiar datos del usuario
        userStore.logout()
        
        // Mostrar mensaje al usuario
        $modal.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'Sesión Expirada')
        
        // Redirigir al login
        router.push('/login')
        
        throw new Error('Unauthorized')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`)
      }

      return data
    } catch (error) {
      // Si ya es un error de 401, no hacer nada más
      if (error.message === 'Unauthorized') {
        throw error
      }
      
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  // Métodos HTTP convenientes
  async get(endpoint) {
    return this.request(endpoint)
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  },

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  // Métodos específicos para diferentes APIs
  async auth(endpoint, options = {}) {
    const { public: { authApiUrl } } = useRuntimeConfig()
    return this.request(`${authApiUrl}${endpoint}`, options)
  },

  async api(endpoint, options = {}) {
    const { public: { apiUrl } } = useRuntimeConfig()
    return this.request(`${apiUrl}${endpoint}`, options)
  }
} 