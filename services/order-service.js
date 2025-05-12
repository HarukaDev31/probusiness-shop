class OrderService {
    
    async createOrder(orderData) {
        const { public: { apiUrl } } = useRuntimeConfig();

        const response = await fetch(`${apiUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        const data = await response.json();
        return {success: true, data: data.data};
    }
}
export const orderService = new OrderService();