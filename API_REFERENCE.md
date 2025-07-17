# 🌐 API Reference - ProBusiness Shop

## 📋 Índice de API

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Productos](#productos)
4. [Categorías](#categorías)
5. [Órdenes](#órdenes)
6. [Usuarios](#usuarios)
7. [Códigos de Error](#códigos-de-error)

---

## ℹ️ Información General

### Base URL
```
http://localhost:8000/api
```

### Headers
```javascript
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer {token}" // Para endpoints protegidos
}
```

### Formato de Respuesta
```javascript
// Respuesta exitosa
{
  "data": { /* datos */ },
  "meta": {
    "total": 100,
    "current_page": 1,
    "per_page": 10,
    "last_page": 10
  }
}

// Respuesta de error
{
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## 🔐 Autenticación

### POST /auth/login
Iniciar sesión de usuario.

**Request:**
```javascript
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```javascript
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "api_token": "1|abc123def456..."
}
```

**Response (422):**
```javascript
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

### POST /auth/register
Registrar nuevo usuario.

**Request:**
```javascript
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```javascript
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "api_token": "1|abc123def456..."
}
```

**Response (422):**
```javascript
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

### POST /auth/forgot-password
Solicitar restablecimiento de contraseña.

**Request:**
```javascript
{
  "email": "user@example.com"
}
```

**Response (200):**
```javascript
{
  "message": "We have emailed your password reset link."
}
```

### POST /auth/logout
Cerrar sesión (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response (200):**
```javascript
{
  "message": "Logged out successfully"
}
```

---

## 📦 Productos

### GET /products
Obtener lista de productos.

**Query Parameters:**
```javascript
{
  "per_category": 10,        // Productos por categoría
  "all_categories": true,    // Obtener de todas las categorías
  "category": "electronics", // Filtrar por categoría
  "current_page": 1,         // Página actual
  "search": "laptop",        // Término de búsqueda
  "supplier": 1,            // Filtrar por proveedor
  "min_price": 100,         // Precio mínimo
  "max_price": 1000,        // Precio máximo
  "sort": "price_asc"       // Ordenar por precio ascendente
}
```

**Response (200):**
```javascript
{
  "data": [
    {
      "id": 1,
      "name": "Laptop HP Pavilion",
      "description": "Powerful laptop for work and gaming",
      "price": "999.99",
      "original_price": "1299.99",
      "discount_percentage": 23,
      "image": "laptop-hp.jpg",
      "main_image_url": "https://example.com/images/laptop-hp.jpg",
      "category_id": 1,
      "category_name": "Electronics",
      "supplier_id": 1,
      "supplier_name": "HP Inc",
      "slug": "laptop-hp-pavilion",
      "stock": 15,
      "is_featured": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "media": [
        {
          "id": 1,
          "url": "https://example.com/images/laptop-hp-1.jpg",
          "type": "image"
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "current_page": 1,
    "per_page": 10,
    "last_page": 10,
    "from": 1,
    "to": 10
  }
}
```

### GET /products/{id}
Obtener producto específico.

**Response (200):**
```javascript
{
  "data": {
    "id": 1,
    "name": "Laptop HP Pavilion",
    "description": "Powerful laptop for work and gaming",
    "long_description": "Detailed description with features...",
    "price": "999.99",
    "original_price": "1299.99",
    "discount_percentage": 23,
    "image": "laptop-hp.jpg",
    "main_image_url": "https://example.com/images/laptop-hp.jpg",
    "category": {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics"
    },
    "supplier": {
      "id": 1,
      "name": "HP Inc",
      "description": "Leading technology company"
    },
    "slug": "laptop-hp-pavilion",
    "stock": 15,
    "is_featured": true,
    "is_active": true,
    "specifications": {
      "processor": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "media": [
      {
        "id": 1,
        "url": "https://example.com/images/laptop-hp-1.jpg",
        "type": "image",
        "is_primary": true
      },
      {
        "id": 2,
        "url": "https://example.com/images/laptop-hp-2.jpg",
        "type": "image",
        "is_primary": false
      }
    ],
    "related_products": [
      {
        "id": 2,
        "name": "Laptop Dell XPS",
        "price": "1199.99",
        "image": "laptop-dell.jpg"
      }
    ]
  }
}
```

### GET /products/featured
Obtener productos destacados.

**Response (200):**
```javascript
{
  "data": [
    {
      "id": 1,
      "name": "Laptop HP Pavilion",
      "price": "999.99",
      "image": "laptop-hp.jpg",
      "category_name": "Electronics"
    }
  ]
}
```

### GET /products/search
Buscar productos.

**Query Parameters:**
```javascript
{
  "q": "laptop",           // Término de búsqueda
  "current_page": 1,       // Página actual
  "per_page": 20,          // Resultados por página
  "category": "electronics" // Filtrar por categoría
}
```

---

## 📂 Categorías

### GET /categories
Obtener lista de categorías.

**Query Parameters:**
```javascript
{
  "current_page": 1,    // Página actual
  "per_page": 10,       // Categorías por página
  "with_products": true // Incluir productos de la categoría
}
```

**Response (200):**
```javascript
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "slug": "electronics",
      "image": "electronics.jpg",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "meta": {
        "total_products": 50,
        "current_page": 1,
        "per_page": 10
      },
      "products": [
        {
          "id": 1,
          "name": "Laptop HP Pavilion",
          "price": "999.99",
          "image": "laptop-hp.jpg"
        }
      ]
    }
  ],
  "meta": {
    "total": 10,
    "current_page": 1,
    "per_page": 10,
    "last_page": 1
  }
}
```

### GET /categories/{slug}
Obtener categoría específica.

**Response (200):**
```javascript
{
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "slug": "electronics",
    "image": "electronics.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "products": {
      "data": [
        {
          "id": 1,
          "name": "Laptop HP Pavilion",
          "price": "999.99",
          "image": "laptop-hp.jpg"
        }
      ],
      "meta": {
        "total": 50,
        "current_page": 1,
        "per_page": 10
      }
    }
  }
}
```

---

## 🛒 Órdenes

### POST /orders
Crear nueva orden (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Request:**
```javascript
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 999.99
    }
  ],
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  },
  "payment_method": "credit_card",
  "notes": "Please deliver in the morning"
}
```

**Response (201):**
```javascript
{
  "order": {
    "id": 1,
    "order_number": "ORD-2024-001",
    "user_id": 1,
    "status": "pending",
    "total": 1999.98,
    "subtotal": 1999.98,
    "tax": 0,
    "shipping_cost": 0,
    "discount": 0,
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "USA"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Laptop HP Pavilion",
        "quantity": 2,
        "price": 999.99,
        "total": 1999.98
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### GET /orders
Obtener órdenes del usuario (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Query Parameters:**
```javascript
{
  "current_page": 1,  // Página actual
  "per_page": 10,     // Órdenes por página
  "status": "pending" // Filtrar por estado
}
```

**Response (200):**
```javascript
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-2024-001",
      "status": "pending",
      "total": 1999.98,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "items_count": 2
    }
  ],
  "meta": {
    "total": 5,
    "current_page": 1,
    "per_page": 10,
    "last_page": 1
  }
}
```

### GET /orders/{id}
Obtener orden específica (requiere autenticación).

**Response (200):**
```javascript
{
  "data": {
    "id": 1,
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total": 1999.98,
    "subtotal": 1999.98,
    "tax": 0,
    "shipping_cost": 0,
    "discount": 0,
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "USA"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Laptop HP Pavilion",
        "product_image": "laptop-hp.jpg",
        "quantity": 2,
        "price": 999.99,
        "total": 1999.98
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

---

## 👤 Usuarios

### GET /user/profile
Obtener perfil del usuario (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Response (200):**
```javascript
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### PUT /user/profile
Actualizar perfil del usuario (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Request:**
```javascript
{
  "name": "John Doe Updated",
  "phone": "+1234567890"
}
```

**Response (200):**
```javascript
{
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+1234567890",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Profile updated successfully"
}
```

### PUT /user/password
Cambiar contraseña (requiere autenticación).

**Headers:**
```javascript
{
  "Authorization": "Bearer {token}"
}
```

**Request:**
```javascript
{
  "current_password": "oldpassword",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

**Response (200):**
```javascript
{
  "message": "Password changed successfully"
}
```

---

## 🚨 Códigos de Error

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Solicitud malformada |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Datos inválidos |
| 500 | Internal Server Error - Error del servidor |

### Errores Comunes

**401 Unauthorized:**
```javascript
{
  "message": "Unauthenticated."
}
```

**404 Not Found:**
```javascript
{
  "message": "Product not found."
}
```

**422 Validation Error:**
```javascript
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**500 Internal Server Error:**
```javascript
{
  "message": "Internal server error.",
  "error": "Error details (only in development)"
}
```

---

## 🔧 Ejemplos de Uso

### Ejemplo: Obtener Productos con Filtros
```javascript
const response = await fetch('http://localhost:8000/api/products?category=electronics&min_price=100&max_price=1000&sort=price_asc', {
  headers: {
    'Accept': 'application/json'
  }
});

const data = await response.json();
console.log(data.data); // Array de productos
```

### Ejemplo: Crear Orden
```javascript
const response = await fetch('http://localhost:8000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    items: [
      {
        product_id: 1,
        quantity: 2,
        price: 999.99
      }
    ],
    shipping_address: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA'
    }
  })
});

const order = await response.json();
console.log(order.order.order_number);
```

### Ejemplo: Login de Usuario
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.api_token;
localStorage.setItem('token', token);
```

---

## 📝 Notas Importantes

1. **Autenticación**: La mayoría de endpoints requieren autenticación mediante token Bearer
2. **Paginación**: Los endpoints que retornan listas incluyen información de paginación en `meta`
3. **Validación**: Todos los endpoints validan los datos de entrada y retornan errores detallados
4. **Rate Limiting**: Los endpoints tienen límites de velocidad para prevenir abuso
5. **CORS**: La API está configurada para permitir requests desde el frontend

---

*API Reference - ProBusiness Shop v1.0.0* 