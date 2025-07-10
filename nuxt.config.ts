// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Mantener SPA para estabilidad
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
      title: 'ProBusiness - Tienda Online | Productos de Importación',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ProBusiness - Tu tienda online de confianza para productos de importación. Encuentra electrónicos, belleza, decoración y más con los mejores precios y calidad garantizada.' },
        { name: 'keywords', content: 'tienda online, importación, electrónicos, belleza, decoración, productos, Perú, compras online' },
        { name: 'author', content: 'ProBusiness' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        // Open Graph
        { property: 'og:title', content: 'ProBusiness - Tienda Online | Productos de Importación' },
        { property: 'og:description', content: 'Tu tienda online de confianza para productos de importación. Encuentra electrónicos, belleza, decoración y más.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://tienda.probusiness.pe' },
        { property: 'og:image', content: '/images/logo.png' },
        { property: 'og:site_name', content: 'ProBusiness' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ProBusiness - Tienda Online' },
        { name: 'twitter:description', content: 'Tu tienda online de confianza para productos de importación' },
        { name: 'twitter:image', content: '/images/logo.png' },
        // Structured Data
        { name: 'application-name', content: 'ProBusiness' },
        { name: 'theme-color', content: '#FF5000' },
        { name: 'msapplication-TileColor', content: '#FF5000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'ProBusiness' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'http://localhost:8000', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap' }
      ],
      script: [
        // Google Analytics (reemplaza con tu ID)
        { src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID', async: true },
        { innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        `, type: 'text/javascript' }
      ]
    },
  },
  image: {
    provider: 'ipx',
    ipx: {
      modifiers: {
        format: 'webp',
        quality: '80'
      }
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:8000/api',
      authApiUrl: process.env.AUTH_API_URL || 'http://localhost:8000/api'
    }
  },
})