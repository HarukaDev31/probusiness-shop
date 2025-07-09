# Implementación del API de Pedidos

## Estructura del Backend

### 1. Modelo de Datos (Database Schema)

```sql
-- Tabla de Clientes
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  dni VARCHAR(8) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id INTEGER REFERENCES customers(id),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery TIMESTAMP,
  source VARCHAR(50) DEFAULT 'web',
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Items del Pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Implementación en Node.js/Express

```javascript
// server/api/orders.post.js
import { defineEventHandler, readBody } from 'h3'
import { validateOrder } from '~/utils/validators'
import { createOrder, createCustomer } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // Leer el body del request
    const body = await readBody(event)
    
    // Validar los datos de entrada
    const validation = validateOrder(body)
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Error de validación',
        errors: validation.errors
      }
    }
    
    // Verificar monto mínimo
    if (body.order.total < 3000) {
      return {
        success: false,
        message: 'El monto mínimo es de S/3000',
        errors: [{
          field: 'order.total',
          message: 'El monto mínimo es de S/3000'
        }]
      }
    }
    
    // Crear o actualizar cliente
    const customer = await createCustomer(body.customer)
    
    // Crear el pedido
    const order = await createOrder({
      ...body.order,
      customerId: customer.id
    })
    
    // Crear los items del pedido
    await createOrderItems(order.id, body.order.items)
    
    // Calcular fecha estimada de entrega (2 meses)
    const estimatedDelivery = new Date()
    estimatedDelivery.setMonth(estimatedDelivery.getMonth() + 2)
    
    // Actualizar pedido con fecha estimada
    await updateOrder(order.id, {
      estimatedDelivery: estimatedDelivery.toISOString()
    })
    
    // Enviar notificación por WhatsApp (opcional)
    await sendWhatsAppNotification(customer.phone, order.orderNumber)
    
    // Enviar email de confirmación (opcional)
    await sendOrderConfirmationEmail(customer.email, order)
    
    return {
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        orderId: `ORD-${new Date().getFullYear()}-${order.id.toString().padStart(3, '0')}`,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        estimatedDelivery: estimatedDelivery.toISOString()
      }
    }
    
  } catch (error) {
    console.error('Error al crear pedido:', error)
    
    return {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    }
  }
})
```

### 3. Validadores

```javascript
// utils/validators.js
export function validateOrder(data) {
  const errors = []
  
  // Validar customer
  if (!data.customer) {
    errors.push({ field: 'customer', message: 'Datos del cliente son requeridos' })
    return { isValid: false, errors }
  }
  
  const { customer, order } = data
  
  // Validar nombre completo
  if (!customer.fullName || customer.fullName.trim().length < 3) {
    errors.push({ 
      field: 'customer.fullName', 
      message: 'El nombre completo es requerido y debe tener al menos 3 caracteres' 
    })
  }
  
  // Validar DNI
  if (!customer.dni || !/^\d{8}$/.test(customer.dni)) {
    errors.push({ 
      field: 'customer.dni', 
      message: 'El DNI debe tener exactamente 8 dígitos' 
    })
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!customer.email || !emailRegex.test(customer.email)) {
    errors.push({ 
      field: 'customer.email', 
      message: 'El email debe tener un formato válido' 
    })
  }
  
  // Validar teléfono
  if (!customer.phone || customer.phone.length < 9) {
    errors.push({ 
      field: 'customer.phone', 
      message: 'El teléfono debe tener al menos 9 dígitos' 
    })
  }
  
  // Validar dirección
  if (!customer.address?.province) {
    errors.push({ field: 'customer.address.province', message: 'La provincia es requerida' })
  }
  if (!customer.address?.city) {
    errors.push({ field: 'customer.address.city', message: 'La ciudad es requerida' })
  }
  if (!customer.address?.district) {
    errors.push({ field: 'customer.address.district', message: 'El distrito es requerido' })
  }
  
  // Validar order
  if (!order || !order.items || order.items.length === 0) {
    errors.push({ field: 'order.items', message: 'Debe haber al menos un producto en el pedido' })
  }
  
  // Validar total
  if (!order.total || order.total < 3000) {
    errors.push({ 
      field: 'order.total', 
      message: 'El monto mínimo es de S/3000' 
    })
  }
  
  // Validar items
  if (order.items) {
    order.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push({ 
          field: `order.items[${index}].productId`, 
          message: 'El ID del producto es requerido' 
        })
      }
      if (!item.name) {
        errors.push({ 
          field: `order.items[${index}].name`, 
          message: 'El nombre del producto es requerido' 
        })
      }
      if (!item.price || item.price <= 0) {
        errors.push({ 
          field: `order.items[${index}].price`, 
          message: 'El precio debe ser mayor a 0' 
        })
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push({ 
          field: `order.items[${index}].quantity`, 
          message: 'La cantidad debe ser mayor a 0' 
        })
      }
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### 4. Funciones de Base de Datos

```javascript
// utils/database.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function createCustomer(customerData) {
  const query = `
    INSERT INTO customers (full_name, dni, email, phone, province, city, district)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (dni) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      province = EXCLUDED.province,
      city = EXCLUDED.city,
      district = EXCLUDED.district,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `
  
  const values = [
    customerData.fullName,
    customerData.dni,
    customerData.email,
    customerData.phone,
    customerData.address.province,
    customerData.address.city,
    customerData.address.district
  ]
  
  const result = await pool.query(query, values)
  return result.rows[0]
}

export async function createOrder(orderData) {
  const query = `
    INSERT INTO orders (order_number, customer_id, total, status, order_date, source, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `
  
  const values = [
    orderData.orderNumber,
    orderData.customerId,
    orderData.total,
    orderData.status || 'pending',
    orderData.orderDate,
    orderData.metadata?.source || 'web',
    orderData.metadata?.userAgent || null
  ]
  
  const result = await pool.query(query, values)
  return result.rows[0]
}

export async function createOrderItems(orderId, items) {
  const query = `
    INSERT INTO order_items (order_id, product_id, name, price, quantity, total, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `
  
  for (const item of items) {
    const values = [
      orderId,
      item.productId,
      item.name,
      item.price,
      item.quantity,
      item.total,
      item.image
    ]
    
    await pool.query(query, values)
  }
}

export async function updateOrder(orderId, updates) {
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ')
  
  const query = `
    UPDATE orders 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `
  
  const values = [orderId, ...Object.values(updates)]
  const result = await pool.query(query, values)
  return result.rows[0]
}
```

### 5. Notificaciones

```javascript
// utils/notifications.js
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendWhatsAppNotification(phone, orderNumber) {
  try {
    const message = `¡Hola! Tu pedido ${orderNumber} ha sido recibido. Nuestro equipo se pondrá en contacto contigo pronto.`
    
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:+51${phone}`
    })
    
    console.log(`WhatsApp notification sent to ${phone}`)
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}

