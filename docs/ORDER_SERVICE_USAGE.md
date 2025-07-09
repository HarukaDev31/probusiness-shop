# Uso del Servicio de Pedidos

## Descripción

El servicio de pedidos (`order-service.js`) y el composable (`useOrders.js`) proporcionan una capa de abstracción para manejar todas las operaciones relacionadas con pedidos en la aplicación ProBusiness.

## Estructura

### 1. Servicio (`services/order-service.js`)

El servicio maneja las peticiones HTTP y la lógica de negocio:

```javascript
import orderService from '~/services/order-service'

// Crear un pedido
const result = await orderService.createOrder(orderData)

// Obtener pedidos del cliente
const orders = await orderService.getCustomerOrders(customerId)

// Obtener detalles de un pedido
const orderDetails = await orderService.getOrderDetails(orderId)
```

### 2. Composable (`composables/useOrders.js`)

El composable proporciona estado reactivo y métodos convenientes:

```javascript
import { useOrders } from '~/composables/useOrders'

const { 
  createOrder, 
  loading, 
  error, 
  orders,
  hasOrders,
  hasError 
} = useOrders()
```

## Uso Básico

### Crear un Pedido

```vue
<template>
  <button 
    @click="handleCreateOrder"
    :disabled="loading"
    class="bg-[#FF5000] text-white px-6 py-3 rounded"
  >
    {{ loading ? 'Procesando...' : 'Crear Pedido' }}
  </button>
</template>

<script setup>
import { useOrders } from '~/composables/useOrders'

const { createOrder, loading, error } = useOrders()

async function handleCreateOrder() {
  const customerData = {
    fullName: 'Juan Pérez',
    dni: '12345678',
    email: 'juan@email.com',
    phone: '999888777',
    province: 'Lima',
    city: 'Lima',
    district: 'Miraflores'
  }

  const cartItems = [
    {
      id: 1,
      name: 'Producto Test',
      price: 50,
      quantity: 100,
      image: 'https://example.com/image.jpg'
    }
  ]

  const cartTotal = 5000

  const result = await createOrder(customerData, cartItems, cartTotal)

  if (result.success) {
    alert('Pedido creado exitosamente')
  } else {
    alert('Error: ' + result.message)
  }
}
</script>
```

### Listar Pedidos

```vue
<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="w-8 h-8 border-4 border-[#FF5000] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="mt-2 text-gray-600">Cargando pedidos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="bg-red-50 border border-red-200 rounded p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadOrders" class="mt-2 text-red-600 underline">
        Intentar de nuevo
      </button>
    </div>

    <!-- Orders List -->
    <div v-else-if="hasOrders" class="space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <h3 class="font-semibold">Pedido #{{ order.orderNumber }}</h3>
        <p class="text-gray-600">{{ $formatPrice(order.total) }}</p>
        <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {{ order.status }}
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600">No tienes pedidos aún</p>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '~/composables/useOrders'

const { 
  orders, 
  loading, 
  error, 
  hasOrders, 
  hasError, 
  getCustomerOrders 
} = useOrders()

onMounted(() => {
  loadOrders()
})

async function loadOrders() {
  const customerId = 'demo-customer-id'
  await getCustomerOrders(customerId)
}
</script>
```

## Métodos Disponibles

### Servicio (`orderService`)

| Método | Descripción | Parámetros | Retorna |
|--------|-------------|------------|---------|
| `createOrder(orderData)` | Crear un nuevo pedido | `orderData: Object` | `Promise<Object>` |
| `getCustomerOrders(customerId)` | Obtener pedidos del cliente | `customerId: string` | `Promise<Object>` |
| `getOrderDetails(orderId)` | Obtener detalles de un pedido | `orderId: string` | `Promise<Object>` |
| `updateOrderStatus(orderId, status)` | Actualizar estado del pedido | `orderId: string, status: string` | `Promise<Object>` |
| `cancelOrder(orderId, reason)` | Cancelar un pedido | `orderId: string, reason: string` | `Promise<Object>` |
| `validateOrderData(orderData)` | Validar datos del pedido | `orderData: Object` | `Object` |
| `prepareOrderData(customerData, cartItems, cartTotal)` | Preparar datos para envío | `customerData: Object, cartItems: Array, cartTotal: number` | `Object` |

### Composable (`useOrders`)

| Propiedad/Método | Tipo | Descripción |
|------------------|------|-------------|
| `loading` | `Ref<boolean>` | Estado de carga |
| `error` | `Ref<string>` | Mensaje de error |
| `orders` | `Ref<Array>` | Lista de pedidos |
| `currentOrder` | `Ref<Object>` | Pedido actual |
| `hasOrders` | `Computed<boolean>` | Si hay pedidos |
| `hasError` | `Computed<boolean>` | Si hay error |
| `isLoading` | `Computed<boolean>` | Si está cargando |
| `createOrder(customerData, cartItems, cartTotal)` | `Function` | Crear pedido |
| `getCustomerOrders(customerId)` | `Function` | Obtener pedidos |
| `getOrderDetails(orderId)` | `Function` | Obtener detalles |
| `updateOrderStatus(orderId, status)` | `Function` | Actualizar estado |
| `cancelOrder(orderId, reason)` | `Function` | Cancelar pedido |
| `validateCustomerData(customerData)` | `Function` | Validar datos cliente |
| `clearError()` | `Function` | Limpiar error |
| `reset()` | `Function` | Resetear estado |

## Validaciones

### Datos del Cliente

