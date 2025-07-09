# Configuración de Variables de Entorno

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
API_URL=http://localhost:8000/api
AUTH_API_URL=http://localhost:8000/api

# Environment
NODE_ENV=development
```

## Variables de Entorno

### API_URL
- **Descripción**: URL base para las APIs de productos, categorías y otros recursos
- **Valor por defecto**: `http://localhost:8000/api`
- **Ejemplo producción**: `https://tu-api-produccion.com/api`

### AUTH_API_URL
- **Descripción**: URL base para las APIs de autenticación (login, registro, wishlist, órdenes)
- **Valor por defecto**: `http://localhost:8000/api`
- **Ejemplo producción**: `https://tu-api-produccion.com/api`

### NODE_ENV
- **Descripción**: Entorno de ejecución
- **Valores posibles**: `development`, `production`
- **Valor por defecto**: `development`

## Configuración para Producción

Para producción, actualiza las variables en tu servidor:

```env
API_URL=https://tu-api-produccion.com/api
AUTH_API_URL=https://tu-api-produccion.com/api
NODE_ENV=production
```

## Uso en el Código

Las variables se acceden a través de `useRuntimeConfig()`:

```javascript
const { public: { apiUrl, authApiUrl } } = useRuntimeConfig()
```

## Notas Importantes

1. El archivo `.env` debe estar en la raíz del proyecto
2. Las variables con prefijo `public:` están disponibles en el cliente
3. Reinicia el servidor de desarrollo después de cambiar las variables
4. No commitees el archivo `.env` al repositorio (ya está en `.gitignore`) 