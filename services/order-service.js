import { apiClient } from '~/utils/api-client'

class OrderService {
    async createOrder(orderData) {
        try {
            const data = await apiClient.auth('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            })
            return { success: true, data: data.data }
        } catch (error) {
            console.error('Error creating order:', error)
            throw new Error(error.message || 'Error al crear la orden')
        }
    }
}

export const orderService = new OrderService()