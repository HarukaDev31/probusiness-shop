export default defineNuxtPlugin(() => {
  const loading = useLoadingStore()

  // Mostrar spinner al iniciar navegación
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('page:start', () => {
    console.log('Page start - setting loading to true')
    loading.setLoading(true)
  })

  // Ocultar spinner al completar navegación
  nuxtApp.hook('page:finish', () => {
    console.log('Page finish - setting loading to false')
    setTimeout(() => {
      loading.setLoading(false)
    }, 500)
  })

  // Ocultar spinner en caso de error
  nuxtApp.hook('page:error', () => {
    console.log('Page error - setting loading to false')
    loading.setLoading(false)
  })
}) 