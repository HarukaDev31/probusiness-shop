import { ref, onUnmounted, nextTick } from 'vue'

export const useScreenSize = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const windowWidth = ref(0)
  const windowHeight = ref(0)

  // Función para actualizar el estado del viewport
  const updateViewport = () => {
    if (process.client && typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
      
      // Definir breakpoints
      isMobile.value = windowWidth.value < 768
      isTablet.value = windowWidth.value >= 768 && windowWidth.value < 1024
      isDesktop.value = windowWidth.value >= 1024
    }
  }

  // Inicializar en el cliente
  if (process.client) {
    // Usar nextTick para asegurar que el DOM esté listo
    nextTick(() => {
      updateViewport()
      
      // Escuchar cambios de tamaño de ventana
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateViewport)
        
        // Limpiar listener al desmontar
        onUnmounted(() => {
          window.removeEventListener('resize', updateViewport)
        })
      }
    })
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    windowWidth,
    windowHeight,
    updateViewport
  }
} 