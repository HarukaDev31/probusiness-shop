import { defineStore } from 'pinia'
import { authService } from '@/services/auth-service'
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    token: ''
  }),
  actions: {
    async loginUser(email, password) {
      const data = await authService.login(email, password)
      this.setUser({
        name: data.user.name,
        email: data.user.email,
        token: data.access_token
      })
      return data
    },
    
    async registerUser(userData) {
      const data = await authService.register(userData)
      console.log(data.access_token)
      this.setUser({
        name: data.user.name,
        email: data.user.email,
        token: data.access_token
      })
      return data
    },
    setUser({ name, email, token }) {
      this.name = name || ''
      this.email = email || ''
      this.token = token || ''
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('access_token', token)
        if (name) localStorage.setItem('user_name', name)
        if (email) localStorage.setItem('user_email', email)
      }
    },
    syncFromLocalStorage() {
      if (typeof window !== 'undefined') {
        this.name = localStorage.getItem('user_name') || ''
        this.email = localStorage.getItem('user_email') || ''
        this.token = localStorage.getItem('access_token') || ''
      }
    },
    logout() {
      this.name = ''
      this.email = ''
      this.token = ''
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_name')
        localStorage.removeItem('user_email')
      }
    }
  }
})