```javascript
const validation = orderService.validateOrderData(orderData)

if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`)
  })
}
```

### Validaciones Incluidas

- **Nombre completo**: Mínimo 3 caracteres
- **DNI**: Exactamente 8 dígitos
- **Email**: Formato válido
- **Teléfono**: Mínimo 9 dígitos
- **Dirección**: Provincia, ciudad y distrito requeridos
- **Productos**: Mínimo 1 item
- **Total**: Mínimo S/3000
- **Precios y cantidades**: Valores positivos

## Manejo de Errores

### Tipos de Error

```javascript
// Error de validación (400)
{
  success: false,
  message: 'Error de validación',
  errors: [
    { field: 'customer.fullName', message: 'El nombre es requerido' }
  ]
}

// Error de rate limiting (429)
{
  success: false,
  message: 'Demasiados pedidos. Intenta de nuevo en 1 minuto.'
}

// Error del servidor (500)
{
  success: false,
  message: 'Error interno del servidor. Intenta de nuevo más tarde.'
}

// Error de conexión
{
  success: false,
  message: 'Error de conexión. Verifica tu conexión a internet.'
}
```

### Ejemplo de Manejo

```javascript
const result = await createOrder(customerData, cartItems, cartTotal)

if (result.success) {
  // Éxito
  console.log('Pedido creado:', result.data)
} else {
  // Error
  if (result.errors && result.errors.length > 0) {
    // Errores de validación específicos
    result.errors.forEach(error => {
      console.error(`${error.field}: ${error.message}`)
    })
  } else {
    // Error general
    console.error(result.message)
  }
}
```

## Estados del Pedido

| Estado | Descripción | Color |
|--------|-------------|-------|
| `pending` | Pendiente de confirmación | Amarillo |
| `confirmed` | Confirmado por el cliente | Azul |
| `processing` | En proceso de importación | Púrpura |
| `shipped` | Enviado al cliente | Índigo |
| `delivered` | Entregado al cliente | Verde |
| `cancelled` | Pedido cancelado | Rojo |

## Configuración

### Variables de Entorno

```env
# .env
DATABASE_URL=postgresql://username:password@localhost:5432/probusiness
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### URLs del Servicio

```javascript
// Desarrollo
baseURL: 'http://localhost:3000/api'

// Producción
baseURL: 'https://tienda.probusiness.pe/api'
```

## Ejemplos de Uso Avanzado

### Paginación

```javascript
const { getCustomerOrders, orders } = useOrders()

async function loadOrders(page = 1, limit = 10) {
  const customerId = 'demo-customer-id'
  const result = await getCustomerOrders(customerId, { page, limit })
  
  if (result.success) {
    // Los pedidos se actualizan automáticamente en orders.value
    console.log('Pedidos cargados:', orders.value)
  }
}
```

### Filtros

```javascript
async function loadOrdersByStatus(status) {
  const customerId = 'demo-customer-id'
  const result = await getCustomerOrders(customerId, { status })
  
  if (result.success) {
    console.log('Pedidos filtrados:', orders.value)
  }
}
```

### Actualización en Tiempo Real

```javascript
const { updateOrderStatus, currentOrder } = useOrders()

async function confirmOrder(orderId) {
  const result = await updateOrderStatus(orderId, 'confirmed')
  
  if (result.success) {
    // currentOrder.value se actualiza automáticamente
    console.log('Pedido confirmado:', currentOrder.value)
  }
}
```

## Testing

### Ejemplo de Test

```javascript
import { describe, it, expect, vi } from 'vitest'
import orderService from '../services/order-service'

describe('OrderService', () => {
  it('should validate order data correctly', () => {
    const validOrder = {
      customer: {
        fullName: 'Juan Pérez',
        dni: '12345678',
        email: 'juan@email.com',
        phone: '999888777',
        address: {
          province: 'Lima',
          city: 'Lima',
          district: 'Miraflores'
        }
      },
      order: {
        items: [{
          productId: 1,
          name: 'Producto Test',
          price: 50,
          quantity: 100,
          total: 5000,
          image: 'https://example.com/image.jpg'
        }],
        total: 5000
      }
    }

    const result = orderService.validateOrderData(validOrder)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject invalid order data', () => {
    const invalidOrder = {
      customer: {
        fullName: 'J', // Muy corto
        dni: '123', // Muy corto
        email: 'invalid-email', // Formato inválido
        phone: '123', // Muy corto
        address: {
          province: '',
          city: '',
          district: ''
        }
      },
      order: {
        items: [],
        total: 1000 // Menos del mínimo
      }
    }

    const result = orderService.validateOrderData(invalidOrder)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
```

## Mejores Prácticas

1. **Siempre manejar errores**: Usa try-catch o verifica `result.success`
2. **Validar datos antes de enviar**: Usa `validateOrderData()` o `validateCustomerData()`
3. **Mostrar estados de carga**: Usa `loading` para mejorar UX
4. **Limpiar errores**: Usa `clearError()` antes de nuevas operaciones
5. **Usar el composable**: Prefiere `useOrders()` sobre el servicio directo
6. **Manejar estados reactivos**: Los datos se actualizan automáticamente
7. **Implementar retry logic**: Para operaciones críticas
8. **Logging**: Registra errores para debugging

## Troubleshooting

### Problemas Comunes

1. **Error 429 (Rate Limiting)**
   - Espera 1 minuto antes de intentar de nuevo
   - Implementa retry logic con delay

2. **Error de Validación**
   - Verifica todos los campos requeridos
   - Usa `validateOrderData()` antes de enviar

3. **Error de Conexión**
   - Verifica la conexión a internet
   - Implementa fallback o cache local

4. **Error del Servidor**
   - Revisa los logs del servidor
   - Implementa notificaciones de error

### Debug

```javascript
// Habilitar logs detallados
const DEBUG = true

if (DEBUG) {
  console.log('Order data:', orderData)
  console.log('Validation result:', validation)
  console.log('API response:', response)
}
``` 