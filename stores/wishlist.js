import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { wishlistService } from '~/services/wishlist-service'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loading: false
  }),

  getters: {
    wishlistCount: (state) => state.items.length,
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    }
  },

  actions: {
    async fetchWishlist() {
      const userStore = useUserStore()
      if (!userStore.token) {
        console.warn('Usuario no autenticado')
        return
      }

      this.loading = true
      try {
        const data = await wishlistService.getWishlist()
        this.items = data.data || []
      } catch (error) {
        console.error('Error al obtener lista de deseos:', error)
      } finally {
        this.loading = false
      }
    },

    async addToWishlist(product) {
      const userStore = useUserStore()
      if (!userStore.token) {
        console.warn('Usuario no autenticado')
        return false
      }

      try {
        const data = await wishlistService.addToWishlist(product.id)
        // Agregar el producto a la lista local
        if (!this.isInWishlist(product.id)) {
          this.items.push({
            id: product.id,
            name: product.name || product.nombre,
            price: product.price || product.precio,
            image: product.main_image_url || product.image,
            added_at: new Date().toISOString()
          })
        }
        return true
      } catch (error) {
        console.error('Error al agregar a lista de deseos:', error)
        return false
      }
    },

    async removeFromWishlist(productId) {
      const userStore = useUserStore()
      if (!userStore.token) {
        console.warn('Usuario no autenticado')
        return false
      }

      try {
        await wishlistService.removeFromWishlist(productId)
        // Remover el producto de la lista local
        this.items = this.items.filter(item => item.id !== productId)
        return true
      } catch (error) {
        console.error('Error al remover de lista de deseos:', error)
        return false
      }
    },

    async toggleWishlist(product) {
      return await this.addToWishlist(product)

    },

    async clearWishlist() {
      const userStore = useUserStore()
      if (!userStore.token) {
        console.warn('Usuario no autenticado')
        return false
      }

      try {
        await wishlistService.clearWishlist()
        this.items = []
        return true
      } catch (error) {
        console.error('Error al limpiar lista de deseos:', error)
        return false
      }
    }
  }
}) 