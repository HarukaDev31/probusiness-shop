# 📚 Documentación ProBusiness Shop

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración del Proyecto](#configuración-del-proyecto)
5. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
6. [Stores (Estado Global)](#stores-estado-global)
7. [Servicios API](#servicios-api)
8. [Componentes Principales](#componentes-principales)
9. [Páginas y Rutas](#páginas-y-rutas)
10. [Sistema de Autenticación](#sistema-de-autenticación)
11. [Sistema de Carrito](#sistema-de-carrito)
12. [Optimización y Rendimiento](#optimización-y-rendimiento)
13. [Guía de Desarrollo](#guía-de-desarrollo)
14. [Despliegue](#despliegue)

---

## 🏪 Descripción General

**ProBusiness Shop** es una aplicación de comercio electrónico desarrollada con Nuxt 3 que permite a los usuarios explorar productos, gestionar un carrito de compras, realizar búsquedas y completar el proceso de checkout. La aplicación está diseñada con una arquitectura moderna, utilizando Pinia para el manejo de estado y Tailwind CSS para el diseño.

### Características Principales:
- 🛍️ Catálogo de productos por categorías
- 🔍 Sistema de búsqueda avanzada
- 🛒 Carrito de compras persistente
- 👤 Autenticación de usuarios
- 💳 Proceso de checkout completo
- 📱 Diseño responsive
- ⚡ Optimización de rendimiento

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Nuxt 3** - Framework de Vue.js para aplicaciones universales
- **Vue 3** - Framework progresivo de JavaScript
- **Pinia** - Gestión de estado global
- **Tailwind CSS** - Framework de CSS utilitario
- **Swiper** - Biblioteca para carruseles y sliders

### Herramientas de Desarrollo
- **TypeScript** - Tipado estático opcional
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos
- **Terser** - Minificación de JavaScript

### Optimización
- **@nuxt/image** - Optimización de imágenes
- **@pinia-plugin-persistedstate** - Persistencia de estado
- **Compresión Gzip** - Optimización de archivos

---

## 📁 Estructura del Proyecto

```
probusiness-shop/
├── app.vue                 # Componente raíz de la aplicación
├── nuxt.config.ts          # Configuración de Nuxt
├── tailwind.config.js      # Configuración de Tailwind CSS
├── package.json            # Dependencias del proyecto
├── assets/                 # Recursos estáticos
│   ├── css/
│   │   └── main.css        # Estilos globales
│   └── images/             # Imágenes del proyecto
├── components/             # Componentes reutilizables
│   ├── CartButton.vue      # Botón del carrito
│   ├── CartItem.vue        # Item del carrito
│   ├── CategorySection.vue # Sección de categorías
│   ├── Header.vue          # Encabezado de la aplicación
│   ├── Hero.vue            # Sección hero
│   ├── ProductCard.vue     # Tarjeta de producto
│   └── ...
├── composables/            # Composables de Vue
│   ├── useInitialData.js   # Datos iniciales
│   ├── useModal.js         # Sistema de modales
│   └── useScreenSize.js    # Tamaños de pantalla
├── layouts/                # Layouts de la aplicación
│   ├── auth.vue            # Layout para autenticación
│   └── default.vue         # Layout por defecto
├── middleware/             # Middleware de Nuxt
│   └── guest.js            # Middleware para usuarios no autenticados
├── pages/                  # Páginas de la aplicación
│   ├── index.vue           # Página principal
│   ├── cart.vue            # Página del carrito
│   ├── login.vue           # Página de login
│   ├── register.vue        # Página de registro
│   ├── search.vue          # Página de búsqueda
│   ├── category/           # Páginas de categorías
│   ├── product/            # Páginas de productos
│   └── checkout/           # Páginas de checkout
├── plugins/                # Plugins de Nuxt
│   ├── modal.client.js     # Plugin de modales
│   └── pinia-persistedstate.client.js # Persistencia de Pinia
├── services/               # Servicios de API
│   ├── auth-service.js     # Servicio de autenticación
│   ├── product-service.js  # Servicio de productos
│   ├── category-service.js # Servicio de categorías
│   └── order-service.js    # Servicio de órdenes
├── stores/                 # Stores de Pinia
│   ├── cart.js             # Store del carrito
│   ├── user.js             # Store de usuario
│   ├── product.js          # Store de productos
│   ├── category.js         # Store de categorías
│   └── loading.js          # Store de carga
└── utils/                  # Utilidades
    └── priceParser.js      # Parser de precios
```

---

## ⚙️ Configuración del Proyecto

### Variables de Entorno
```bash
# .env
API_URL=http://localhost:8000/api
```

### Configuración de Nuxt (`nuxt.config.ts`)
```typescript
export default defineNuxtConfig({
  // Módulos utilizados
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@nuxt/image'
  ],
  
  // Configuración de imágenes
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp']
  },
  
  // Configuración de compresión
  compression: {
    algorithm: 'gzip',
    threshold: 1024
  }
})
```

---

## 🏗️ Arquitectura de la Aplicación

### Patrón de Arquitectura
La aplicación sigue el patrón **MVVM (Model-View-ViewModel)** con las siguientes capas:

1. **Vista (View)**: Componentes Vue en `/components` y `/pages`
2. **Modelo (Model)**: Stores de Pinia en `/stores`
3. **Servicios**: Lógica de negocio en `/services`
4. **Composables**: Lógica reutilizable en `/composables`

### Flujo de Datos
```
API → Services → Stores → Components → UI
```

---

## 📦 Stores (Estado Global)

### 1. Cart Store (`stores/cart.js`)
Gestiona el estado del carrito de compras.

**Estado:**
```javascript
state: () => ({
  items: [],           // Productos en el carrito
  selectedIds: [],     // IDs de productos seleccionados
  checkoutItems: []    // Items para checkout
})
```

**Getters:**
- `cartItems`: Lista de items del carrito
- `cartItemCount`: Número total de items
- `cartTotal`: Total del carrito
- `selectedItems`: Items seleccionados
- `selectedTotal`: Total de items seleccionados

**Actions:**
- `addItem(product)`: Añadir producto al carrito
- `updateItemQuantity(productId, quantity)`: Actualizar cantidad
- `removeItem(productId)`: Eliminar producto
- `clearCart()`: Vaciar carrito

### 2. User Store (`stores/user.js`)
Gestiona el estado del usuario autenticado.

**Estado:**
```javascript
state: () => ({
  name: '',
  email: '',
  token: ''
})
```

**Actions:**
- `loginUser(email, password)`: Iniciar sesión
- `registerUser(userData)`: Registrar usuario
- `setUser(userData)`: Establecer datos del usuario
- `logout()`: Cerrar sesión

### 3. Product Store (`stores/product.js`)
Gestiona el estado de los productos.

**Estado:**
```javascript
const products = ref([])
const relatedProducts = ref([])
const supplierProducts = ref([])
const totalProducts = ref(0)
```

**Actions:**
- `fetchProducts()`: Obtener todos los productos
- `fetchProductsByCategory(categorySlug, page)`: Productos por categoría
- `fetchProductById(id)`: Producto por ID
- `searchProducts(searchTerm, page)`: Buscar productos

### 4. Category Store (`stores/category.js`)
Gestiona el estado de las categorías.

**Actions:**
- `fetchCategories()`: Obtener todas las categorías
- `getCategoryBySlug(slug)`: Categoría por slug

---

## 🌐 Servicios API

### 1. Auth Service (`services/auth-service.js`)
```javascript
const API_BASE_URL = 'http://localhost:8000/api'

export const authService = {
  async login(email, password) { /* ... */ },
  async register(userData) { /* ... */ },
  async forgotPassword(email) { /* ... */ }
}
```

### 2. Product Service (`services/product-service.js`)
```javascript
class ProductService {
  async getProducts() { /* ... */ }
  async getProductsByCategory(categorySlug, currentPage) { /* ... */ }
  async getProductById(id) { /* ... */ }
  async searchProducts(searchTerm, currentPage) { /* ... */ }
}
```

### 3. Category Service (`services/category-service.js`)
```javascript
export const categoryService = {
  async getCategories() { /* ... */ }
}
```

### 4. Order Service (`services/order-service.js`)
```javascript
export const orderService = {
  async createOrder(orderData) { /* ... */ },
  async getOrders() { /* ... */ }
}
```

---

## 🧩 Componentes Principales

### 1. Header (`components/Header.vue`)
- Navegación principal
- Logo de la empresa
- Botón del carrito
- Menú de usuario

### 2. ProductCard (`components/ProductCard.vue`)
- Tarjeta de producto
- Imagen del producto
- Precio y descripción
- Botón de añadir al carrito

### 3. CartButton (`components/CartButton.vue`)
- Indicador de items en carrito
- Navegación al carrito
- Contador de productos

### 4. CategorySection (`components/CategorySection.vue`)
- Sección de productos por categoría
- Slider de productos
- Título de categoría

### 5. Hero (`components/Hero.vue`)
- Sección principal de la página
- Imagen de fondo
- Call-to-action

---

## 📄 Páginas y Rutas

### Páginas Principales
- `/` - Página principal con productos destacados
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/cart` - Página del carrito de compras
- `/search` - Página de búsqueda de productos

### Páginas Dinámicas
- `/category/[slug]` - Productos por categoría
- `/product/[id]` - Detalle de producto
- `/checkout/` - Proceso de checkout
- `/checkout/review` - Revisión de orden
- `/checkout/success` - Confirmación de orden

### Middleware
- `guest.js` - Protege rutas para usuarios no autenticados

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. **Registro**: Usuario se registra con nombre, email y contraseña
2. **Login**: Usuario inicia sesión con email y contraseña
3. **Token**: Se almacena el token JWT en localStorage
4. **Persistencia**: Los datos del usuario persisten entre sesiones

### Endpoints de API
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Protección de Rutas
```javascript
// middleware/guest.js
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  if (userStore.token) {
    return navigateTo('/')
  }
})
```

---

## 🛒 Sistema de Carrito

### Características
- **Persistencia**: Los items persisten en localStorage
- **Cantidad Mínima**: 1 producto por item
- **Validación**: Validación de precios y cantidades
- **Notificaciones**: Feedback al usuario

### Estructura de Item
```javascript
{
  id: number,
  name: string,
  price: number,
  quantity: number,
  image: string
}
```

### Funcionalidades
- Añadir productos
- Actualizar cantidades
- Eliminar productos
- Seleccionar items para checkout
- Calcular totales

---

## ⚡ Optimización y Rendimiento

### Optimización de Imágenes
- **@nuxt/image**: Optimización automática
- **Formatos**: WebP para mejor compresión
- **Calidad**: 80% para balance calidad/tamaño
- **Responsive**: Diferentes tamaños según pantalla

### Compresión
- **Gzip**: Compresión de archivos estáticos
- **Terser**: Minificación de JavaScript
- **Umbral**: Comprimir archivos > 1KB

### Lazy Loading
- **Componentes**: Carga diferida de componentes
- **Imágenes**: Lazy loading de imágenes
- **Páginas**: Carga bajo demanda

### Caching
- **Pinia Persistence**: Estado persistente
- **API Caching**: Cache de respuestas API
- **Static Assets**: Cache de recursos estáticos

---

## 🚀 Guía de Desarrollo

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd probusiness-shop

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run generate     # Generar sitio estático
npm run preview      # Preview de producción
```

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: pruebas
chore: tareas de mantenimiento
```

### Convenciones de Código
- **Vue Components**: PascalCase
- **Files**: kebab-case
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase

---

## 🌍 Despliegue

### Preparación para Producción
```bash
# Build de producción
npm run build

# Generar sitio estático (opcional)
npm run generate
```

### Variables de Entorno de Producción
```bash
# .env.production
API_URL=https://api.tudominio.com
NODE_ENV=production
```

### Plataformas de Despliegue
- **Vercel**: Despliegue automático desde Git
- **Netlify**: Despliegue con funciones serverless
- **AWS S3 + CloudFront**: Alojamiento estático
- **Docker**: Contenedorización

### Configuración de Servidor
```nginx
# Nginx configuration
server {
    listen 80;
    server_name tudominio.com;
    
    location / {
        root /var/www/probusiness-shop;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📞 Soporte y Contacto

### Equipo de Desarrollo
- **Desarrollador Principal**: [Tu Nombre]
- **Email**: [tu-email@dominio.com]
- **GitHub**: [tu-github]

### Recursos Adicionales
- [Documentación de Nuxt 3](https://nuxt.com/docs)
- [Documentación de Pinia](https://pinia.vuejs.org/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

### Reportar Issues
Para reportar bugs o solicitar nuevas funcionalidades, por favor:
1. Crear un issue en GitHub
2. Describir el problema o solicitud
3. Incluir pasos para reproducir (si aplica)
4. Adjuntar capturas de pantalla (si aplica)

---

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Implementación inicial del proyecto
- ✅ Sistema de autenticación
- ✅ Carrito de compras
- ✅ Catálogo de productos
- ✅ Sistema de búsqueda
- ✅ Proceso de checkout
- ✅ Diseño responsive
- ✅ Optimización de rendimiento

---

*Documentación generada el [Fecha] - ProBusiness Shop v1.0.0* 