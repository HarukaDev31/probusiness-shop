# 🔧 Documentación Técnica - ProBusiness Shop

## 📋 Índice Técnico

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [API Reference](#api-reference)
3. [Estado Global (Stores)](#estado-global-stores)
4. [Componentes Técnicos](#componentes-técnicos)
5. [Sistema de Rutas](#sistema-de-rutas)
6. [Middleware](#middleware)
7. [Optimizaciones](#optimizaciones)
8. [Testing](#testing)
9. [Debugging](#debugging)
10. [Performance](#performance)

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Nuxt 3)      │◄──►│   (Laravel)     │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pinia Store   │    │   Authentication│    │   Products      │
│   (State Mgmt)  │    │   (JWT)         │    │   Categories    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Datos Detallado
1. **Usuario interactúa** → Componente Vue
2. **Componente** → Dispara acción en Store
3. **Store** → Llama a Service
4. **Service** → Hace request a API
5. **API** → Retorna datos
6. **Service** → Procesa respuesta
7. **Store** → Actualiza estado
8. **Componente** → Re-renderiza con nuevos datos

---

## 🌐 API Reference

### Base URL
```
http://localhost:8000/api
```

### Endpoints de Autenticación

#### POST /auth/login
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "api_token": "jwt_token_here"
}
```

#### POST /auth/register
```javascript
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "api_token": "jwt_token_here"
}
```

### Endpoints de Productos

#### GET /products
```javascript
// Query Parameters
{
  "per_category": 10,
  "all_categories": true,
  "category": "electronics",
  "current_page": 1,
  "search": "laptop"
}

// Response
{
  "data": [
    {
      "id": 1,
      "name": "Laptop HP",
      "price": "999.99",
      "description": "Laptop description",
      "image": "laptop.jpg",
      "category_id": 1,
      "category_name": "Electronics",
      "slug": "laptop-hp"
    }
  ],
  "meta": {
    "total": 100,
    "current_page": 1,
    "per_page": 10
  }
}
```

#### GET /products/{id}
```javascript
// Response
{
  "data": {
    "id": 1,
    "name": "Laptop HP",
    "price": "999.99",
    "description": "Full description",
    "images": ["img1.jpg", "img2.jpg"],
    "category": {
      "id": 1,
      "name": "Electronics"
    },
    "supplier": {
      "id": 1,
      "name": "HP Inc"
    }
  }
}
```

### Endpoints de Categorías

#### GET /categories
```javascript
// Response
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "meta": {
        "total": 50,
        "current_page": 1,
        "per_page": 10
      }
    }
  ]
}
```

### Endpoints de Órdenes

#### POST /orders
```javascript
// Request
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 999.99
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}

// Response
{
  "order": {
    "id": 1,
    "total": 1999.98,
    "status": "pending"
  }
}
```

---

## 📦 Estado Global (Stores)

### Cart Store - Detalle Técnico

```javascript
// stores/cart.js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    selectedIds: [],
    checkoutItems: []
  }),

  getters: {
    // Computed properties
    cartItemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    addItem(product) {
      // Lógica de añadir producto
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += (product.quantity || 1);
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: this.parsePrecio(product.price),
          quantity: product.quantity || 1,
          image: this.getProductImage(product)
        });
      }
    },

    parsePrecio(precioStr) {
      // Helper para parsear precios
      if (typeof precioStr === 'number') return precioStr;
      const match = precioStr.replace(',', '.').match(/([0-9]+(\.[0-9]+)?)/);
      return match ? parseFloat(match[1]) : 0;
    },

    getProductImage(product) {
      // Lógica para obtener imagen del producto
      let image = product.image || product.main_image_url;
      
      if (!image && product.media?.length > 0) {
        image = product.media[0].url;
      }
      
      return image || '/images/logo.png';
    }
  },

  persist: true // Persistencia automática
});
```

### User Store - Detalle Técnico

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    token: ''
  }),

  actions: {
    async loginUser(email, password) {
      try {
        const data = await authService.login(email, password);
        this.setUser({
          name: data.user.name,
          email: data.user.email,
          token: data.api_token
        });
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    setUser({ name, email, token }) {
      this.name = name || '';
      this.email = email || '';
      this.token = token || '';
      
      // Sincronización con localStorage
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('access_token', token);
        if (name) localStorage.setItem('user_name', name);
        if (email) localStorage.setItem('user_email', email);
      }
    },

    syncFromLocalStorage() {
      if (typeof window !== 'undefined') {
        this.name = localStorage.getItem('user_name') || '';
        this.email = localStorage.getItem('user_email') || '';
        this.token = localStorage.getItem('access_token') || '';
      }
    }
  }
});
```

