# 🚀 Guía Rápida - ProBusiness Shop

## ⚡ Inicio Rápido

### 1. Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd probusiness-shop

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API_URL
```

### 2. Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

### 3. Build de Producción
```bash
# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run generate     # Generar sitio estático
npm run preview      # Preview de producción
npm run lint         # Linting del código
```

### Git
```bash
git add .            # Añadir cambios
git commit -m "feat: nueva funcionalidad"
git push origin main # Subir cambios
```

---

## 📁 Estructura Rápida

```
probusiness-shop/
├── components/       # Componentes Vue
├── pages/           # Páginas de la app
├── stores/          # Estado global (Pinia)
├── services/        # Servicios de API
├── composables/     # Lógica reutilizable
├── layouts/         # Layouts de la app
├── middleware/      # Middleware de rutas
└── utils/           # Utilidades
```

---

## 🔧 Configuración Rápida

### Variables de Entorno (.env)
```bash
API_URL=http://localhost:8000/api
NODE_ENV=development
```

### Nuxt Config (nuxt.config.ts)
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL
    }
  }
})
```

---

## 🧩 Componentes Principales

### Crear un Nuevo Componente
```vue
<!-- components/MiComponente.vue -->
<template>
  <div class="mi-componente">
    <h1>{{ titulo }}</h1>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: 'Mi Componente'
  }
});
</script>
```

### Usar un Store
```vue
<script setup>
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { items, cartTotal } = storeToRefs(cartStore);

// Añadir producto al carrito
cartStore.addItem(product);
</script>
```

---

## 🌐 API Calls

### Crear un Nuevo Servicio
```javascript
// services/mi-servicio.js
class MiServicio {
  async getData() {
    const { public: { apiUrl } } = useRuntimeConfig();
    const response = await fetch(`${apiUrl}/endpoint`);
    return response.json();
  }
}

export const miServicio = new MiServicio();
```

### Usar un Servicio
```javascript
import { miServicio } from '~/services/mi-servicio';

// En un componente o store
const data = await miServicio.getData();
```

---

## 📦 Stores (Pinia)

### Crear un Nuevo Store
```javascript
// stores/mi-store.js
import { defineStore } from 'pinia';

export const useMiStore = defineStore('mi-store', {
  state: () => ({
    data: [],
    loading: false
  }),

  getters: {
    getData: (state) => state.data
  },

  actions: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await miServicio.getData();
        this.data = response;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

### Usar un Store
```javascript
import { useMiStore } from '~/stores/mi-store';

const miStore = useMiStore();
const { data, loading } = storeToRefs(miStore);

// Cargar datos
await miStore.fetchData();
```

---

## 🛣️ Rutas y Navegación

### Crear una Nueva Página
```vue
<!-- pages/mi-pagina.vue -->
<template>
  <div>
    <h1>Mi Página</h1>
    <p>Contenido de la página</p>
  </div>
</template>

<script setup>
// Meta tags
useHead({
  title: 'Mi Página',
  meta: [
    { name: 'description', content: 'Descripción de mi página' }
  ]
});
</script>
```

### Navegación Programática
```javascript
// Navegar a una página
navigateTo('/mi-pagina');

// Navegar con parámetros
navigateTo('/producto/123');

// Navegar con query params
navigateTo('/busqueda?q=laptop');
```

---

## 🔐 Autenticación

### Login de Usuario
```javascript
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

try {
  await userStore.loginUser(email, password);
  // Usuario logueado exitosamente
} catch (error) {
  // Manejar error
  console.error('Error de login:', error);
}
```

### Verificar Autenticación
```javascript
const userStore = useUserStore();

// Verificar si está autenticado
if (userStore.token) {
  // Usuario autenticado
} else {
  // Usuario no autenticado
}
```

---

## 🛒 Carrito de Compras

### Añadir Producto al Carrito
```javascript
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

// Añadir producto
cartStore.addItem({
  id: 1,
  name: 'Producto',
  price: '100.00',
  quantity: 1
});
```

### Obtener Estado del Carrito
```javascript
const cartStore = useCartStore();
const { items, cartTotal, cartItemCount } = storeToRefs(cartStore);

// Verificar si hay items
if (cartStore.items.length > 0) {
  console.log('Carrito tiene items');
}
```

---

## 🎨 Styling con Tailwind

### Clases Útiles
```html
<!-- Layout -->
<div class="container mx-auto px-4">
<div class="flex items-center justify-between">
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">

<!-- Espaciado -->
<div class="p-4 m-2">
<div class="space-y-4">

<!-- Colores -->
<div class="bg-blue-500 text-white">
<div class="text-gray-700 hover:text-blue-600">

<!-- Responsive -->
<div class="text-sm md:text-lg">
<div class="hidden md:block">
```

### Componentes Personalizados
```css
/* assets/css/main.css */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

---

## 🔍 Búsqueda y Filtros

### Implementar Búsqueda
```javascript
import { useProductStore } from '~/stores/product';

const productStore = useProductStore();

// Buscar productos
await productStore.searchProducts('laptop', 1);
```

### Filtros por Categoría
```javascript
// Obtener productos por categoría
await productStore.fetchProductsByCategory('electronics', 1);
```

---

## 📱 Responsive Design

### Breakpoints de Tailwind
```html
<!-- Mobile First -->
<div class="w-full md:w-1/2 lg:w-1/3">

<!-- Ocultar/Mostrar elementos -->
<div class="hidden md:block">Desktop Only</div>
<div class="md:hidden">Mobile Only</div>

<!-- Texto responsive -->
<h1 class="text-xl md:text-2xl lg:text-3xl">
```

---

## ⚡ Optimización

### Lazy Loading de Imágenes
```vue
<template>
  <NuxtImg 
    :src="product.image" 
    :alt="product.name"
    loading="lazy"
    class="w-full h-48 object-cover"
  />
</template>
```

### Lazy Loading de Componentes
```vue
<script setup>
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
);
</script>
```

---

## 🐛 Debugging

### Vue DevTools
```javascript
// Habilitar en desarrollo
export default defineNuxtConfig({
  devtools: { enabled: true }
});
```

### Console Logging
```javascript
// Debug stores
console.log('Cart State:', cartStore.$state);

// Debug API calls
console.log('API Response:', data);
```

---

## 🧪 Testing

### Test de Componente
```javascript
// tests/components/MiComponente.test.js
import { mount } from '@vue/test-utils';
import MiComponente from '@/components/MiComponente.vue';

describe('MiComponente', () => {
  it('should render correctly', () => {
    const wrapper = mount(MiComponente, {
      props: { titulo: 'Test' }
    });
    
    expect(wrapper.text()).toContain('Test');
  });
});
```

---

## 📦 Despliegue

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Netlify
```bash
# Build
npm run build

# Desplegar carpeta .output
```

---

## 🔗 Enlaces Útiles

- [Documentación Nuxt 3](https://nuxt.com/docs)
- [Documentación Pinia](https://pinia.vuejs.org/)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)
- [Vue DevTools](https://devtools.vuejs.org/)

---

## 📞 Soporte

### Problemas Comunes

**Error: Cannot find module**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

**Error: API no responde**
```bash
# Verificar .env
API_URL=http://localhost:8000/api

# Verificar que el backend esté corriendo
```

**Error: Build falla**
```bash
# Limpiar cache
npm run build -- --reset-cache
```

---

*Guía Rápida - ProBusiness Shop v1.0.0* 