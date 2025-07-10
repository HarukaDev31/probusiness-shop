// middleware/cart-init.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecuta en el cliente
  if (process.client) {
    try {
      // Esperar un poco para que Nuxt esté completamente inicializado
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Verificar que Pinia esté disponible
      if (typeof window !== 'undefined' && window.$pinia) {
        // Esperar a que Pinia esté completamente inicializado
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // Importar el store de forma dinámica
      const { useCartStore } = await import('~/stores/cart')
      const cartStore = useCartStore()
      
      // Verificar que el carrito esté inicializado
      if (!cartStore.items) {
        cartStore.items = []
      }
      
      // Si es checkout y el carrito está vacío, redirigir a cart
      if (to.path === '/checkout' && (!cartStore.items || cartStore.items.length === 0)) {
        return navigateTo('/cart')
      }
      
    } catch (error) {
      console.warn('Error initializing cart store:', error)
      // Si hay error, redirigir a home
      return navigateTo('/')
    }
  }
}) 