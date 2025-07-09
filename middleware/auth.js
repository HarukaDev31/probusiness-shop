// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecuta en el cliente
  if (process.client) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
}) 