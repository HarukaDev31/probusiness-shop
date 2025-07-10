import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // Solo inicializar en el cliente
  if (process.client) {
    try {
      if (nuxtApp.$pinia && typeof nuxtApp.$pinia.use === 'function') {
        nuxtApp.$pinia.use(piniaPluginPersistedstate)
      }
    } catch (error) {
      console.warn('Pinia plugin not available:', error)
    }
  }
})
