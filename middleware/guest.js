// middleware/guest.js  
export default defineNuxtRouteMiddleware((to, from) => {
  console.log(`👤 Guest middleware: ${from?.path || 'undefined'} → ${to.path}`)
  
  // Solo ejecuta en el cliente y para rutas específicas
  if (process.client && (to.path === '/login' || to.path === '/register')) {
    const token = localStorage.getItem('access_token')
    console.log('🔑 Token en guest middleware:', !!token)
    
    if (token) {
      console.log('👤 Usuario ya logueado, redirigiendo a inicio')
      return navigateTo('/')
    }
  }
})
