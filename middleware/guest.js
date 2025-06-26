// middleware/guest.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecuta en el cliente
  if (process.client) {
    if (localStorage.getItem('access_token')) {
      return navigateTo('/')
    }
  }
})
