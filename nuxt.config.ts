// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Deshabilitar SSR temporalmente para evitar problemas
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
  ],
  app: {
    head: {
      title: 'ProBusiness - Tienda Online',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'http://localhost:8000', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap' }
      ]
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:8000/api',
      authApiUrl: process.env.AUTH_API_URL || 'http://localhost:8000/api'
    }
  },
})