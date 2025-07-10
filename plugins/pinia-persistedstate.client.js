import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // Esperar a que el DOM esté listo
  if (process.client) {
    // Usar nextTick para asegurar que Nuxt esté completamente inicializado
    nuxtApp.hook('app:mounted', () => {
      try {
        if (nuxtApp.$pinia && typeof nuxtApp.$pinia.use === 'function') {
          nuxtApp.$pinia.use(piniaPluginPersistedstate)
        }
      } catch (error) {
        console.warn('Pinia plugin not available:', error)
      }
    })
  } else {
    // Para SSR, intentar inicializar inmediatamente
    try {
      if (nuxtApp.$pinia && typeof nuxtApp.$pinia.use === 'function') {
        nuxtApp.$pinia.use(piniaPluginPersistedstate)
      }
    } catch (error) {
      console.warn('Pinia plugin not available during SSR:', error)
    }
  }
})