### Product Store - Detalle Técnico

```javascript
// stores/product.js
export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const relatedProducts = ref([]);
  const totalProducts = ref(0);

  async function fetchProducts() {
    const data = await productService.getProducts();
    products.value = data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    }));
  }

  async function searchProducts(searchTerm, currentPage = 1) {
    const { data, total } = await productService.searchProducts(searchTerm, currentPage);
    totalProducts.value = total;
    products.value.push(...data.map(product => ({
      ...product,
      slug: product.slug || product.category_name.toLowerCase().replace(/\s+/g, '-')
    })));
  }

  return {
    products,
    relatedProducts,
    totalProducts,
    fetchProducts,
    searchProducts
  };
});
```

---

## 🧩 Componentes Técnicos

### ProductCard Component

```vue
<!-- components/ProductCard.vue -->
<template>
  <div class="product-card">
    <NuxtImg 
      :src="product.image" 
      :alt="product.name"
      loading="lazy"
      class="product-image"
    />
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="price">{{ formatPrice(product.price) }}</p>
      <button @click="addToCart" :disabled="isAdding">
        {{ isAdding ? 'Añadiendo...' : 'Añadir al carrito' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const isAdding = ref(false);

const addToCart = async () => {
  isAdding.value = true;
  try {
    cartStore.addItem(props.product);
  } finally {
    isAdding.value = false;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
</script>
```

### CartButton Component

```vue
<!-- components/CartButton.vue -->
<template>
  <button @click="navigateToCart" class="cart-button">
    <Icon name="shopping-cart" />
    <span v-if="itemCount > 0" class="cart-count">
      {{ itemCount }}
    </span>
  </button>
</template>

<script setup>
const cartStore = useCartStore();
const { cartItemCount } = storeToRefs(cartStore);

const itemCount = computed(() => cartStore.cartItemCount);

const navigateToCart = () => {
  navigateTo('/cart');
};
</script>
```

---

## 🛣️ Sistema de Rutas

### Estructura de Rutas
```
/                           # Página principal
├── /login                  # Login de usuario
├── /register               # Registro de usuario
├── /cart                   # Carrito de compras
├── /search                 # Búsqueda de productos
├── /category/[slug]        # Productos por categoría
├── /product/[id]           # Detalle de producto
└── /checkout/              # Proceso de checkout
    ├── /                   # Formulario de checkout
    ├── /review             # Revisión de orden
    └── /success            # Confirmación
```

### Middleware de Rutas

```javascript
// middleware/guest.js
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  
  // Si el usuario está autenticado y trata de acceder a páginas de guest
  if (userStore.token && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/');
  }
});

// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  
  // Si el usuario no está autenticado y trata de acceder a páginas protegidas
  if (!userStore.token && to.path.startsWith('/checkout')) {
    return navigateTo('/login');
  }
});
```

---

## 🔧 Optimizaciones

