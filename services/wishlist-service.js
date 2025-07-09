import { apiClient } from '~/utils/api-client'

export const wishlistService = {
  async getWishlist() {
    try {
      return await apiClient.auth('/wishlist')
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async addToWishlist(productId) {
    try {
      return await apiClient.auth('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId })
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async removeFromWishlist(productId) {
    try {
      return await apiClient.auth(`/wishlist/${productId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async clearWishlist() {
    try {
      return await apiClient.auth('/wishlist/clear', {
        method: 'DELETE'
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  }
} 