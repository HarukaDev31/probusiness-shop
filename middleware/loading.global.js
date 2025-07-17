export default defineNuxtRouteMiddleware((to, from) => {
  // Temporalmente deshabilitado para debuggear el bucle infinito
  // const loading = useLoadingStore()
  // if (process.client) {
  //   // Solo mostrar loading si no estamos siendo redirigidos por autenticación
  //   if (to.path !== '/login' || from.path === '/login') {
  //     loading.setLoading(true)
  //     setTimeout(() => {
  //       loading.setLoading(false)
  //     }, 600)
  //   }
  // }
}) 