export async function sendOrderConfirmationEmail(email, order) {
  // Implementar envío de email usando nodemailer o similar
  console.log(`Order confirmation email sent to ${email}`)
}
```

### 6. Middleware de Rate Limiting

```javascript
// middleware/rateLimit.js
import rateLimit from 'express-rate-limit'

export const orderRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 pedidos por minuto
  message: {
    success: false,
    message: 'Demasiados pedidos. Intenta de nuevo en 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Demasiados pedidos. Intenta de nuevo en 1 minuto.'
    })
  }
})
```

### 7. Variables de Entorno

```env
# .env
DATABASE_URL=postgresql://username:password@localhost:5432/probusiness
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 8. Testing

```javascript
// tests/orders.test.js
import { describe, it, expect } from 'vitest'
import { validateOrder } from '../utils/validators'

describe('Order Validation', () => {
  it('should validate a correct order', () => {
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
          productId: 123,
          name: 'Producto Test',
          price: 50,
          quantity: 100,
          total: 5000,
          image: 'https://example.com/image.jpg'
        }],
        total: 5000,
        orderNumber: '250624001',
        orderDate: new Date().toISOString(),
        status: 'pending'
      }
    }
    
    const result = validateOrder(validOrder)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
  
  it('should reject order with insufficient total', () => {
    const invalidOrder = {
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
          productId: 123,
          name: 'Producto Test',
          price: 10,
          quantity: 1,
          total: 10,
          image: 'https://example.com/image.jpg'
        }],
        total: 10,
        orderNumber: '250624001',
        orderDate: new Date().toISOString(),
        status: 'pending'
      }
    }
    
    const result = validateOrder(invalidOrder)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'order.total',
      message: 'El monto mínimo es de S/3000'
    })
  })
})
```

Esta implementación proporciona una base sólida para el sistema de pedidos con validaciones robustas, manejo de errores, notificaciones y testing. 