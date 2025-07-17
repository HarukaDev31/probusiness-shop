// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return

  console.log(`🔒 Auth middleware ejecutándose: ${from?.path || 'inicial'} → ${to.path}`)
  
  const token = localStorage.getItem('access_token')
  console.log('🔑 Token encontrado:', !!token)
  
  if (!token) {
    // Guardar la ruta destino para redireccionar después del login
    if (!localStorage.getItem('checkingRoute')) {
      console.log('💾 Guardando ruta de retorno:', to.path)
      localStorage.setItem('checkingRoute', to.path)
    } else {
      localStorage.removeItem('checkingRoute')
      localStorage.setItem('checkingRoute', to.path)
    }
    
    console.log('🚨 Sin token, redirigiendo a login...')
    return navigateTo('/login')
  }
  
  console.log('✅ Usuario autenticado, permitiendo acceso a:', to.path)
}) 