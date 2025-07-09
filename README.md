# ProBusiness Shop

Tienda online desarrollada con Nuxt 3 para la venta de productos de importación.

## Setup

### 1. Instalar dependencias

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_URL=http://localhost:8000/api
AUTH_API_URL=http://localhost:8000/api

# Environment
NODE_ENV=development
```

Para más detalles sobre la configuración, consulta [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md).

## Development Server

Inicia el servidor de desarrollo en http://localhost:3000:

```bash
npm run dev
```

## Production

Construye la aplicación para producción:

```bash
npm run build
```

Vista previa local de la build de producción:

```bash
npm run preview
```

## Características

- 🛍️ Catálogo de productos con categorías
- 🔍 Búsqueda de productos
- ❤️ Lista de deseos
- 🛒 Carrito de compras
- 👤 Autenticación de usuarios
- 📱 Diseño responsive
- 💰 Formateo de precios en soles peruanos

## Tecnologías

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Estado**: Pinia
- **Autenticación**: JWT
- **Imágenes**: Nuxt Image
- **Iconos**: Nuxt Icon

Consulta la [documentación de Nuxt 3](https://nuxt.com/docs/getting-started/introduction) para más información.
