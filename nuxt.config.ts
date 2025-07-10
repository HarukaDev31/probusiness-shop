// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // '@pinia-plugin-persistedstate/nuxt', // Deshabilitado temporalmente
    '@nuxt/icon',
    '@nuxt/image',

  ],
  nitro: {
    experimental: {
      wasm: true
    }
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production'
        }
      }
    }
  },
  experimental: {
    payloadExtraction: true // Extrae carga útil para páginas estáticas
  },
  app: {
    head: {
      title: 'ProBusiness - Tienda Online',
      // meta: [
      //   { charset: 'utf-8' },
      //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      //   { name: 'description', content: 'Tienda online con productos de alta calidad' }
      // ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'http://localhost:8000', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap' }
      ]
    },
    //use .env to define environment variables

  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:8000/api',
      authApiUrl: process.env.AUTH_API_URL || 'http://localhost:8000/api'
    }
  },
  image: {
    provider: 'ipx',
    ipx: {
      modifiers: {
        format: 'webp',
        quality: '80'
      }
    }
  }
})