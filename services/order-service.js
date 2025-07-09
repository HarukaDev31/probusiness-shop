import { apiClient } from '~/utils/api-client'

class OrderService {
  constructor() {
    // Ya no necesitamos baseURL porque apiClient maneja las URLs
  }

  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.api('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error al crear pedido:', error)
      
      // Manejar diferentes tipos de errores
      if (error.message.includes('400')) {
        return {
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.data?.errors || []
        }
      }
      
      if (error.message.includes('422')) {
        return {
          success: false,
          message: 'Error de validación',
          errors: error.data?.errors || []
        }
      }
      
      if (error.message.includes('429')) {
        return {
          success: false,
          message: 'Demasiados pedidos. Intenta de nuevo en 1 minuto.'
        }
      }
      
      if (error.message.includes('500')) {
        return {
          success: false,
          message: 'Error interno del servidor. Intenta de nuevo más tarde.'
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.'
      }
    }
  }

  /**
   * Obtener pedidos del usuario
   * @param {string} customerId - ID del cliente
   * @returns {Promise<Object>} Lista de pedidos
   */
  async getCustomerOrders(customerId) {
    try {
      const response = await apiClient.api(`/orders/customer/${customerId}`)

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
      
      return {
        success: false,
        message: 'Error al obtener los pedidos',
        error: error.message
      }
    }
  }

  /**
   * Obtener detalles de un pedido específico
   * @param {string} orderId - ID del pedido
   * @returns {Promise<Object>} Detalles del pedido
   */
  async getOrderDetails(orderId) {
    try {
      const response = await apiClient.api(`/orders/${orderId}`)

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error al obtener detalles del pedido:', error)
      
      return {
        success: false,
        message: 'Error al obtener los detalles del pedido',
        error: error.message
      }
    }
  }

  /**
   * Actualizar estado de un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { status })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error)
      
      return {
        success: false,
        message: 'Error al actualizar el estado del pedido',
        error: error.message
      }
    }
  }

  /**
   * Cancelar un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} reason - Razón de la cancelación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async cancelOrder(orderId, reason = 'Cancelado por el cliente') {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Error al cancelar pedido:', error)
      
      return {
        success: false,
        message: 'Error al cancelar el pedido',
        error: error.message
      }
    }
  }

  /**
   * Validar datos del pedido antes de enviar
   * @param {Object} orderData - Datos del pedido a validar
   * @returns {Object} Resultado de la validación
   */
  validateOrderData(orderData) {
    const errors = []

    // Validar customer
    if (!orderData.customer) {
      errors.push({ field: 'customer', message: 'Datos del cliente son requeridos' })
      return { isValid: false, errors }
    }

    const { customer, order } = orderData

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

  /**
   * Generar número de pedido único
   * @returns {string} Número de pedido generado
   */
  generateOrderNumber() {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${day}${month}${year}${random}`
  }

  /**
   * Preparar datos del pedido para envío
   * @param {Object} customerData - Datos del cliente
   * @param {Array} cartItems - Items del carrito
   * @param {number} cartTotal - Total del carrito
   * @returns {Object} Datos del pedido preparados
   */
  prepareOrderData(customerData, cartItems, cartTotal) {
    return {
      customer: {
        fullName: customerData.fullName,
        dni: customerData.dni,
        email: customerData.email,
        phone: customerData.phone,
        address: {
          province: customerData.province,
          city: customerData.city,
          district: customerData.district
        }
      },
      order: {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          image: item.image
        })),
        total: cartTotal,
        orderNumber: this.generateOrderNumber(),
        orderDate: new Date().toISOString(),
        status: 'pending'
      },
      metadata: {
        source: 'web',
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    }
  }
}

// Crear instancia singleton
const orderService = new OrderService()

export default orderService