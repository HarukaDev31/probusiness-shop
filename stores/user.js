import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    token: ''
  }),
  actions: {
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