### Optimización de Imágenes

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    provider: 'ipx',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    quality: 80,
    format: ['webp'],
    domains: ['localhost', 'api.example.com']
  }
});
```

### Lazy Loading de Componentes

```vue
<!-- Lazy loading de componentes pesados -->
<script setup>
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
);
</script>
```

### Virtual Scrolling para Listas Grandes

```vue
<template>
  <VirtualList
    :items="products"
    :item-height="200"
    class="product-list"
  >
    <template #default="{ item }">
      <ProductCard :product="item" />
    </template>
  </VirtualList>
</template>
```

---

## 🧪 Testing

### Configuración de Tests

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js']
  }
});
```

### Tests de Stores

```javascript
// tests/stores/cart.test.js
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '@/stores/cart';

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add item to cart', () => {
    const cart = useCartStore();
    const product = {
      id: 1,
      name: 'Test Product',
      price: '100.00'
    };

    cart.addItem(product);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe(1);
  });

  it('should calculate total correctly', () => {
    const cart = useCartStore();
    cart.addItem({ id: 1, name: 'Product 1', price: '100.00' });
    cart.addItem({ id: 2, name: 'Product 2', price: '200.00' });

    expect(cart.cartTotal).toBe(300);
  });
});
```

### Tests de Componentes

```javascript
// tests/components/ProductCard.test.js
import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard.vue';

describe('ProductCard', () => {
  it('should render product information', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: '100.00',
      image: 'test.jpg'
    };

    const wrapper = mount(ProductCard, {
      props: { product }
    });

    expect(wrapper.text()).toContain('Test Product');
    expect(wrapper.text()).toContain('$100.00');
  });

  it('should emit add-to-cart event', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: { id: 1, name: 'Test', price: '100.00' } }
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('add-to-cart')).toBeTruthy();
  });
});
```

---

## 🐛 Debugging

### Herramientas de Debugging

```javascript
// Debugging de Stores
const cartStore = useCartStore();
console.log('Cart State:', cartStore.$state);
console.log('Cart Items:', cartStore.items);

// Debugging de API calls
const productService = new ProductService();
productService.getProducts().then(data => {
  console.log('API Response:', data);
}).catch(error => {
  console.error('API Error:', error);
});
```

### Vue DevTools
```javascript
// Habilitar Vue DevTools en desarrollo
export default defineNuxtConfig({
  devtools: { enabled: true }
});
```

### Logging de Errores

```javascript
// utils/logger.js
export const logger = {
  info(message, data = {}) {
    console.log(`[INFO] ${message}`, data);
  },
  
  error(message, error = {}) {
    console.error(`[ERROR] ${message}`, error);
    
    // Enviar a servicio de logging en producción
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, etc.
    }
  },
  
  warn(message, data = {}) {
    console.warn(`[WARN] ${message}`, data);
  }
};
```

---

## ⚡ Performance

### Métricas de Performance

```javascript
// utils/performance.js
export const performanceMetrics = {
  measurePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime}ms`);
      });
    }
  },

  measureApiCall(endpoint) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`${endpoint} took ${duration}ms`);
      }
    };
  }
};
```

### Optimización de Bundle

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: true, // Analizar bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          ui: ['@nuxt/ui']
        }
      }
    }
  }
});
```

### Caching Strategy

```javascript
// utils/cache.js
export class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 300000) { // 5 minutos por defecto
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}
```

---

## 📊 Monitoreo

### Métricas de Usuario

```javascript
// utils/analytics.js
export const analytics = {
  trackPageView(page) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page,
        page_location: window.location.href
      });
    }
  },

  trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  },

  trackPurchase(orderId, value, currency = 'USD') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: orderId,
        value: value,
        currency: currency
      });
    }
  }
};
```

### Error Tracking

```javascript
// utils/errorTracking.js
export const errorTracker = {
  captureException(error, context = {}) {
    console.error('Error captured:', error, context);
    
    // Enviar a servicio de error tracking
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: context });
    }
  },

  captureMessage(message, level = 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`);
    
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureMessage(message, level);
    }
  }
};
```

---

*Documentación Técnica - ProBusiness Shop v1.0.0* 