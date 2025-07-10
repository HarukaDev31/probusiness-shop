import { useCartStore } from '~/stores/cart'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const cartStore = useCartStore()
    if (!cartStore.items) cartStore.items = []
    if (to.path.startsWith('/checkout') && (!cartStore.items || cartStore.items.length === 0)) {
      return navigateTo('/cart')
    }
  }
}) 