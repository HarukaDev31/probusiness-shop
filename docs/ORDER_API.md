# API de Pedidos - ProBusiness

## Endpoint: POST /api/orders

### Descripción
Endpoint para crear un nuevo pedido en el sistema de ProBusiness.

### URL
```
POST https://tienda.probusiness.pe/api/orders
```

### Headers
```
Content-Type: application/json
Authorization: Bearer {token} (opcional)
```

### Request Body

#### Estructura del Request
```json
{
  "customer": {
    "fullName": "string",
    "dni": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "province": "string",
      "city": "string",
      "district": "string"
    }
  },
  "order": {
    "items": [
      {
        "productId": "number",
        "name": "string",
        "price": "number",
        "quantity": "number",
        "total": "number",
        "image": "string"
      }
    ],
    "total": "number",
    "orderNumber": "string",
    "orderDate": "string (ISO 8601)",
    "status": "string"
  },
  "metadata": {
    "source": "string",
    "userAgent": "string",
    "timestamp": "number"
  }
}
```

#### Ejemplo de Request
```json
{
  "customer": {
    "fullName": "Juan Pérez García",
    "dni": "12345678",
    "email": "juan.perez@email.com",
    "phone": "999888777",
    "address": {
      "province": "Lima",
      "city": "Lima",
      "district": "Miraflores"
    }
  },
  "order": {
    "items": [
      {
        "productId": 123,
        "name": "Camisetas de Algodón Premium",
        "price": 25.50,
        "quantity": 100,
        "total": 2550.00,
        "image": "https://s.alicdn.com/@sc04/kf/Hdd21a08cbb3f4703bd4a37193cd8e8eac.jpg_720x720q50.jpg"
      },
      {
        "productId": 456,
        "name": "Pantalones Deportivos",
        "price": 35.00,
        "quantity": 50,
        "total": 1750.00,
        "image": "https://sc01.alicdn.com/kf/HTB1QqQbXQvoK1RjSZFNq6AxMVXa6.jpg"
      }
    ],
    "total": 4300.00,
    "orderNumber": "250624001",
    "orderDate": "2024-06-25T10:30:00.000Z",
    "status": "pending"
  },
  "metadata": {
    "source": "web",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "timestamp": 1719307800000
  }
}
```

### Response

#### Success Response (200)
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "orderId": "ORD-2024-001",
    "orderNumber": "250624001",
    "status": "pending",
    "total": 4300.00,
    "createdAt": "2024-06-25T10:30:00.000Z",
    "estimatedDelivery": "2024-08-25T10:30:00.000Z"
  }
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "customer.fullName",
      "message": "El nombre completo es requerido"
    },
    {
      "field": "order.total",
      "message": "El monto mínimo es de S/3000"
    }
  ]
}
```

#### Error Response (500)
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Database connection failed"
}
```

### Validaciones

#### Customer
- `fullName`: Requerido, mínimo 3 caracteres
- `dni`: Requerido, exactamente 8 dígitos
- `email`: Requerido, formato de email válido
- `phone`: Requerido, mínimo 9 dígitos
- `address.province`: Requerido
- `address.city`: Requerido
- `address.district`: Requerido

#### Order
- `items`: Array requerido, mínimo 1 item
- `total`: Requerido, mínimo S/3000
- `orderNumber`: Generado automáticamente
- `orderDate`: Generado automáticamente
- `status`: Valor por defecto "pending"

#### Items
- `productId`: Requerido, número válido
- `name`: Requerido, string no vacío
- `price`: Requerido, número positivo
- `quantity`: Requerido, número positivo
- `total`: Requerido, price * quantity
- `image`: Opcional, URL válida

### Estados del Pedido

| Estado | Descripción |
|--------|-------------|
| `pending` | Pedido creado, pendiente de confirmación |
| `confirmed` | Pedido confirmado por el cliente |
| `processing` | En proceso de importación |
| `shipped` | Enviado al cliente |
| `delivered` | Entregado al cliente |
| `cancelled` | Pedido cancelado |

### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token de autenticación requerido |
| 403 | Forbidden - Sin permisos para crear pedidos |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Validación fallida |
| 500 | Internal Server Error - Error del servidor |

### Notas Importantes

1. **Monto Mínimo**: Todos los pedidos deben tener un total mínimo de S/3000
2. **Número de Pedido**: Se genera automáticamente con formato DDMMYYXXX
3. **Fechas**: Todas las fechas se manejan en formato ISO 8601
4. **Moneda**: Todos los montos se manejan en Soles (PEN)
5. **Imágenes**: Las URLs de imágenes pueden ser de Alibaba o locales
6. **Tiempo de Entrega**: Estimado en 2 meses desde la confirmación

### Ejemplo de Uso con JavaScript

```javascript
const orderData = {
  customer: {
    fullName: "María González",
    dni: "87654321",
    email: "maria.gonzalez@email.com",
    phone: "987654321",
    address: {
      province: "Arequipa",
      city: "Arequipa",
      district: "Cercado"
    }
  },
  order: {
    items: [
      {
        productId: 789,
        name: "Zapatillas Deportivas",
        price: 45.00,
        quantity: 80,
        total: 3600.00,
        image: "https://s.alicdn.com/product-image.jpg"
      }
    ],
    total: 3600.00,
    orderNumber: "250624002",
    orderDate: new Date().toISOString(),
    status: "pending"
  },
  metadata: {
    source: "web",
    userAgent: navigator.userAgent,
    timestamp: Date.now()
  }
};

try {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Pedido creado:', result.data);
  } else {
    console.error('Error:', result.message);
  }
} catch (error) {
  console.error('Error de red:', error);
}
```

### Webhooks (Opcional)

Si se configuran webhooks, el sistema enviará notificaciones a las siguientes URLs:

- **Pedido Creado**: `POST /webhooks/order-created`
- **Pedido Confirmado**: `POST /webhooks/order-confirmed`
- **Pedido Enviado**: `POST /webhooks/order-shipped`
- **Pedido Entregado**: `POST /webhooks/order-delivered`

### Rate Limiting

- **Límite**: 10 pedidos por minuto por IP
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset en segundos 