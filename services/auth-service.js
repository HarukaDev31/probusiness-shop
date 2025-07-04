const API_BASE_URL = 'http://localhost:8000/api'

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: userData.nombre + ' ' + userData.apellido,
          email: userData.email,
          password: userData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  },

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar instrucciones')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servidor')
    }
  }
}