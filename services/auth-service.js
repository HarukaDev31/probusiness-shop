import { apiClient } from '~/utils/api-client'

export const authService = {
  async login(email, password) {
    try {
      return await apiClient.auth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async register(userData) {
    try {
      return await apiClient.auth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: userData.nombre + ' ' + userData.apellido,
          email: userData.email,
          whatsapp: userData.whatsapp,
          password: userData.password
        })
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async forgotPassword(email) {
    try {
      return await apiClient.auth('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      })
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  }
}