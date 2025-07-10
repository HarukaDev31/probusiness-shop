export default defineNuxtPlugin((nuxtApp) => {
  const { $modal } = nuxtApp
  let userStore
  let router
  
  // Solo inicializar en el cliente
  if (process.client) {
    try {
      userStore = useUserStore()
      router = useRouter()
    } catch (error) {
      console.warn('Stores not available:', error)
    }
  }

  // Función para manejar errores 401
  const handleUnauthorized = () => {
    try {
      // Limpiar datos del usuario
      if (userStore && typeof userStore.logout === 'function') {
        userStore.logout()
      }
      
      // Mostrar mensaje al usuario
      if ($modal && typeof $modal.showWarning === 'function') {
        $modal.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'Sesión Expirada')
      }
      
      // Redirigir al login
      if (router && typeof router.push === 'function') {
        router.push('/login')
      }
    } catch (error) {
      console.warn('Error handling unauthorized:', error)
    }
  }

  // Interceptar fetch globalmente
  const originalFetch = globalThis.fetch
  globalThis.fetch = async function(...args) {
    try {
      const response = await originalFetch(...args)
      
      // Verificar si la respuesta es 401
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error('Unauthorized')
      }
      
      return response
    } catch (error) {
      // Si es un error de red, no hacer nada especial
      throw error
    }
  }

  // Proporcionar función de manejo de 401 para uso manual
  return {
    provide: {
      handleUnauthorized
    }
  }
}) 