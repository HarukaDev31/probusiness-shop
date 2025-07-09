export default defineNuxtPlugin(() => {
  const { $modal } = useNuxtApp()
  const userStore = useUserStore()
  const router = useRouter()

  // Función para manejar errores 401
  const handleUnauthorized = () => {
    // Limpiar datos del usuario
    userStore.logout()
    
    // Mostrar mensaje al usuario
    $modal.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'Sesión Expirada')
    
    // Redirigir al login
    router.push('/login')
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