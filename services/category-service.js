import { apiClient } from '~/utils/api-client'

class CategoryService {
  
  async getCategories() {
    try {
      const data = await apiClient.api('/categories')
      return data.data
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  }
}

export const categoryService = new CategoryService()