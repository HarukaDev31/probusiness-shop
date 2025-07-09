import { ref, computed, readonly } from 'vue'
import orderService from '~/services/order-service'

export function useOrders() {
  const loading = ref(false)
  const error = ref(null)
  const orders = ref([])
  const currentOrder = ref(null)

  /**
   * Crear un nuevo pedido
   * @param {Object} customerData - Datos del cliente
   * @param {Array} cartItems - Items del carrito
   * @param {number} cartTotal - Total del carrito
   * @returns {Promise<Object>} Resultado de la operación
   */
  const createOrder = async (customerData, cartItems, cartTotal) => {
    loading.value = true
    error.value = null

    try {
      // Validar monto mínimo
      if (cartTotal < 3000) {
        throw new Error('El monto mínimo es de S/3000')
      }

      // Preparar datos del pedido
      const orderData = orderService.prepareOrderData(customerData, cartItems, cartTotal)
      
      // Validar datos
      const validation = orderService.validateOrderData(orderData)
      if (!validation.isValid) {
        const errorMessages = validation.errors.map(err => err.message).join('\n')
        throw new Error(`Errores de validación:\n${errorMessages}`)
      }

      // Enviar pedido
      const response = await orderService.createOrder(orderData)
      
      if (response.success) {
        currentOrder.value = response.data
        return {
          success: true,
          data: response.data,
          message: 'Pedido creado exitosamente'
        }
      } else {
        throw new Error(response.message || 'Error al crear el pedido')
      }

    } catch (err) {
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener pedidos del cliente
   * @param {string} customerId - ID del cliente
   * @returns {Promise<Object>} Resultado de la operación
   */
  const getCustomerOrders = async (customerId) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getCustomerOrders(customerId)
      
      if (response.success) {
        orders.value = response.data
        return {
          success: true,
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Error al obtener los pedidos')
      }

    } catch (err) {
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener detalles de un pedido
   * @param {string} orderId - ID del pedido
   * @returns {Promise<Object>} Resultado de la operación
   */
  const getOrderDetails = async (orderId) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getOrderDetails(orderId)
      
      if (response.success) {
        currentOrder.value = response.data
        return {
          success: true,
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Error al obtener los detalles del pedido')
      }

    } catch (err) {
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar estado de un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Resultado de la operación
   */
  const updateOrderStatus = async (orderId, status) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.updateOrderStatus(orderId, status)
      
      if (response.success) {
        // Actualizar el pedido actual si es el mismo
        if (currentOrder.value && currentOrder.value.id === orderId) {
          currentOrder.value.status = status
        }
        
        return {
          success: true,
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Error al actualizar el estado del pedido')
      }

    } catch (err) {
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancelar un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} reason - Razón de la cancelación
   * @returns {Promise<Object>} Resultado de la operación
   */
  const cancelOrder = async (orderId, reason = 'Cancelado por el cliente') => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.cancelOrder(orderId, reason)
      
      if (response.success) {
        // Actualizar el pedido actual si es el mismo
        if (currentOrder.value && currentOrder.value.id === orderId) {
          currentOrder.value.status = 'cancelled'
        }
        
        return {
          success: true,
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Error al cancelar el pedido')
      }

    } catch (err) {
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Validar datos del cliente
   * @param {Object} customerData - Datos del cliente
   * @returns {Object} Resultado de la validación
   */
  const validateCustomerData = (customerData) => {
    const errors = []

    if (!customerData.fullName || customerData.fullName.trim().length < 3) {
      errors.push('El nombre completo es requerido y debe tener al menos 3 caracteres')
    }

    if (!customerData.dni || !/^\d{8}$/.test(customerData.dni)) {
      errors.push('El DNI debe tener exactamente 8 dígitos')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!customerData.email || !emailRegex.test(customerData.email)) {
      errors.push('El email debe tener un formato válido')
    }

    if (!customerData.phone || customerData.phone.length < 9) {
      errors.push('El teléfono debe tener al menos 9 dígitos')
    }

    if (!customerData.province) {
      errors.push('La provincia es requerida')
    }

    if (!customerData.city) {
      errors.push('La ciudad es requerida')
    }

    if (!customerData.district) {
      errors.push('El distrito es requerido')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Limpiar errores
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Limpiar estado
   */
  const reset = () => {
    loading.value = false
    error.value = null
    orders.value = []
    currentOrder.value = null
  }

  // Computed properties
  const hasOrders = computed(() => orders.value.length > 0)
  const hasError = computed(() => error.value !== null)
  const isLoading = computed(() => loading.value)

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    orders: readonly(orders),
    currentOrder: readonly(currentOrder),
    
    // Computed
    hasOrders,
    hasError,
    isLoading,
    
    // Methods
    createOrder,
    getCustomerOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    validateCustomerData,
    clearError,
    reset
  }
} 